/**
 * envConfig — centralised environment configuration with validation.
 * All test configuration is loaded from environment variables — no hardcoded values.
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Required environment variable ${name} is not set. Check .env.example`)
  return value
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback
}

export const config = {
  baseUrl:       optionalEnv('BASE_URL',      'http://localhost:3000'),
  apiBaseUrl:    optionalEnv('API_BASE_URL',  'http://localhost:3000/api'),
  username:      optionalEnv('TEST_USERNAME', ''),
  password:      optionalEnv('TEST_PASSWORD', ''),
  apiToken:      optionalEnv('API_TOKEN',     ''),
  authStatePath: optionalEnv('AUTH_STATE_PATH', '.auth/user.json'),
  headless:      optionalEnv('HEADLESS', 'true') === 'true',
  ci:            optionalEnv('CI', 'false') === 'true',
  skipAuth:      optionalEnv('SKIP_AUTH', 'false') === 'true',
} as const

export type Config = typeof config
