/**
 * DeepSeek API service
 * Centralizes all API interactions with proper error handling and configuration
 */

import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, getApiKey, getApiUrl } from '../config/env';

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DeepSeekRequest {
  messages: DeepSeekMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Creates an axios instance with default configuration for DeepSeek API
 */
const createApiClient = () => {
  return axios.create({
    baseURL: API_CONFIG.DEEPSEEK_API_URL,
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  });
};

/**
 * Sends a chat completion request to DeepSeek API
 * @param request The chat completion request
 * @returns Promise<DeepSeekResponse> The API response
 * @throws ApiError if the request fails
 */
export async function sendChatCompletion(request: DeepSeekRequest): Promise<DeepSeekResponse> {
  try {
    const client = createApiClient();
    const response: AxiosResponse<DeepSeekResponse> = await client.post(
      '/v1/chat/completions',
      {
        model: request.model || API_CONFIG.DEFAULT_MODEL,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2000,
        stream: request.stream || false,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.error?.message || error.message,
        status: error.response?.status,
        code: error.response?.data?.error?.code,
      };
      throw apiError;
    }
    
    throw {
      message: 'An unexpected error occurred while communicating with the API',
    } as ApiError;
  }
}

/**
 * Sends a simple question to DeepSeek and returns the response content
 * @param question The user's question
 * @param options Optional configuration for the request
 * @returns Promise<string> The AI's response content
 * @throws ApiError if the request fails
 */
export async function askQuestion(
  question: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> {
  const request: DeepSeekRequest = {
    messages: [{ role: 'user', content: question }],
    model: options.model,
    temperature: options.temperature,
    max_tokens: options.max_tokens,
  };

  const response = await sendChatCompletion(request);
  return response.choices[0]?.message?.content?.trim() || '';
}

/**
 * Validates the API key by making a test request
 * @returns Promise<boolean> True if the API key is valid
 */
export async function validateApiKey(): Promise<boolean> {
  try {
    await askQuestion('Hello', { max_tokens: 10 });
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * Gets available models from the API (if supported)
 * @returns Promise<string[]> Array of available model names
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const client = createApiClient();
    const response = await client.get('/v1/models');
    return response.data.data?.map((model: any) => model.id) || [API_CONFIG.DEFAULT_MODEL];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    // Return default model if we can't fetch the list
    return [API_CONFIG.DEFAULT_MODEL];
  }
}

