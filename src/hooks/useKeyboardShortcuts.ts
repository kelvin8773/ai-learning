/**
 * Custom hook for handling keyboard shortcuts
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, metaKey, action }) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = (ctrlKey || false) === event.ctrlKey;
      const matchesShift = (shiftKey || false) === event.shiftKey;
      const matchesAlt = (altKey || false) === event.altKey;
      const matchesMeta = (metaKey || false) === event.metaKey;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        event.preventDefault();
        action();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Common keyboard shortcuts for the app
export const createAppShortcuts = (
  onToggleTheme: () => void,
  onOpenSettings: () => void,
  onOpenHistory: () => void,
  onFocusInput: () => void,
  onClearInput: () => void
): KeyboardShortcut[] => [
  {
    key: 't',
    ctrlKey: true,
    shiftKey: true,
    action: onToggleTheme,
    description: 'Toggle theme (light/dark)'
  },
  {
    key: ',',
    ctrlKey: true,
    action: onOpenSettings,
    description: 'Open settings'
  },
  {
    key: 'h',
    ctrlKey: true,
    action: onOpenHistory,
    description: 'Open chat history'
  },
  {
    key: 'l',
    ctrlKey: true,
    action: onFocusInput,
    description: 'Focus input field'
  },
  {
    key: 'k',
    ctrlKey: true,
    action: onClearInput,
    description: 'Clear input field'
  }
];

// Keyboard shortcuts for text formatting
export const createTextFormatShortcuts = (
  onBold: () => void,
  onItalic: () => void,
  onCode: () => void,
  onQuote: () => void
): KeyboardShortcut[] => [
  {
    key: 'b',
    ctrlKey: true,
    action: onBold,
    description: 'Bold text'
  },
  {
    key: 'i',
    ctrlKey: true,
    action: onItalic,
    description: 'Italic text'
  },
  {
    key: 'e',
    ctrlKey: true,
    action: onCode,
    description: 'Code block'
  },
  {
    key: 'q',
    ctrlKey: true,
    action: onQuote,
    description: 'Quote text'
  }
];
