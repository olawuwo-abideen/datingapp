export function isDevelopement(): boolean {
  return process.env.NODE_ENV?.startsWith('dev') ? true : false;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV?.startsWith('prod') ? true : false;
}

export function generateUniqueReference(length = 10) {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let reference = '';

  // Generate random alphanumeric characters
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    reference += characters[index];
  }

  // Append current timestamp in YYYYMMDDHHMMSS format
  const timestamp = new Date().toISOString().slice(0, 14).replace(/\D/g, '');
  reference += timestamp;

  return reference;
}

