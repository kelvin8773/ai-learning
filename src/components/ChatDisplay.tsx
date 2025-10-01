/**
 * Chat display component showing current question and answer
 */

import React from 'react';
import {
  VStack,
  Box,
  Spinner,
  Center,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  HStack,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { Text as ChakraText } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { CopyIcon } from '@chakra-ui/icons';
import { FiDownload } from 'react-icons/fi';

interface ChatDisplayProps {
  question: string;
  answer: string;
  loading: boolean;
  selectedQuestion?: string;
  markdownComponents?: any;
}

export const ChatDisplay: React.FC<ChatDisplayProps> = React.memo(({
  question,
  answer,
  loading,
  selectedQuestion,
  markdownComponents,
}) => {
  const panelBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.600');
  const codeBg = useColorModeValue('gray.100', 'gray.700');
  const toast = useToast();

  const displayQuestion = question || selectedQuestion || 'No question selected';

  const handleCopyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      toast({
        title: 'Copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleExportAnswer = () => {
    if (answer) {
      const blob = new Blob([answer], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `answer-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Answer exported successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Question section */}
      <Box
        bg={panelBg}
        p={4}
        borderRadius="md"
        boxShadow="xs"
        borderWidth={1}
        borderColor={borderColor}
      >
        <ChakraText fontSize="sm" color="gray.500">
          Question
        </ChakraText>
        <ChakraText fontSize="lg" fontWeight="semibold" mt={2}>
          {displayQuestion}
        </ChakraText>
      </Box>

      {/* Answer section */}
      <Box
        bg={panelBg}
        p={6}
        borderRadius="md"
        boxShadow="sm"
        minH="220px"
        overflowY="auto"
      >
        {loading ? (
          <Box>
            <HStack justify="space-between" mb={3}>
              <ChakraText fontSize="sm" color="gray.500">
                Answer
              </ChakraText>
              <HStack spacing={1}>
                <Spinner size="sm" />
                <ChakraText fontSize="xs" color="gray.500">
                  Thinking...
                </ChakraText>
              </HStack>
            </HStack>
            <VStack spacing={3} align="stretch">
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" width="80%" />
              <Skeleton height="60px" />
              <Skeleton height="20px" width="60%" />
              <Skeleton height="20px" />
              <Skeleton height="40px" />
            </VStack>
          </Box>
        ) : answer ? (
          <Box>
            <HStack justify="space-between" mb={3}>
              <ChakraText fontSize="sm" color="gray.500">
                Answer
              </ChakraText>
              <HStack spacing={2}>
                <Tooltip label="Copy answer">
                  <IconButton
                    aria-label="copy-answer"
                    icon={<CopyIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyAnswer}
                  />
                </Tooltip>
                <Tooltip label="Export answer">
                  <IconButton
                    aria-label="export-answer"
                    icon={<FiDownload />}
                    size="sm"
                    variant="ghost"
                    onClick={handleExportAnswer}
                  />
                </Tooltip>
              </HStack>
            </HStack>
            <Box
              mt={3}
              p={4}
              borderRadius="md"
              fontSize="md"
              lineHeight="1.9"
              sx={{
                p: { mb: 4, lineHeight: 1.9 },
                li: { mb: 2 },
                pre: {
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  p: 3,
                  bg: codeBg,
                  borderRadius: 6,
                },
                code: {
                  bg: codeBg,
                  px: 1,
                  borderRadius: 4,
                  fontSize: '0.95em',
                },
              }}
            >
              <ReactMarkdown components={markdownComponents}>
                {answer}
              </ReactMarkdown>
            </Box>
          </Box>
        ) : (
          <ChakraText color="gray.500">
            No answer yet. Ask something above.
          </ChakraText>
        )}
      </Box>
    </VStack>
  );
});

