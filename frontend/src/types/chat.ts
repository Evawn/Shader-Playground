/**
 * Chat Types
 * Type definitions for the AI chat conversation system with branching support
 */

/**
 * A code artifact associated with a message
 * Represents either user's code context or AI-generated shader code
 */
export interface CodeArtifact {
  id: string;
  type: 'user-context' | 'generated';
  code: string;
  label: string;  // e.g., "Code sent" or "Generated shader"
}

/**
 * Represents a single message in the conversation tree
 * Uses parentId for tree structure to support branching
 */
export interface ChatMessageNode {
  id: string;
  parentId: string | null;  // null for root messages
  from: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isError?: boolean;
  codeArtifact?: CodeArtifact;  // Attached code (user's context or AI's output)
}

/**
 * Status of an individual task step in the AI pipeline
 */
export type TaskStepStatus = 'pending' | 'in_progress' | 'complete' | 'error';

/**
 * Represents a single step in the AI processing pipeline
 */
export interface TaskStep {
  id: string;
  label: string;
  status: TaskStepStatus;
}

/**
 * Overall status of the AI task
 */
export type TaskStatus = 'idle' | 'thinking' | 'compiling' | 'complete' | 'error';

/**
 * State of the current AI task/thinking process
 * Designed for future streaming & retry loops
 */
export interface TaskState {
  status: TaskStatus;
  steps: TaskStep[];
}

/**
 * Branch information for a user message
 */
export interface BranchInfo {
  count: number;
  activeIndex: number;
}

/**
 * Helper type for message pairs (user + assistant responses)
 */
export interface MessagePair {
  userMessage: ChatMessageNode;
  assistantMessages: ChatMessageNode[];
}
