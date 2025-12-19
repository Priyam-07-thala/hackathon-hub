/**
 * Environment variable validation
 * Ensures required environment variables are present at runtime
 */

function getEnvVar(key: keyof ImportMetaEnv, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (!value || value === '') {
    if (import.meta.env.DEV) {
      console.error(`⚠️ Missing required environment variable: ${key}`);
      console.error('Please create a .env file with the required variables. See .env.example for reference.');
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

export const env = {
  VITE_SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
  VITE_SUPABASE_PUBLISHABLE_KEY: getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY'),
} as const;

