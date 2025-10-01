/**
 * Environment configuration utilities
 * Centralizes all environment variable access with proper defaults and validation
 */

// API Configuration
export const API_CONFIG = {
  DEEPSEEK_API_URL: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com',
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  DEFAULT_MODEL: import.meta.env.VITE_DEFAULT_MODEL || 'deepseek-chat',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'DeepSeek Chat',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV,
} as const;

// Database Configuration
export const DB_CONFIG = {
  NAME: 'DeepSeekDB',
  VERSION: 1,
  STORE_NAME: 'qa',
} as const;

/**
 * Validates that all required environment variables are present
 * @throws Error if required variables are missing
 */
export function validateEnvironment(): void {
  if (!API_CONFIG.API_KEY) {
    throw new Error(
      'Missing required environment variable: VITE_OPENAI_API_KEY\n' +
      'Please create a .env file in the root directory and add:\n' +
      'VITE_OPENAI_API_KEY=your_api_key_here'
    );
  }
}

/**
 * Gets the API key with validation
 * @returns The API key
 * @throws Error if API key is not configured
 */
export function getApiKey(): string {
  if (!API_CONFIG.API_KEY) {
    throw new Error('API key is not configured. Please check your .env file.');
  }
  return API_CONFIG.API_KEY;
}

/**
 * Gets the full API endpoint URL
 * @param endpoint The API endpoint path
 * @returns The complete URL
 */
export function getApiUrl(endpoint: string = ''): string {
  const baseUrl = API_CONFIG.DEEPSEEK_API_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}

