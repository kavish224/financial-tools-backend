export const DB_NAME = "markets";
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const RATE_LIMITS = {
  DEFAULT: { windowMs: 15 * 60 * 1000, max: 100 },
  AUTH: { windowMs: 15 * 60 * 1000, max: 5 },
  API: { windowMs: 15 * 60 * 1000, max: 1000 }
};
export const CACHE_TTL = {
  SHORT: 5 * 60,
  MEDIUM: 30 * 60,
  LONG: 60 * 60
};