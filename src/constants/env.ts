const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environement variable ${key}`);
  }

  return value;
};

export const PORT = getEnv("PORT");
export const NODE_ENV = getEnv("NODE_ENV");
export const MONGODB_URI = getEnv("MONGODB_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
