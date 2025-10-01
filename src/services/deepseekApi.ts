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
    timeout: 60000, // Increased to 60 seconds timeout
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
    const requestData = {
      model: request.model || API_CONFIG.DEFAULT_MODEL,
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.max_tokens || 2000,
      stream: request.stream || false,
    };

    console.log('Sending request to DeepSeek API:', {
      url: `${API_CONFIG.DEEPSEEK_API_URL}/v1/chat/completions`,
      model: requestData.model,
      messageCount: requestData.messages.length,
    });

    const response: AxiosResponse<DeepSeekResponse> = await client.post(
      '/v1/chat/completions',
      requestData
    );

    console.log('DeepSeek API response received:', {
      status: response.status,
      model: response.data.model,
      usage: response.data.usage,
    });

    return response.data;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.error?.message || error.message,
        status: error.response?.status,
        code: error.response?.data?.error?.code,
      };
      
      // Add more specific error handling
      if (error.code === 'ECONNABORTED') {
        apiError.message = 'Request timeout - the API took too long to respond';
      } else if (error.code === 'NETWORK_ERROR') {
        apiError.message = 'Network error - please check your internet connection';
      }
      
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
    console.log('Testing API connection...');
    const result = await askQuestion('Hello', { max_tokens: 10 });
    console.log('API test successful:', result);
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * Test API connection with detailed logging
 * @returns Promise<void>
 */
export async function testApiConnection(): Promise<void> {
  try {
    console.log('🔍 Testing DeepSeek API connection...');
    console.log('API URL:', API_CONFIG.DEEPSEEK_API_URL);
    console.log('API Key configured:', !!API_CONFIG.API_KEY);
    console.log('API Key length:', API_CONFIG.API_KEY?.length || 0);
    
    const startTime = Date.now();
    const response = await askQuestion('Test connection', { max_tokens: 5 });
    const duration = Date.now() - startTime;
    
    console.log('✅ API connection successful!');
    console.log('Response:', response);
    console.log('Response time:', duration + 'ms');
  } catch (error) {
    console.error('❌ API connection failed:', error);
    throw error;
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

