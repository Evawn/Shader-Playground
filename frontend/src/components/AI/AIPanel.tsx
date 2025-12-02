'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
} from '../ui/shadcn-io/ai/prompt-input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { sendPrompt } from '../../api/ai';
import { getErrorMessage } from '../../api/client';
import { Chat } from './Chat';
import { useChatState } from './hooks/useChatState';
import type { TabData } from '@fragcoder/shared';

const AVAILABLE_MODELS = [
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
];

interface AIPanelProps {
  isOpen: boolean;
  isMobile?: boolean;
  onClose: () => void;
  setCodeAndCompile: (newCode: string, tabId: string) => void;
  tabs: TabData[];
}

export function AIPanel({
  isOpen,
  isMobile = false,
  onClose,
  setCodeAndCompile,
  tabs,
}: AIPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [includeCode, setIncludeCode] = useState(true);

  const chatState = useChatState();

  /**
   * Get the current code from the Image tab
   */
  const getCurrentCode = useCallback((): string | undefined => {
    if (!includeCode) return undefined;
    const imageTab = tabs.find(t => t.id === '1');
    return imageTab?.code;
  }, [tabs, includeCode]);

  /**
   * Handle applying code from an artifact to the editor
   */
  const handleApplyCode = useCallback((code: string) => {
    setCodeAndCompile(code, '1');
  }, [setCodeAndCompile]);

  /**
   * Core API call logic - used by submit, reroll, and edit
   */
  const callAPI = useCallback(async (
    promptText: string,
    userMessageId: string,
    codeContext?: string
  ) => {
    chatState.startTask();

    try {
      const response = await sendPrompt(promptText, selectedModel, codeContext);

      // Transition to compiling
      chatState.setCompiling();

      // Update the editor with generated code
      setCodeAndCompile(response.code, '1');

      // Add assistant response with code artifact
      chatState.addAssistantMessage(
        userMessageId,
        response.explanation,
        response.code
      );

      // Complete the task
      chatState.completeTask();
    } catch (error) {
      chatState.errorTask();
      chatState.addAssistantMessage(
        userMessageId,
        getErrorMessage(error),
        undefined,
        true
      );
    }
  }, [selectedModel, setCodeAndCompile, chatState]);

  /**
   * Handle new prompt submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const promptText = inputValue.trim();
    const codeContext = getCurrentCode();

    // Determine parent ID - for follow-up messages, use the last assistant's ID
    const parentId = chatState.getLastAssistantId();

    // Add user message
    const userMsgId = chatState.addUserMessage(promptText, codeContext, parentId);

    setInputValue('');
    setIsLoading(true);

    await callAPI(promptText, userMsgId, codeContext);

    setIsLoading(false);
  };

  /**
   * Handle regenerating a response for a user message
   */
  const handleReroll = useCallback(async (userMessageId: string) => {
    if (isLoading) return;

    const rerollInfo = chatState.prepareReroll(userMessageId);
    if (!rerollInfo) return;

    setIsLoading(true);
    await callAPI(rerollInfo.content, userMessageId, rerollInfo.codeContext);
    // Switch to the new branch after reroll
    chatState.activateNewBranch(userMessageId);
    setIsLoading(false);
  }, [isLoading, chatState, callAPI]);

  /**
   * Handle editing a user message and regenerating
   */
  const handleEdit = useCallback(async (userMessageId: string, newContent: string) => {
    if (isLoading) return;

    // Get the parent of the original message to create a sibling
    const originalMessage = chatState.messages.find(m => m.id === userMessageId);
    if (!originalMessage) return;

    const codeContext = getCurrentCode();
    const parentId = originalMessage.parentId;

    // Add a new user message as a sibling (same parent)
    const newUserMsgId = chatState.addUserMessage(newContent, codeContext, parentId);

    setIsLoading(true);
    await callAPI(newContent, newUserMsgId, codeContext);
    setIsLoading(false);

    // Switch to show the new branch
    const parentKey = parentId ?? 'root';
    const siblings = chatState.messages.filter(
      m => m.parentId === parentId && m.from === 'user'
    );
    chatState.setActiveBranch(parentKey, siblings.length - 1);
  }, [isLoading, chatState, callAPI, getCurrentCode]);

  const panelContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <span className="text-sm font-medium text-foreground">AI</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={chatState.clearHistory}
            disabled={chatState.messages.length === 0}
            className="h-7 w-7 text-foreground-muted hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-foreground-muted hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
      {/* Separator - not full width */}
      <div className="mx-4 border-b border-accent-shadow" />

      {/* Main Content Area - Chat component */}
      <Chat
        messages={chatState.displayMessages}
        taskState={chatState.taskState}
        isLoading={isLoading}
        onReroll={handleReroll}
        onEdit={handleEdit}
        onApplyCode={handleApplyCode}
        getBranchInfo={chatState.getBranchInfo}
        onBranchChange={chatState.setActiveBranch}
        getAssistantResponses={chatState.getAssistantResponses}
      />

      {/* Footer - Prompt Input Area */}
      <div className="border-t border-accent-shadow p-3">
        <PromptInput onSubmit={handleSubmit} className="border-accent-shadow">
          <PromptInputTextarea
            placeholder="Describe the shader you want to create..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-background text-foreground placeholder:text-foreground-muted"
            disabled={isLoading}
          />
          <PromptInputToolbar>
            {/* Include code toggle */}
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <Switch
                checked={includeCode}
                onCheckedChange={setIncludeCode}
                className="h-4 w-7 data-[state=checked]:bg-primary"
              />
              <span>Include code</span>
            </label>

            <PromptInputModelSelect value={selectedModel} onValueChange={setSelectedModel}>
              <PromptInputModelSelectTrigger className="h-8 w-auto text-xs">
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {AVAILABLE_MODELS.map((model) => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
            <PromptInputSubmit disabled={!inputValue.trim() || isLoading} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={`w-full border-none border-accent-shadow bg-background overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 ${
          isOpen ? 'h-[70vh]' : 'h-0 border-none'
        }`}
      >
        <div className="h-[70vh] w-full">{panelContent}</div>
      </div>
    );
  }

  return (
    <div
      className={`h-full border-l-2 border-accent-shadow bg-background overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[25vw]' : 'w-0 border-none'
      }`}
    >
      <div className="h-full w-[25vw]">{panelContent}</div>
    </div>
  );
}
