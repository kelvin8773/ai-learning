/**
 * Data Management Component
 * Handles import/export of user data and settings
 */

import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  useColorModeValue,
  useToast,
  Divider,
  Code,
} from '@chakra-ui/react';
import { FiDownload, FiUpload, FiTrash2 } from 'react-icons/fi';
import { storageService } from '../services/storageService';

interface DataManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onDataCleared?: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  isOpen,
  onClose,
  onDataCleared,
}) => {
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const codeBg = useColorModeValue('gray.50', 'gray.700');

  // Export user data
  const handleExport = () => {
    try {
      const data = storageService.exportUserData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deepseek-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data exported successfully',
        description: 'Your settings and preferences have been downloaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export your data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Import user data
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const text = await file.text();
      const success = storageService.importUserData(text);

      if (success) {
        toast({
          title: 'Data imported successfully',
          description: 'Your settings and preferences have been restored. Please refresh the page.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Refresh after a delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: 'Import failed',
        description: 'Failed to import data. Please check the file format.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Clear all data
  const handleClearData = () => {
    if (!window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    setClearing(true);

    try {
      storageService.clearAllData();
      
      toast({
        title: 'Data cleared',
        description: 'All settings and preferences have been cleared.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      onDataCleared?.();
      onClose();

      // Refresh after a delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Clear failed:', error);
      toast({
        title: 'Clear failed',
        description: 'Failed to clear data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalHeader>🗂️ Data Management</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Info Alert */}
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Manage your application data, settings, and preferences. Export your data for backup or import from a previous backup.
                </AlertDescription>
              </Alert>

              {/* Export Section */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={3}>
                  📤 Export Data
                </Text>
                <Box p={4} borderWidth="1px" borderColor={borderColor} borderRadius="md">
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      Export your preferences, settings, and analytics data to a JSON file.
                      This is useful for backup or migrating to another device.
                    </Text>
                    <Button
                      leftIcon={<FiDownload />}
                      onClick={handleExport}
                      colorScheme="blue"
                      size="sm"
                    >
                      Export All Data
                    </Button>
                  </VStack>
                </Box>
              </Box>

              <Divider />

              {/* Import Section */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={3}>
                  📥 Import Data
                </Text>
                <Box p={4} borderWidth="1px" borderColor={borderColor} borderRadius="md">
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      Import previously exported data to restore your settings and preferences.
                      The page will refresh after a successful import.
                    </Text>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      leftIcon={<FiUpload />}
                      onClick={handleImport}
                      isLoading={importing}
                      loadingText="Importing..."
                      colorScheme="green"
                      size="sm"
                    >
                      Import Data File
                    </Button>
                  </VStack>
                </Box>
              </Box>

              <Divider />

              {/* Clear Data Section */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="red.500">
                  🗑️ Clear All Data
                </Text>
                <Box p={4} borderWidth="1px" borderColor="red.200" borderRadius="md" bg="red.50">
                  <VStack spacing={3} align="stretch">
                    <Alert status="warning" size="sm">
                      <AlertIcon />
                      <AlertDescription fontSize="sm">
                        This will permanently delete all your settings, preferences, and analytics.
                        This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <Button
                      leftIcon={<FiTrash2 />}
                      onClick={handleClearData}
                      isLoading={clearing}
                      loadingText="Clearing..."
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                    >
                      Clear All Data
                    </Button>
                  </VStack>
                </Box>
              </Box>

              {/* What's Included */}
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  📋 What's Included in Export/Import:
                </Text>
                <Box p={3} bg={codeBg} borderRadius="md" fontSize="xs">
                  <VStack align="start" spacing={1}>
                    <Text>• Theme and appearance preferences</Text>
                    <Text>• AI model settings (temperature, max tokens)</Text>
                    <Text>• Export format preferences</Text>
                    <Text>• Usage analytics and statistics</Text>
                    <Text>• Auto-save and display settings</Text>
                  </VStack>
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

