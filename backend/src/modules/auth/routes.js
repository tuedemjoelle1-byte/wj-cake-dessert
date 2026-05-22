import { fail, ok } from "../../core/http.js";
import { requireFields } from "../../core/validation.js";
import { readBearerToken } from "../../lib/auth.js";
import {
  addAddress,
  changeCurrentPassword,
  createUser,
  deleteAddress,
  getCurrentUser,
  listAddresses,
  loginUser,
  requestPasswordReset,
  resetPassword,
  updateCurrentUser
} from "./service.js";

export function registerAuthRoutes(router) {
  router.post("/api/v1/auth/register", ({ res, body }) => {
    try {
      requireFields(body, ["firstName", "lastName", "email", "password"]);
      return Promise.resolve(createUser(body))
        .then((result) => ok(res, result, 201))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.post("/api/v1/auth/login", ({ res, body }) => {
    try {
      requireFields(body, ["email", "password"]);
      return Promise.resolve(loginUser(body))
        .then((result) => ok(res, result))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.post("/api/v1/auth/forgot-password", ({ res, body }) => {
    try {
      requireFields(body, ["email"]);
      return Promise.resolve(requestPasswordReset(body.email))
        .then((result) => ok(res, result))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.post("/api/v1/auth/reset-password", ({ res, body }) => {
    try {
      requireFields(body, ["token", "newPassword"]);
      return Promise.resolve(resetPassword(body))
        .then((result) => ok(res, result))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.get("/api/v1/me", ({ req, res }) => {
    const token = readBearerToken(req);
    return Promise.resolve(getCurrentUser(token))
      .then((user) => ok(res, { item: user }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.patch("/api/v1/me", ({ req, res, body }) => {
    const token = readBearerToken(req);
    return Promise.resolve(updateCurrentUser(token, body))
      .then((user) => ok(res, { item: user }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.patch("/api/v1/me/password", ({ req, res, body }) => {
    try {
      requireFields(body, ["currentPassword", "newPassword"]);
      const token = readBearerToken(req);
      return Promise.resolve(changeCurrentPassword(token, body))
        .then((result) => ok(res, result))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.get("/api/v1/me/addresses", ({ req, res }) => {
    const token = readBearerToken(req);
    return Promise.resolve(listAddresses(token))
      .then((items) => ok(res, { items }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.post("/api/v1/me/addresses", ({ req, res, body }) => {
    try {
      requireFields(body, ["label", "line1", "city"]);
      const token = readBearerToken(req);
      return Promise.resolve(addAddress(token, body))
        .then((items) => ok(res, { items }, 201))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.delete("/api/v1/me/addresses/:id", ({ req, res, params }) => {
    const token = readBearerToken(req);
    return Promise.resolve(deleteAddress(token, params.id))
      .then((items) => ok(res, { items }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });
}
