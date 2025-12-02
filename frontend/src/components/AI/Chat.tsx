'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Pencil, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Conversation,
  ConversationContent,
} from '../ui/shadcn-io/ai/conversation';
import {
  Message,
  MessageContent,
} from '../ui/shadcn-io/ai/message';
import { Response } from '../ui/shadcn-io/ai/response';
import { Actions, Action } from '../ui/shadcn-io/ai/actions';
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
} from '../ui/shadcn-io/ai/task';
import { CodeArtifact } from './CodeArtifact';
import type { ChatMessageNode, TaskState, BranchInfo } from '../../types/chat';

interface ChatProps {
  messages: ChatMessageNode[];
  taskState: TaskState;
  isLoading: boolean;
  onReroll: (userMessageId: string) => void;
  onEdit: (userMessageId: string, newContent: string) => void;
  onApplyCode: (code: string) => void;
  getBranchInfo: (userMessageId: string) => BranchInfo;
  onBranchChange: (parentKey: string, index: number) => void;
  getAssistantResponses: (userMessageId: string) => ChatMessageNode[];
}

/**
 * UserMessage component with actions and branch navigation
 */
function UserMessage({
  message,
  branchInfo,
  onReroll,
  onEdit,
  onBranchChange,
  onApplyCode,
  isLoading,
}: {
  message: ChatMessageNode;
  branchInfo: BranchInfo;
  onReroll: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onBranchChange: (parentKey: string, index: number) => void;
  onApplyCode: (code: string) => void;
  isLoading: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleSubmitEdit = useCallback(() => {
    if (editedContent.trim() && editedContent !== message.content) {
      onEdit(message.id, editedContent.trim());
    }
    setIsEditing(false);
  }, [editedContent, message.content, message.id, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setEditedContent(message.content);
    setIsEditing(false);
  }, [message.content]);

  const parentKey = message.parentId ?? 'root';

  return (
    <Message from="user">
      <div className="flex flex-col gap-2">
        <MessageContent>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[60px] bg-background"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitEdit} disabled={isLoading}>
                  Submit
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </MessageContent>

        {/* Code artifact if present */}
        {message.codeArtifact && !isEditing && (
          <CodeArtifact
            artifact={message.codeArtifact}
            onApply={onApplyCode}
            className="max-w-[80%] ml-auto"
          />
        )}

        {/* Actions and branch navigation */}
        {!isEditing && (
          <div className="flex items-center gap-1 justify-end">
            {/* Branch navigation (only shown when branches > 1) */}
            {branchInfo.count > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    const newIndex = branchInfo.activeIndex > 0
                      ? branchInfo.activeIndex - 1
                      : branchInfo.count - 1;
                    onBranchChange(parentKey, newIndex);
                  }}
                  disabled={isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums px-1">
                  {branchInfo.activeIndex + 1} of {branchInfo.count}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    const newIndex = branchInfo.activeIndex < branchInfo.count - 1
                      ? branchInfo.activeIndex + 1
                      : 0;
                    onBranchChange(parentKey, newIndex);
                  }}
                  disabled={isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
              </>
            )}

            {/* Action buttons */}
            <Actions>
              <Action
                tooltip="Regenerate"
                onClick={() => onReroll(message.id)}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Action>
              <Action
                tooltip="Edit"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <Pencil className="h-4 w-4" />
              </Action>
            </Actions>
          </div>
        )}
      </div>
    </Message>
  );
}

/**
 * AssistantMessage component with response and code artifact
 */
