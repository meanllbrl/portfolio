'use client';

import ReactMarkdown from 'react-markdown';

interface ExcerptRendererProps {
  content: string;
  className?: string;
}

export function ExcerptRenderer({ content, className = '' }: ExcerptRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <>{children}</>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{children}</code>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}


