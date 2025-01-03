export function isDevelopement(): boolean {
  return process.env.NODE_ENV?.startsWith('dev') ? true : false;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV?.startsWith('prod') ? true : false;
}


