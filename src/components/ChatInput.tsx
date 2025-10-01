/**
 * Chat input component with question textarea and submit button
 */

import React, { useState } from 'react';
import {
  HStack,
  Textarea,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';

interface ChatInputProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
  accent: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  question,
  onQuestionChange,
  onSubmit,
  loading,
  error,
  onClearError,
  accent,
}) => {
  const bg = useColorModeValue('white', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onQuestionChange('');
      onClearError();
    }
  };

  return (
    <>
      {error && (
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <AlertDescription flex={1}>{error}</AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={onClearError}
          />
        </Alert>
      )}
      
      <HStack align="start" spacing={3}>
        <Textarea
          placeholder="Ask a question... (Ctrl+Enter to send, Esc to clear)"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          bg={bg}
          borderColor={borderColor}
          minHeight="120px"
          resize="vertical"
          py={2}
          flex={1}
          isDisabled={loading}
        />
        <Button
          onClick={onSubmit}
          isLoading={loading}
          loadingText="Thinking..."
          colorScheme={accent}
          size="lg"
          minW="120px"
          isDisabled={!question.trim()}
        >
          Submit
        </Button>
      </HStack>
    </>
  );
};

