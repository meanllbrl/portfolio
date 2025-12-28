'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import mermaid from 'mermaid';

const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Failed to render mermaid chart:', error);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      ref={ref} 
      className="mermaid my-6 flex justify-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const isMermaid = match && match[1] === 'mermaid';
      
      if (!inline && isMermaid) {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none 
      prose-headings:font-heading prose-headings:font-bold 
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-xl prose-img:border-2 prose-img:border-gray-100 dark:prose-img:border-gray-800
      ${className}`}
    >
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

