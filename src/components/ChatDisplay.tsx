/**
 * Chat display component showing current question and answer
 */

import React from 'react';
import {
  VStack,
  Box,
  Text,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface ChatDisplayProps {
  question: string;
  answer: string;
  loading: boolean;
  selectedQuestion?: string;
  markdownComponents?: any;
}

export const ChatDisplay: React.FC<ChatDisplayProps> = ({
  question,
  answer,
  loading,
  selectedQuestion,
  markdownComponents,
}) => {
  const panelBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.600');

  const displayQuestion = question || selectedQuestion || 'No question selected';

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
        <Text fontSize="sm" color="gray.500">
          Question
        </Text>
        <Text fontSize="lg" fontWeight="semibold" mt={2}>
          {displayQuestion}
        </Text>
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
          <Center py={8}>
            <Spinner size="xl" />
          </Center>
        ) : answer ? (
          <Box>
            <Text fontSize="sm" color="gray.500">
              Answer
            </Text>
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
                  bg: useColorModeValue('gray.100', 'gray.700'),
                  borderRadius: 6,
                },
                code: {
                  bg: useColorModeValue('gray.100', 'gray.700'),
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
          <Text color="gray.500">
            No answer yet. Ask something above.
          </Text>
        )}
      </Box>
    </VStack>
  );
};

