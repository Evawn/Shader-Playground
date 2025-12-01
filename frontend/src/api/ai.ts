/**
 * AI API Client
 * Handles communication with the AI backend endpoints
 */

import { apiClient } from './client';
import type { AIPromptRequest, AIPromptResponse } from '@fragcoder/shared';

/**
 * Send a prompt to the AI assistant
 * @param prompt - User's prompt text
 * @param model - Optional model ID to use
 * @returns AI response with message and usage metrics
 */
export async function sendPrompt(prompt: string, model?: string): Promise<AIPromptResponse> {
  const request: AIPromptRequest = { prompt, model };
  const response = await apiClient.post<AIPromptResponse>('/api/ai/prompt', request);
  return response.data;
}
