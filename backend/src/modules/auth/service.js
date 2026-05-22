import { randomBytes } from "node:crypto";
import { getRepository } from "../../data/store.js";
import { hashPassword, verifyPassword } from "../../lib/passwords.js";
import { audit } from "../audit/service.js";
import { notify } from "../notifications/service.js";

const repository = getRepository();

export async function createUser(input) {
  const existingUser = await repository.findUserByEmail(input.email);
  if (existingUser) {
    const error = new Error("Cette adresse e-mail est deja utilisee.");
    error.status = 409;
    error.code = "EMAIL_DEJA_UTILISE";
    throw error;
  }

  const passwordHash = await hashPassword(input.password);
  const user = await repository.createUser({
    ...input,
    passwordHash
  });
  const session = await repository.createSession(user.id);

  await notify({
    type: "inscription",
    channel: "email",
    recipient: user.email,
    subject: "Bienvenue chez W.J. Cake & Dessert",
    content: "Votre compte client a ete cree avec succes.",
    metadata: { userId: user.id }
  });

  await audit({
    action: "auth.register",
    actorType: "customer",
    actorId: user.id,
    targetType: "user",
    targetId: user.id
  });

  return {
    user: sanitizeUser(user),
    tokens: session
  };
}

export async function loginUser(input) {
  const user = await repository.findUserByEmail(input.email);
  const isValid = user ? await verifyPassword(input.password, user.passwordHash) : false;

  if (!user || !isValid) {
    const error = new Error("Identifiants invalides.");
    error.status = 401;
    error.code = "IDENTIFIANTS_INVALIDES";
    throw error;
  }

  const session = await repository.createSession(user.id);

  await audit({
    action: "auth.login",
    actorType: "customer",
    actorId: user.id,
    targetType: "session",
    targetId: session.id || session.accessToken
  });

  return {
    user: sanitizeUser(user),
    tokens: session
  };
}

export async function getCurrentUser(accessToken) {
  const session = await repository.getSessionByAccessToken(accessToken);
  if (!session) {
    const error = new Error("Session invalide.");
    error.status = 401;
    error.code = "SESSION_INVALIDE";
    throw error;
  }

  const user = await repository.getUserById(session.userId);
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.status = 404;
    error.code = "UTILISATEUR_INTROUVABLE";
    throw error;
  }

  return sanitizeUser(user);
}

export async function updateCurrentUser(accessToken, patch) {
  const { user } = await requireAuthenticatedUser(accessToken);
  const updated = await repository.updateUser(user.id, {
    firstName: patch.firstName ?? user.firstName,
    lastName: patch.lastName ?? user.lastName,
    preferences: {
      newsletter: patch.newsletter ?? user.preferences?.newsletter ?? false,
      transactionalEmails: patch.transactionalEmails ?? user.preferences?.transactionalEmails ?? true
    }
  });

  await audit({
    action: "account.profile.update",
    actorType: "customer",
    actorId: user.id,
    targetType: "user",
    targetId: user.id
  });

  return sanitizeUser(updated);
}

export async function changeCurrentPassword(accessToken, input) {
  const { user } = await requireAuthenticatedUser(accessToken);
  const isValid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!isValid) {
    const error = new Error("Le mot de passe actuel est incorrect.");
    error.status = 400;
    error.code = "MOT_DE_PASSE_INVALIDE";
    throw error;
  }

  const passwordHash = await hashPassword(input.newPassword);
  await repository.updateUser(user.id, { passwordHash });

  await audit({
    action: "account.password.change",
    actorType: "customer",
    actorId: user.id,
    targetType: "user",
    targetId: user.id
  });

  return { message: "Mot de passe mis a jour." };
}

export async function requestPasswordReset(email) {
  const user = await repository.findUserByEmail(email);
  if (!user) {
    return {
      message: "Si un compte existe avec cette adresse, un lien de reinitialisation sera envoye."
    };
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

  await repository.createPasswordResetToken({
    userId: user.id,
    email: user.email,
    token,
    expiresAt,
    createdAt: new Date().toISOString()
  });

  await notify({
    type: "password-reset",
    channel: "email",
    recipient: user.email,
    subject: "Reinitialisation de mot de passe",
    content: `Token de reinitialisation: ${token}`,
    metadata: { userId: user.id, expiresAt }
  });

  await audit({
    action: "auth.password-reset.request",
    actorType: "customer",
    actorId: user.id,
    targetType: "user",
    targetId: user.id
  });

  return {
    message: "Si un compte existe avec cette adresse, un lien de reinitialisation sera envoye.",
    resetToken: token
  };
}

export async function resetPassword(input) {
  const record = await repository.getPasswordResetToken(input.token);
  if (!record || record.usedAt || new Date(record.expiresAt).getTime() < Date.now()) {
    const error = new Error("Le token de reinitialisation est invalide ou expire.");
    error.status = 400;
    error.code = "TOKEN_REINITIALISATION_INVALIDE";
    throw error;
  }

  const passwordHash = await hashPassword(input.newPassword);
  await repository.updateUser(record.userId, { passwordHash });
  await repository.markPasswordResetTokenUsed(input.token);

  await audit({
    action: "auth.password-reset.confirm",
    actorType: "customer",
    actorId: record.userId,
    targetType: "user",
    targetId: record.userId
  });

  return { message: "Mot de passe reinitialise avec succes." };
}

export async function listAddresses(accessToken) {
  const { user } = await requireAuthenticatedUser(accessToken);
  return user.addresses || [];
}

export async function addAddress(accessToken, input) {
  const { user } = await requireAuthenticatedUser(accessToken);
  const addresses = [...(user.addresses || [])];
  const address = {
    id: `addr_${randomBytes(6).toString("hex")}`,
    label: input.label,
    line1: input.line1,
    city: input.city,
    zoneCode: input.zoneCode || null,
    isDefault: addresses.length === 0 || Boolean(input.isDefault)
  };

  const normalized = address.isDefault
    ? addresses.map((item) => ({ ...item, isDefault: false })).concat(address)
    : addresses.concat(address);

  const updated = await repository.updateUser(user.id, { addresses: normalized });

  await audit({
    action: "account.address.create",
    actorType: "customer",
    actorId: user.id,
    targetType: "address",
    targetId: address.id
  });

  return updated.addresses;
}

export async function deleteAddress(accessToken, addressId) {
  const { user } = await requireAuthenticatedUser(accessToken);
  const addresses = (user.addresses || []).filter((item) => item.id !== addressId);
  const normalized =
    addresses.length > 0 && !addresses.some((item) => item.isDefault)
      ? addresses.map((item, index) => ({ ...item, isDefault: index === 0 }))
      : addresses;

  const updated = await repository.updateUser(user.id, { addresses: normalized });

  await audit({
    action: "account.address.delete",
    actorType: "customer",
    actorId: user.id,
    targetType: "address",
    targetId: addressId
  });

  return updated.addresses;
}

async function requireAuthenticatedUser(accessToken) {
  const session = await repository.getSessionByAccessToken(accessToken);
  if (!session) {
    const error = new Error("Session invalide.");
    error.status = 401;
    error.code = "SESSION_INVALIDE";
    throw error;
  }

  const user = await repository.getUserById(session.userId);
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.status = 404;
    error.code = "UTILISATEUR_INTROUVABLE";
    throw error;
  }

  return { session, user };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    addresses: user.addresses || [],
    preferences: user.preferences || {
      newsletter: false,
      transactionalEmails: true
    }
  };
}
