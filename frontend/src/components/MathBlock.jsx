import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathBlock({ math, block = false, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false
      });
    } catch (err) {
      console.error('KaTeX render error:', err);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div 
        className={`my-2 overflow-x-auto py-1 text-slate-100 font-serif ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span 
      className={`inline-block text-slate-100 font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
