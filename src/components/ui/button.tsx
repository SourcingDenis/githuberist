import React from 'react'

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="px-4 py-2 bg-blue-500 text-white rounded" />
} 