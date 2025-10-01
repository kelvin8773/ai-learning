/**
 * Export panel component for exporting conversations
 */

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Divider,
  Box,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  Checkbox,
  CheckboxGroup,
  Stack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { ChakraText as ChakraChakraText } from '@chakra-ui/react';
import { ChatHistoryItem } from '../utils/database';
import { exportConversation, exportMultipleConversations, ExportFormat } from '../utils/exportUtils';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ChatHistoryItem[];
  selectedConversation?: ChatHistoryItem;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  isOpen,
  onClose,
  conversations,
  selectedConversation,
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const bg = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);

      if (selectedConversation) {
        // Export single conversation
        await exportConversation(selectedConversation, {
          format: exportFormat,
          includeTimestamp,
          includeMetadata,
        });
        
        toast({
          title: 'Conversation exported successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (selectedConversations.length > 0) {
        // Export multiple conversations
        const conversationsToExport = conversations.filter((_, index) => 
          selectedConversations.includes(index)
        );
        
        await exportMultipleConversations(conversationsToExport, {
          format: exportFormat,
          includeTimestamp,
          includeMetadata,
        });
        
        toast({
          title: `${selectedConversations.length} conversations exported successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Please select conversations to export',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedConversations.length === conversations.length) {
      setSelectedConversations([]);
    } else {
      setSelectedConversations(conversations.map((_, index) => index));
    }
  };

  const isExportDisabled = !selectedConversation && selectedConversations.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>Export Conversations</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Export Mode Info */}
            {selectedConversation ? (
              <Alert status="info">
                <AlertIcon />
                <AlertDescription>
                  Exporting single conversation from {new Date(selectedConversation.timestamp).toLocaleDateString()}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert status="info">
                <AlertIcon />
                <AlertDescription>
                  Exporting multiple conversations ({selectedConversations.length} selected)
                </AlertDescription>
              </Alert>
            )}

            {/* Format Selection */}
            <FormControl>
              <FormLabel>Export Format</FormLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              >
                <option value="markdown">Markdown (.md)</option>
                <option value="pdf">PDF (.pdf)</option>
                <option value="json">JSON (.json)</option>
                <option value="txt">Plain ChakraText (.txt)</option>
              </Select>
            </FormControl>

            {/* Export Options */}
            <VStack spacing={4} align="stretch">
              <ChakraText fontWeight="semibold">Export Options</ChakraText>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <FormLabel mb="0">Include timestamp</FormLabel>
                  <ChakraText fontSize="sm" color="gray.500">
                    Add creation date to exported files
                  </ChakraText>
                </Box>
                <Switch
                  isChecked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <FormLabel mb="0">Include metadata</FormLabel>
                  <ChakraText fontSize="sm" color="gray.500">
                    Add conversation ID and technical details
                  </ChakraText>
                </Box>
                <Switch
                  isChecked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                />
              </FormControl>
            </VStack>

            {/* Conversation Selection (only for multiple export) */}
            {!selectedConversation && conversations.length > 0 && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <ChakraText fontWeight="semibold">Select Conversations</ChakraText>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSelectAll}
                    >
                      {selectedConversations.length === conversations.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </HStack>

                  <Box
                    maxH="200px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    borderRadius="md"
                    p={3}
                  >
                    <CheckboxGroup
                      value={selectedConversations}
                      onChange={(values) => setSelectedConversations(values as number[])}
                    >
                      <Stack spacing={2}>
                        {conversations.map((conversation, index) => (
                          <Checkbox key={conversation.id || index} value={index}>
                            <VStack align="start" spacing={0}>
                              <ChakraText fontSize="sm" fontWeight="medium" noOfLines={1}>
                                {conversation.question}
                              </ChakraText>
                              <ChakraText fontSize="xs" color="gray.500">
                                {new Date(conversation.timestamp).toLocaleString()}
                              </ChakraText>
                            </VStack>
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  </Box>
                </VStack>
              </>
            )}

            {/* Format-specific Info */}
            <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <ChakraText fontSize="sm" color="gray.600">
                <strong>Format:</strong> {exportFormat.toUpperCase()}
                {exportFormat === 'pdf' && ' - Best for printing and sharing'}
                {exportFormat === 'markdown' && ' - Best for documentation and editing'}
                {exportFormat === 'json' && ' - Best for data processing and backup'}
                {exportFormat === 'txt' && ' - Best for simple text viewing'}
              </ChakraText>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose} isDisabled={isExporting}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleExport}
              isLoading={isExporting}
              loadingChakraText="Exporting..."
              isDisabled={isExportDisabled}
            >
              {selectedConversation ? 'Export Conversation' : `Export ${selectedConversations.length} Conversations`}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