function AssistantMessage({
  message,
  branchInfo,
  onBranchChange,
  onApplyCode,
  isLoading,
}: {
  message: ChatMessageNode;
  branchInfo: BranchInfo;
  onBranchChange: (parentKey: string, index: number) => void;
  onApplyCode: (code: string) => void;
  isLoading: boolean;
}) {
  // The parent of an assistant message is the user message ID
  const parentKey = message.parentId ?? '';

  return (
    <Message from="assistant">
      <div className="flex flex-col gap-2">
        <MessageContent className={message.isError ? 'bg-red-500/20 border-red-500/50' : ''}>
          <Response className={message.isError ? 'text-red-400' : ''}>
            {message.isError ? `Error: ${message.content}` : message.content}
          </Response>
        </MessageContent>

        {/* Code artifact if present */}
        {message.codeArtifact && (
          <CodeArtifact
            artifact={message.codeArtifact}
            onApply={onApplyCode}
            className="max-w-[80%]"
          />
        )}

        {/* Branch navigation for assistant responses (when multiple responses exist) */}
        {branchInfo.count > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                const newIndex = branchInfo.activeIndex > 0
                  ? branchInfo.activeIndex - 1
                  : branchInfo.count - 1;
                onBranchChange(parentKey, newIndex);
              }}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums px-1">
              {branchInfo.activeIndex + 1} of {branchInfo.count}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                const newIndex = branchInfo.activeIndex < branchInfo.count - 1
                  ? branchInfo.activeIndex + 1
                  : 0;
                onBranchChange(parentKey, newIndex);
              }}
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Message>
  );
}

/**
 * TaskIndicator component showing AI processing status
 */
function TaskIndicator({ taskState }: { taskState: TaskState }) {
  if (taskState.status === 'idle') return null;

  const currentStep = taskState.steps.find(s => s.status === 'in_progress');
  const currentStepLabel = currentStep?.label ?? 'Processing...';

  return (
    <Message from="assistant">
      <MessageContent>
        <Task defaultOpen={true}>
          <TaskTrigger title={currentStepLabel}>
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{currentStepLabel}</span>
            </div>
          </TaskTrigger>
          <TaskContent>
            {taskState.steps.map(step => (
              <TaskItem
                key={step.id}
                className={cn(
                  'flex items-center gap-2',
                  step.status === 'complete' && 'text-green-500',
                  step.status === 'in_progress' && 'text-foreground',
                  step.status === 'pending' && 'text-muted-foreground',
                  step.status === 'error' && 'text-red-500'
                )}
              >
                {step.status === 'complete' && <Check className="h-3 w-3" />}
                {step.status === 'in_progress' && <Loader2 className="h-3 w-3 animate-spin" />}
                {step.status === 'pending' && <div className="h-3 w-3" />}
                {step.status === 'error' && <div className="h-3 w-3 rounded-full bg-red-500" />}
                <span>{step.label}</span>
              </TaskItem>
            ))}
          </TaskContent>
        </Task>
      </MessageContent>
    </Message>
  );
}

/**
 * Main Chat component
 * Displays conversation messages with branching support and actions
 */
export function Chat({
  messages,
  taskState,
  isLoading,
  onReroll,
  onEdit,
  onApplyCode,
  getBranchInfo,
  onBranchChange,
  getAssistantResponses,
}: ChatProps) {
  if (messages.length === 0 && taskState.status === 'idle') {
    return <div className="flex-1" />;
  }

  return (
    <Conversation className="flex-1 min-h-0">
      <ConversationContent className="space-y-3">
        {messages.map((message) => {
          if (message.from === 'user') {
            // For user messages, get branch info based on siblings
            const branchInfo = getBranchInfo(message.id);

            return (
              <UserMessage
                key={message.id}
                message={message}
                branchInfo={branchInfo}
                onReroll={onReroll}
                onEdit={onEdit}
                onBranchChange={onBranchChange}
                onApplyCode={onApplyCode}
                isLoading={isLoading}
              />
            );
          } else {
            // For assistant messages, get branch info from parent user message
            const branchInfo: BranchInfo = message.parentId
              ? {
                  count: getAssistantResponses(message.parentId).length,
                  activeIndex: 0,
                }
              : { count: 1, activeIndex: 0 };

            return (
              <AssistantMessage
                key={message.id}
                message={message}
                branchInfo={branchInfo}
                onBranchChange={onBranchChange}
                onApplyCode={onApplyCode}
                isLoading={isLoading}
              />
            );
          }
        })}

        {/* Show task indicator when processing */}
        {taskState.status !== 'idle' && taskState.status !== 'complete' && (
          <TaskIndicator taskState={taskState} />
        )}
      </ConversationContent>
    </Conversation>
  );
}
