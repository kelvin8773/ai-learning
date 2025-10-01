/**
 * Analytics Dashboard Component
 * Displays usage statistics and insights
 */

import React from 'react';
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Divider,
  Grid,
  GridItem,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiActivity, FiMessageSquare, FiCpu, FiHardDrive } from 'react-icons/fi';
import { storageService } from '../services/storageService';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  conversationCount: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  isOpen,
  onClose,
  conversationCount,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const statBg = useColorModeValue('gray.50', 'gray.700');

  const analytics = storageService.getAnalytics();
  const storageStats = storageService.getStorageStats();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={bg} maxW="800px">
        <ModalHeader>📊 Usage Analytics</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Summary Stats */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Box p={4} bg={statBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                  <HStack spacing={3}>
                    <Icon as={FiMessageSquare} boxSize={6} color="blue.500" />
                    <Stat>
                      <StatLabel fontSize="sm">Total Questions</StatLabel>
                      <StatNumber fontSize="2xl">{formatNumber(analytics.totalQuestions)}</StatNumber>
                      <StatHelpText fontSize="xs">All time</StatHelpText>
                    </Stat>
                  </HStack>
                </Box>
              </GridItem>

              <GridItem>
                <Box p={4} bg={statBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                  <HStack spacing={3}>
                    <Icon as={FiActivity} boxSize={6} color="green.500" />
                    <Stat>
                      <StatLabel fontSize="sm">Conversations</StatLabel>
                      <StatNumber fontSize="2xl">{formatNumber(conversationCount)}</StatNumber>
                      <StatHelpText fontSize="xs">Saved in history</StatHelpText>
                    </Stat>
                  </HStack>
                </Box>
              </GridItem>

              <GridItem>
                <Box p={4} bg={statBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                  <HStack spacing={3}>
                    <Icon as={FiCpu} boxSize={6} color="purple.500" />
                    <Stat>
                      <StatLabel fontSize="sm">Tokens Used</StatLabel>
                      <StatNumber fontSize="2xl">{formatNumber(analytics.totalTokensUsed)}</StatNumber>
                      <StatHelpText fontSize="xs">Estimated</StatHelpText>
                    </Stat>
                  </HStack>
                </Box>
              </GridItem>

              <GridItem>
                <Box p={4} bg={statBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                  <HStack spacing={3}>
                    <Icon as={FiHardDrive} boxSize={6} color="orange.500" />
                    <Stat>
                      <StatLabel fontSize="sm">Last Active</StatLabel>
                      <StatNumber fontSize="lg">{formatDate(analytics.lastUsedDate)}</StatNumber>
                      <StatHelpText fontSize="xs">Most recent use</StatHelpText>
                    </Stat>
                  </HStack>
                </Box>
              </GridItem>
            </Grid>

            <Divider />

            {/* Storage Usage */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3}>
                💾 Storage Usage
              </Text>
              <Box p={4} bg={statBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Used Storage</Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {storageStats.used} KB / {Math.round((storageStats.used + storageStats.available) / 1024)} MB
                    </Text>
                  </HStack>
                  <Progress
                    value={storageStats.percentage}
                    colorScheme={
                      storageStats.percentage > 80 ? 'red' :
                      storageStats.percentage > 60 ? 'orange' : 'green'
                    }
                    size="sm"
                    borderRadius="full"
                  />
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500">
                      {storageStats.percentage.toFixed(1)}% used
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {storageStats.available} KB available
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Box>

            <Divider />

            {/* Insights */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3}>
                💡 Insights
              </Text>
              <VStack spacing={2} align="stretch">
                <Box p={3} bg={statBg} borderRadius="md">
                  <HStack>
                    <Text fontSize="sm">📈</Text>
                    <Text fontSize="sm">
                      Average {analytics.totalQuestions > 0 
                        ? Math.round((analytics.totalTokensUsed / analytics.totalQuestions))
                        : 0} tokens per question
                    </Text>
                  </HStack>
                </Box>
                
                {conversationCount > 10 && (
                  <Box p={3} bg={statBg} borderRadius="md">
                    <HStack>
                      <Text fontSize="sm">✨</Text>
                      <Text fontSize="sm">
                        Great job! You've had {conversationCount} conversations.
                      </Text>
                    </HStack>
                  </Box>
                )}
                
                {storageStats.percentage > 80 && (
                  <Box p={3} bg="orange.50" borderRadius="md" borderWidth="1px" borderColor="orange.200">
                    <HStack>
                      <Text fontSize="sm">⚠️</Text>
                      <Text fontSize="sm" color="orange.700">
                        Storage is running low. Consider exporting and clearing old conversations.
                      </Text>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

