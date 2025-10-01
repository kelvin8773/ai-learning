/**
 * Custom hook for managing chat functionality
 * Encapsulates chat state, API calls, and database operations
 */

import { useState, useEffect, useCallback } from 'react';
import { askQuestion, ApiError } from '../services/deepseekApi';
import { saveToDB, deleteFromDB, getAllFromDB, ChatHistoryItem } from '../utils/database';

export interface UseChatReturn {
  // State
  question: string;
  answer: string;
  loading: boolean;
  history: ChatHistoryItem[];
  selectedIndex: number | null;
  error: string | null;
  
  // Actions
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  setSelectedIndex: (index: number | null) => void;
  askQuestion: () => Promise<void>;
  deleteHistoryItem: (id: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  selectHistoryItem: (index: number) => void;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await getAllFromDB();
        setHistory(savedHistory);
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load chat history');
      }
    };

    loadHistory();
  }, []);

  // Clear error when question changes
  useEffect(() => {
    if (error && question) {
      setError(null);
    }
  }, [question, error]);

  const handleAskQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    // Handle exit command
    if (question.toLowerCase() === 'exit') {
      setAnswer('Goodbye!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await askQuestion(question);
      
      // Save to database
      const id = await saveToDB(question, response);
      
      // Create new history item
      const newItem: ChatHistoryItem = {
        id,
        question,
        answer: response,
        timestamp: new Date(),
      };

      // Update state
      setAnswer(response);
      setHistory(prev => [newItem, ...prev]);
      setSelectedIndex(0);
      setQuestion(''); // Clear the input
      
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'An unexpected error occurred';
      setError(errorMessage);
      setAnswer(`Error: ${errorMessage}`);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  }, [question]);

  const handleDeleteHistoryItem = useCallback(async (id: number) => {
    try {
      await deleteFromDB(id);
      setHistory(prev => {
        const newHistory = prev.filter(item => item.id !== id);
        
        // Adjust selected index if needed
        if (selectedIndex !== null) {
          const deletedItemIndex = prev.findIndex(item => item.id === id);
          if (deletedItemIndex === selectedIndex) {
            setSelectedIndex(null);
            setAnswer('');
          } else if (deletedItemIndex < selectedIndex) {
            setSelectedIndex(selectedIndex - 1);
          }
        }
        
        return newHistory;
      });
    } catch (err) {
      console.error('Failed to delete history item:', err);
      setError('Failed to delete chat history item');
    }
  }, [selectedIndex]);

  const handleClearHistory = useCallback(async () => {
    try {
      // Note: clearAllFromDB function would need to be imported if we want to implement this
      // For now, we'll just clear the state
      setHistory([]);
      setSelectedIndex(null);
      setAnswer('');
      setQuestion('');
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear chat history');
    }
  }, []);

  const handleSelectHistoryItem = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      const item = history[index];
      setSelectedIndex(index);
      setQuestion(item.question);
      setAnswer(item.answer);
    }
  }, [history]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    question,
    answer,
    loading,
    history,
    selectedIndex,
    error,
    
    // Actions
    setQuestion,
    setAnswer,
    setSelectedIndex,
    askQuestion: handleAskQuestion,
    deleteHistoryItem: handleDeleteHistoryItem,
    clearHistory: handleClearHistory,
    selectHistoryItem: handleSelectHistoryItem,
    clearError,
  };
}

