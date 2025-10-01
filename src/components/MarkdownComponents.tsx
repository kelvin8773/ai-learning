/**
 * Custom markdown components for ReactMarkdown
 * Provides styled components for rendering markdown content
 */

import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

export const markdownComponents = {
  table: ({ node, ...props }: any) => (
    <Box overflowX="auto" my={4}>
      <Box
        as="table"
        {...props}
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '100%',
          'th, td': {
            border: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.600'),
            px: 3,
            py: 2,
            textAlign: 'left',
          },
          th: {
            bg: useColorModeValue('gray.100', 'gray.600'),
            fontWeight: 600,
            borderTop: 'none',
          },
          td: {
            borderTop: 'none',
          },
          'tr:last-child td': {
            borderBottom: 'none',
          },
          'td:first-child, th:first-child': {
            borderLeft: 'none',
          },
          'td:last-child, th:last-child': {
            borderRight: 'none',
          },
        }}
      />
    </Box>
  ),
  th: ({ node, ...props }: any) => <Box as="th" {...props} />,
  td: ({ node, ...props }: any) => <Box as="td" {...props} />,
  thead: ({ node, ...props }: any) => <Box as="thead" {...props} />,
  tbody: ({ node, ...props }: any) => <Box as="tbody" {...props} />,
  blockquote: ({ node, ...props }: any) => (
    <Box
      as="blockquote"
      {...props}
      borderLeft="4px solid"
      borderColor={useColorModeValue('gray.300', 'gray.600')}
      pl={4}
      py={2}
      bg={useColorModeValue('gray.50', 'gray.800')}
      borderRadius="md"
      fontStyle="italic"
      my={4}
    />
  ),
  code: ({ node, inline, ...props }: any) => {
    if (inline) {
      return (
        <Box
          as="code"
          {...props}
          bg={useColorModeValue('gray.100', 'gray.700')}
          px={1}
          py={0.5}
          borderRadius={4}
          fontSize="0.95em"
          fontFamily="mono"
        />
      );
    }
    return (
      <Box
        as="pre"
        {...props}
        whiteSpace="pre-wrap"
        overflowX="auto"
        p={3}
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius={6}
        my={4}
        fontFamily="mono"
      />
    );
  },
  h1: ({ node, ...props }: any) => (
    <Box as="h1" {...props} fontSize="2xl" fontWeight="bold" my={4} />
  ),
  h2: ({ node, ...props }: any) => (
    <Box as="h2" {...props} fontSize="xl" fontWeight="bold" my={3} />
  ),
  h3: ({ node, ...props }: any) => (
    <Box as="h3" {...props} fontSize="lg" fontWeight="semibold" my={2} />
  ),
  ul: ({ node, ...props }: any) => (
    <Box as="ul" {...props} pl={6} my={2} />
  ),
  ol: ({ node, ...props }: any) => (
    <Box as="ol" {...props} pl={6} my={2} />
  ),
  li: ({ node, ...props }: any) => (
    <Box as="li" {...props} mb={1} />
  ),
  p: ({ node, ...props }: any) => (
    <Box as="p" {...props} mb={4} lineHeight="1.9" />
  ),
  strong: ({ node, ...props }: any) => (
    <Box as="strong" {...props} fontWeight="semibold" />
  ),
  em: ({ node, ...props }: any) => (
    <Box as="em" {...props} fontStyle="italic" />
  ),
};

