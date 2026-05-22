export function createPublicId(prefix) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}`;
}

export function timestamp() {
  return new Date().toISOString();
}
