/**
 * Chat history sidebar component
 */

import React from 'react';
import {
  Box,
  Heading,
  Divider,
  VStack,
  Text,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChatHistoryItem } from '../utils/database';

interface ChatHistoryProps {
  history: ChatHistoryItem[];
  selectedIndex: number | null;
  onSelectItem: (index: number) => void;
  onDeleteItem: (id: number) => void;
  accent: string;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  history,
  selectedIndex,
  onSelectItem,
  onDeleteItem,
  accent,
}) => {
  const itemBgDefault = useColorModeValue('gray.50', 'gray.700');
  const itemHoverBg = useColorModeValue('gray.100', 'gray.600');
  const itemText = useColorModeValue('gray.600', 'gray.300');
  const timeText = useColorModeValue('gray.500', 'gray.400');
  const selectedBg = useColorModeValue(`${accent}.50`, `${accent}.700`);
  const selectedBorder = `${accent}.400`;

  return (
    <Box>
      <Heading size="md">History</Heading>
      <Divider mb={3} />
      <VStack
        spacing={3}
        align="stretch"
        maxH={{ base: '40vh', md: 'full' }}
        overflowY="auto"
      >
        {history.length === 0 && (
          <Text color="gray.500">No history yet.</Text>
        )}
        {history.map((item, index) => {
          // Create a plain-text preview to avoid rendering markdown in the sidebar
          const preview = (item.answer || '').replace(/\s+/g, ' ').trim();
          const previewShort =
            preview.length > 160 ? preview.slice(0, 157) + '...' : preview;
          
          return (
            <Box
              key={`${item.timestamp?.toString() || index}-${index}`}
              p={3}
              bg={selectedIndex === index ? selectedBg : itemBgDefault}
              borderRadius="md"
              boxShadow={selectedIndex === index ? 'sm' : 'xs'}
              borderLeft={selectedIndex === index ? '4px solid' : undefined}
              borderColor={selectedIndex === index ? selectedBorder : undefined}
              position="relative"
              _hover={{
                bg: selectedIndex === index ? selectedBg : itemHoverBg,
                cursor: 'pointer',
                '.delete-btn': { opacity: 1 },
              }}
            >
              <Text fontSize="sm" color={timeText}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              <HStack justify="space-between" align="start">
                <Box
                  onClick={() => onSelectItem(index)}
                  flex={1}
                >
                  <Text
                    fontWeight="semibold"
                    mt={2}
                    noOfLines={1}
                    color={itemText}
                  >
                    {item.question}
                  </Text>
                  <Text mt={2} fontSize="sm" color={itemText} noOfLines={2}>
                    {previewShort}
                  </Text>
                </Box>
                <IconButton
                  className="delete-btn"
                  aria-label="delete-item"
                  position="absolute"
                  right={3}
                  top={3}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  icon={<Box as="span">×</Box>}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (item.id) {
                      await onDeleteItem(item.id);
                    }
                  }}
                  opacity={0}
                  transition="opacity 0.15s"
                />
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

