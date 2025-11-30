/**
 * AI Response Parser
 * Parses and transforms LLM responses for the client
 *
 * Extracts GLSL code from markdown code blocks in LLM responses
 */

/**
 * Parse LLM response into client-ready format
 * Extracts code from markdown code blocks (```glsl, ```hlsl, or generic ```)
 * @param llmResponse - Raw response content from LLM
 * @returns Extracted code or original response if no code block found
 */
export function parseResponse(llmResponse: string): string {
  // Try to match code blocks with language specifier (glsl, hlsl, c, etc.)
  const langCodeBlockRegex = /```(?:glsl|hlsl|c|cpp)?\s*\n([\s\S]*?)```/i;
  const langMatch = llmResponse.match(langCodeBlockRegex);

  if (langMatch && langMatch[1]) {
    return langMatch[1].trim();
  }

  // Try to match any generic code block
  const genericCodeBlockRegex = /```\s*\n?([\s\S]*?)```/;
  const genericMatch = llmResponse.match(genericCodeBlockRegex);

  if (genericMatch && genericMatch[1]) {
    return genericMatch[1].trim();
  }

  // No code block found - return original response
  return llmResponse;
}
