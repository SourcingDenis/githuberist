import React from 'react';

export function highlightText(text: string, keyword: string): (string | JSX.Element)[] {
  if (!keyword.trim() || !text) return [text];
  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) 
      ? React.createElement('mark', {
          key: i,
          className: 'bg-yellow-200 px-1 rounded'
        }, part)
      : part
  );
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
} 