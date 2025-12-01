/**
 * AI Response Parser
 * Parses and transforms LLM responses for the client
 *
 * Parses JSON responses containing code and explanation fields
 */

export interface ParsedAIResponse {
  code: string;
  explanation: string;
}

/**
 * Parse LLM response into structured format with code and explanation
 * @param llmResponse - Raw response content from LLM (expected to be JSON)
 * @returns Parsed response with code and explanation fields
 * @throws Error if response is not valid JSON or missing required fields
 */
export function parseResponse(llmResponse: string): ParsedAIResponse {
  let parsed: unknown;

  // First try direct JSON parse
  try {
    parsed = JSON.parse(llmResponse);
  } catch {
    // Try to extract JSON from markdown code block
    const jsonBlockRegex = /```(?:json)?\s*\n?([\s\S]*?)```/i;
    const match = llmResponse.match(jsonBlockRegex);

    if (match && match[1]) {
      try {
        parsed = JSON.parse(match[1].trim());
      } catch {
        throw new Error(
          'Failed to parse AI response as JSON. Please try again.'
        );
      }
    } else {
      throw new Error(
        'Failed to parse AI response as JSON. Please try again.'
      );
    }
  }

  // Validate required fields
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('code' in parsed) ||
    !('explanation' in parsed)
  ) {
    throw new Error(
      'AI response missing required fields (code, explanation). Please try again.'
    );
  }

  const response = parsed as { code: unknown; explanation: unknown };

  if (typeof response.code !== 'string' || typeof response.explanation !== 'string') {
    throw new Error(
      'AI response fields must be strings. Please try again.'
    );
  }

  return {
    code: response.code,
    explanation: response.explanation,
  };
}
