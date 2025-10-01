/**
 * Custom hook for managing streaming chat functionality
 * Provides real-time response streaming with enhanced UX
 */

import { useState, useCallback, useRef } from 'react';
import { askQuestionStreaming, askQuestion, StreamingResponse, ApiError } from '../services/deepseekApi';
import { saveToDB, deleteFromDB, getAllFromDB, ChatHistoryItem } from '../utils/database';

export interface UseStreamingChatReturn {
  // State
  question: string;
  answer: string;
  loading: boolean;
  streaming: boolean;
  history: ChatHistoryItem[];
  selectedIndex: number | null;
  error: string | null;
  
  // Actions
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  setSelectedIndex: (index: number | null) => void;
  askQuestion: () => Promise<void>;
  askQuestionStreaming: () => Promise<void>;
  deleteHistoryItem: (id: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  selectHistoryItem: (index: number) => void;
  clearError: () => void;
  stopStreaming: () => void;
}

export function useStreamingChat(): UseStreamingChatReturn {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingAnswerRef = useRef<string>('');

  // Load chat history on mount
  const loadHistory = useCallback(async () => {
    try {
      const savedHistory = await getAllFromDB();
      setHistory(savedHistory);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Failed to load chat history');
    }
  }, []);

  // Clear error when question changes
  const clearErrorOnQuestionChange = useCallback(() => {
    if (error && question) {
      setError(null);
    }
  }, [question, error]);

  // Handle streaming response
  const handleStreamingResponse: StreamingResponse = {
    onData: (chunk: string) => {
      streamingAnswerRef.current += chunk;
      setAnswer(streamingAnswerRef.current);
    },
    onComplete: async () => {
      setStreaming(false);
      setLoading(false);
      
      // Save to database
      try {
        const id = await saveToDB(question, streamingAnswerRef.current);
        
        // Create new history item
        const newItem: ChatHistoryItem = {
          id,
          question,
          answer: streamingAnswerRef.current,
          timestamp: new Date(),
        };

        // Update state
        setHistory(prev => [newItem, ...prev]);
        setSelectedIndex(0);
        setQuestion(''); // Clear the input
        streamingAnswerRef.current = '';
      } catch (err) {
        console.error('Failed to save streaming response:', err);
        setError('Failed to save response');
      }
    },
    onError: (apiError: ApiError) => {
      setStreaming(false);
      setLoading(false);
      const errorMessage = apiError.message || 'An unexpected error occurred';
      setError(errorMessage);
      setAnswer(`Error: ${errorMessage}`);
      console.error('Streaming chat error:', apiError);
      streamingAnswerRef.current = '';
    }
  };

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStreaming(false);
    setLoading(false);
    streamingAnswerRef.current = '';
  }, []);

  // Ask question with streaming
  const handleAskQuestionStreaming = useCallback(async () => {
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
    setStreaming(true);
    setError(null);
    streamingAnswerRef.current = '';
    setAnswer('');

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      await askQuestionStreaming(question, handleStreamingResponse);
    } catch (err) {
      setStreaming(false);
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setAnswer(`Error: ${errorMessage}`);
      console.error('Streaming chat error:', err);
      streamingAnswerRef.current = '';
    }
  }, [question]);

  // Ask question without streaming (fallback)
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

  // Delete history item
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

  // Clear history
  const handleClearHistory = useCallback(async () => {
    try {
      setHistory([]);
      setSelectedIndex(null);
      setAnswer('');
      setQuestion('');
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear chat history');
    }
  }, []);

  // Select history item
  const handleSelectHistoryItem = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      const item = history[index];
      setSelectedIndex(index);
      setQuestion(item.question);
      setAnswer(item.answer);
    }
  }, [history]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load history on mount
  useState(() => {
    loadHistory();
  });

  // Clear error when question changes
  useState(() => {
    clearErrorOnQuestionChange();
  });

  return {
    // State
    question,
    answer,
    loading,
    streaming,
    history,
    selectedIndex,
    error,
    
    // Actions
    setQuestion,
    setAnswer,
    setSelectedIndex,
    askQuestion: handleAskQuestion,
    askQuestionStreaming: handleAskQuestionStreaming,
    deleteHistoryItem: handleDeleteHistoryItem,
    clearHistory: handleClearHistory,
    selectHistoryItem: handleSelectHistoryItem,
    clearError,
    stopStreaming,
  };
}
