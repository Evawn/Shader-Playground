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
 * @returns Engineered prompt ready for LLM
 */
export function engineerPrompt(userPrompt: string): string {
  // Skeleton: return input unchanged
  // TODO: Implement prompt engineering
  // - Add system prompt with shader context
  // - Include GLSL language specifications
  // - Add examples of good shader code
  // - Include current shader context if available
  const header = "Create the code for a fragment shader that creates the following visual: '";
  const footer = `'

Here are the provided uniforms and the main function header as the shader entrypoint:

\`\`\`
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
    vec2 uv = fragCoord / iResolution.xy;
    fragColor = vec4(uv, 0.5 + 0.5*sin(3.0 * iTime), 1.0);
}
\`\`\`

Do not include the uniform definitions in your response. Do not include any comments in your code.`;
  return header + userPrompt + footer;
}
