/**
 * Chat history sidebar component
 */

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Divider,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { Text as ChakraText } from '@chakra-ui/react';
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiDownload } from 'react-icons/fi';
import { ChatHistoryItem } from '../utils/database';
import { ExportPanel } from './ExportPanel';
import { SearchFilter } from './SearchFilter';

interface ChatHistoryProps {
  history: ChatHistoryItem[];
  selectedIndex: number | null;
  onSelectItem: (index: number) => void;
  onDeleteItem: (id: number) => void;
  accent: string;
}

export const ChatHistory: React.FC<ChatHistoryProps> = React.memo(({
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
  
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const [selectedConversation, setSelectedConversation] = useState<ChatHistoryItem | undefined>();
  const [filteredHistory, setFilteredHistory] = useState<ChatHistoryItem[]>(history);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportSingle = (conversation: ChatHistoryItem) => {
    setSelectedConversation(conversation);
    onExportOpen();
  };

  const handleExportMultiple = () => {
    setSelectedConversation(undefined);
    onExportOpen();
  };

  // Update filtered history when history changes
  React.useEffect(() => {
    setFilteredHistory(history);
  }, [history]);

  const handleFilteredConversations = (filtered: ChatHistoryItem[]) => {
    setFilteredHistory(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Heading size="md">History</Heading>
        {history.length > 0 && (
          <Menu>
            <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
              Export
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiDownload />} onClick={handleExportMultiple}>
                Export All ({history.length})
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
      <Divider mb={3} />

      {/* Search and Filter */}
      {history.length > 0 && (
        <>
          <SearchFilter
            conversations={history}
            onFilteredConversations={handleFilteredConversations}
            onSearch={handleSearch}
          />
          <Divider my={3} />
        </>
      )}

      <VStack
        spacing={3}
        align="stretch"
        maxH={{ base: '40vh', md: 'full' }}
        overflowY="auto"
      >
        {filteredHistory.length === 0 && (
          <ChakraText color="gray.500">
            {searchQuery ? 'No conversations found matching your search.' : 'No history yet.'}
          </ChakraText>
        )}
        {filteredHistory.map((item, index) => {
          // Create a plain-text preview to avoid rendering markdown in the sidebar
          const preview = (item.answer || '').replace(/\s+/g, ' ').trim();
          const previewShort =
            preview.length > 160 ? preview.slice(0, 157) + '...' : preview;
          
          return (
            <Box
              key={`${item.timestamp?.toString() || index}-${index}`}
              p={3}
              bg={selectedIndex === history.indexOf(item) ? selectedBg : itemBgDefault}
              borderRadius="md"
              boxShadow={selectedIndex === history.indexOf(item) ? 'sm' : 'xs'}
              borderLeft={selectedIndex === history.indexOf(item) ? '4px solid' : undefined}
              borderColor={selectedIndex === history.indexOf(item) ? selectedBorder : undefined}
              position="relative"
              _hover={{
                bg: selectedIndex === history.indexOf(item) ? selectedBg : itemHoverBg,
                cursor: 'pointer',
                '.action-buttons': { opacity: 1 },
              }}
            >
              <ChakraText fontSize="sm" color={timeText}>
                {new Date(item.timestamp).toLocaleString()}
              </ChakraText>
              <HStack justify="space-between" align="start">
                <Box
                  onClick={() => onSelectItem(history.indexOf(item))}
                  flex={1}
                >
                  <ChakraText
                    fontWeight="semibold"
                    mt={2}
                    noOfLines={1}
                    color={itemText}
                  >
                    {item.question}
                  </ChakraText>
                  <ChakraText mt={2} fontSize="sm" color={itemText} noOfLines={2}>
                    {previewShort}
                  </ChakraText>
                </Box>
                <HStack spacing={1} position="absolute" right={3} top={3} opacity={0} className="action-buttons" transition="opacity 0.15s">
                  <IconButton
                    aria-label="export-item"
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    icon={<FiDownload />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportSingle(item);
                    }}
                  />
                  <IconButton
                    aria-label="delete-item"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    icon={<DeleteIcon />}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (item.id) {
                        await onDeleteItem(item.id);
                      }
                    }}
                  />
                </HStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      {/* Export Panel */}
      <ExportPanel
        isOpen={isExportOpen}
        onClose={onExportClose}
        conversations={history}
        selectedConversation={selectedConversation}
      />
    </Box>
  );
});

