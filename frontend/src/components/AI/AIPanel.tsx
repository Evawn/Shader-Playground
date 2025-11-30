'use client';

import { useState, type FormEvent } from 'react';
import {
  Conversation,
  ConversationContent,
} from '../ui/shadcn-io/ai/conversation';
import {
  Message,
  MessageContent,
} from '../ui/shadcn-io/ai/message';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from '../ui/shadcn-io/ai/prompt-input';
import { Response } from '../ui/shadcn-io/ai/response';
import { sendPrompt } from '../../api/ai';
import { getErrorMessage } from '../../api/client';

/**
 * Collapsible AI panel component for the shader editor.
 * Desktop: Slides in/out from the right side with width animation.
 * Mobile: Expands/collapses vertically with height animation.
 */

interface ChatMessage {
  id: string;
  from: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

interface AIPanelProps {
  isOpen: boolean;
  isMobile?: boolean;
  setCodeAndCompile: (newCode: string, tabId: string) => void;
}

export function AIPanel({ isOpen, isMobile = false, setCodeAndCompile }: AIPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const promptText = inputValue;

    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      from: 'user',
      content: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendPrompt(promptText);

      // Update the main Image tab (id: '1') with the generated shader code and compile
      setCodeAndCompile(response.message, '1');

      // Show simple confirmation message in chat
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        from: 'assistant',
        content: 'Generated shader',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        from: 'assistant',
        content: getErrorMessage(error),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const panelContent = (
    <div className="flex flex-col h-full">
      {/* Conversation Area */}
      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="space-y-2">
          {messages.map((msg) => (
            <Message key={msg.id} from={msg.from}>
              <MessageContent
                className={msg.isError ? 'bg-red-500/20 border-red-500/50' : ''}
              >
                {msg.from === 'assistant' ? (
                  <Response className={msg.isError ? 'text-red-400' : ''}>
                    {msg.isError ? `Error: ${msg.content}` : msg.content}
                  </Response>
                ) : (
                  msg.content
                )}
              </MessageContent>
            </Message>
          ))}
          {isLoading && (
            <Message from="assistant">
              <MessageContent>
                <div className="animate-pulse text-foreground-muted">
                  Thinking...
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
      </Conversation>

      {/* Prompt Input Area */}
      <div className="border-t border-accent-shadow p-3">
        <PromptInput onSubmit={handleSubmit} className="border-accent-shadow">
          <PromptInputTextarea
            placeholder="Describe the shader you want to create..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-background text-foreground placeholder:text-foreground-muted"
            disabled={isLoading}
          />
          <PromptInputToolbar className="justify-end">
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
