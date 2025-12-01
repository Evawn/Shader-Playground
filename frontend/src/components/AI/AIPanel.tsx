'use client';

import { useState, type FormEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
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
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
} from '../ui/shadcn-io/ai/prompt-input';
import { Response } from '../ui/shadcn-io/ai/response';
import { Button } from '../ui/button';
import { sendPrompt } from '../../api/ai';
import { getErrorMessage } from '../../api/client';
import { ChatHistory } from './ChatHistory';

const AVAILABLE_MODELS = [
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
];

interface ChatMessage {
  id: string;
  from: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

interface AIPanelProps {
  isOpen: boolean;
  isMobile?: boolean;
  onClose: () => void;
  setCodeAndCompile: (newCode: string, tabId: string) => void;
}

export function AIPanel({ isOpen, isMobile = false, onClose, setCodeAndCompile }: AIPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

  const clearHistory = () => {
    setMessages([]);
  };

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
      const response = await sendPrompt(promptText, selectedModel);

      // Update the main Image tab (id: '1') with the generated shader code and compile
      setCodeAndCompile(response.code, '1');

      // Show the explanation from the AI in chat
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        from: 'assistant',
        content: response.explanation,
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
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <span className="text-sm font-medium text-foreground">AI</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearHistory}
            disabled={messages.length === 0}
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

      {/* Main Content Area */}
      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="space-y-2">
          {messages.length === 0 ? (
            <ChatHistory />
          ) : (
            <>
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
            </>
          )}
        </ConversationContent>
      </Conversation>

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
