/**
 * Chat input component with question textarea and submit button
 */

import React, { useState } from 'react';
import {
  HStack,
  VStack,
  Textarea,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  useBreakpointValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Text as ChakraText } from '@chakra-ui/react';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';

interface ChatInputProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
  accent: string;
}

export const ChatInput: React.FC<ChatInputProps> = React.memo(({
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isFocused, setIsFocused] = useState(false);

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
      
      {isMobile ? (
        <VStack spacing={3} align="stretch">
          <Textarea
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            bg={bg}
            borderColor={isFocused ? `${accent}.300` : borderColor}
            minHeight="100px"
            resize="none"
            py={3}
            px={4}
            fontSize="16px" // Prevents zoom on iOS
            isDisabled={loading}
            _focus={{
              borderColor: `${accent}.300`,
              boxShadow: `0 0 0 1px ${accent}.300`,
            }}
          />
          <HStack justify="space-between">
            <ChakraText fontSize="xs" color="gray.500">
              Ctrl+Enter to send
            </ChakraText>
            <HStack spacing={2}>
              {question && (
                <Tooltip label="Clear">
                  <IconButton
                    aria-label="clear"
                    icon={<CloseIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onQuestionChange('')}
                  />
                </Tooltip>
              )}
              <Button
                onClick={onSubmit}
                isLoading={loading}
                loadingText="..."
                colorScheme={accent}
                size="md"
                minW="80px"
                isDisabled={!question.trim()}
                rightIcon={<ArrowForwardIcon />}
              >
                Send
              </Button>
            </HStack>
          </HStack>
        </VStack>
      ) : (
        <HStack align="start" spacing={3}>
          <Textarea
            placeholder="Ask a question... (Ctrl+Enter to send, Esc to clear)"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            bg={bg}
            borderColor={isFocused ? `${accent}.300` : borderColor}
            minHeight="120px"
            resize="vertical"
            py={2}
            flex={1}
            isDisabled={loading}
            _focus={{
              borderColor: `${accent}.300`,
              boxShadow: `0 0 0 1px ${accent}.300`,
            }}
          />
          <Button
            onClick={onSubmit}
            isLoading={loading}
            loadingText="Thinking..."
            colorScheme={accent}
            size="lg"
            minW="120px"
            isDisabled={!question.trim()}
            rightIcon={<ArrowForwardIcon />}
          >
            Submit
          </Button>
        </HStack>
      )}
    </>
  );
});

