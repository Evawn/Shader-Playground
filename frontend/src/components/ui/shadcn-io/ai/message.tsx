import { cn } from '../../../../utils/cn';
import type { HTMLAttributes } from 'react';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: 'user' | 'assistant' | 'system' | 'data';
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-end justify-end gap-2 first:pt-0 pt-4',
      from === 'user' ? 'is-user [&>div]:max-w-[90%]' : 'is-assistant flex-row-reverse justify-end [&>div]:max-w-[80%]',
      className
    )}
    {...(props as any)}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 overflow-hidden rounded-sm px-4 py-3 text-foreground text-sm',
      'group-[.is-user]:bg-accent/20 group-[.is-user]:border group-[.is-user]:border-accent-shadow group-[.is-user]:text-foreground',
      'group-[.is-assistant]:bg-background-highlighted group-[.is-assistant]:text-foreground',
      className
    )}
    {...(props as any)}
  >
    <div>{children}</div>
  </div>
);
