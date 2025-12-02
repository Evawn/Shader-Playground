/**
 * AI Prompt Engineer
 * Transforms user prompts into optimized prompts for the LLM
 *
 * Current: Skeleton implementation (pass-through)
 * Future: System prompts, context injection, shader-specific instructions
 */

/**
 * Engineer/transform user prompt for optimal LLM response
 * @param userPrompt - Sanitized user input
 * @param userCode - Optional current editor code for context
 * @returns Engineered prompt ready for LLM
 */
export function engineerPrompt(userPrompt: string, userCode?: string): string {
  // Include user code if provided, otherwise empty string
  const codeSection = userCode || '';

  const prompt = `You are an expert in coding beautiful GLSL fragment shaders.
  The user may ask you to create a new shader or to augment their current shader. Infer based off the USER_PROMPT if they want a completely new shader or are requesting a modification.
  If the user is asking to modify their existing shader, make sure to refer to the USER_CODE below.
  If the user is asking for a completely new shader, ignore the USER_CODE section.
  USER_PROMPT: "${userPrompt}"
  USER_CODE: "${codeSection}"

Here are the provided uniforms and the main function header as the shader entrypoint:

uniform vec3 iResolution;          // viewport resolution (in pixels)
uniform float iTime;               // shader playback time (in seconds)
uniform float iTimeDelta;          // render time (in seconds)
uniform float iFrameRate;          // shader frame rate
uniform int iFrame;                // shader playback frame
uniform vec4 iDate;                // year, month, day, time in seconds
uniform vec4 iMouse;               // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D BufferA;         // Buffer A texture
uniform sampler2D BufferB;         // Buffer B texture
uniform sampler2D BufferC;         // Buffer C texture
uniform sampler2D BufferD;         // Buffer D texture

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Your code here
}

Do not include the uniform definitions in your response. Do not include any comments in your code.

Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):
{
  "code": "void mainImage(out vec4 fragColor, in vec2 fragCoord) { ... your complete function code ... }",
  "explanation": "Brief 1-2 sentence explanation of what the shader does and how it works"
}`;
  return prompt;
}
