/**
 * Settings panel component for customizing app preferences
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
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { Text as ChakraText } from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { AccentColor, accentColors } from '../config/theme';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accent: AccentColor;
  onAccentChange: (accent: AccentColor) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  accent,
  onAccentChange,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Appearance Section */}
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <ChakraText fontWeight="semibold">Appearance</ChakraText>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    {/* Accent Color */}
                    <FormControl>
                      <FormLabel>Accent Color</FormLabel>
                      <Select
                        value={accent}
                        onChange={(e) => onAccentChange(e.target.value as AccentColor)}
                      >
                        {accentColors.map((color) => (
                          <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Font Size */}
                    <FormControl>
                      <FormLabel>Font Size</FormLabel>
                      <Box px={3}>
                        <Slider
                          defaultValue={16}
                          min={12}
                          max={20}
                          step={1}
                          aria-label="font-size-slider"
                        >
                          <SliderMark value={12} mt="1" ml="-2.5" fontSize="sm">
                            12px
                          </SliderMark>
                          <SliderMark value={16} mt="1" ml="-2.5" fontSize="sm">
                            16px
                          </SliderMark>
                          <SliderMark value={20} mt="1" ml="-2.5" fontSize="sm">
                            20px
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                    </FormControl>

                    {/* Line Spacing */}
                    <FormControl>
                      <FormLabel>Line Spacing</FormLabel>
                      <Box px={3}>
                        <Slider
                          defaultValue={1.5}
                          min={1.2}
                          max={2.0}
                          step={0.1}
                          aria-label="line-spacing-slider"
                        >
                          <SliderMark value={1.2} mt="1" ml="-2.5" fontSize="sm">
                            Tight
                          </SliderMark>
                          <SliderMark value={1.5} mt="1" ml="-2.5" fontSize="sm">
                            Normal
                          </SliderMark>
                          <SliderMark value={2.0} mt="1" ml="-2.5" fontSize="sm">
                            Loose
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                    </FormControl>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {/* API Configuration Section */}
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <ChakraText fontWeight="semibold">API Configuration</ChakraText>
                        <Badge colorScheme="blue" size="sm">Advanced</Badge>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    {/* Model Selection */}
                    <FormControl>
                      <FormLabel>AI Model</FormLabel>
                      <Select defaultValue="deepseek-chat">
                        <option value="deepseek-chat">DeepSeek Chat</option>
                        <option value="deepseek-coder">DeepSeek Coder</option>
                      </Select>
                    </FormControl>

                    {/* Temperature */}
                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <ChakraText>Temperature</ChakraText>
                          <Tooltip label="Controls randomness in responses. Lower = more focused, Higher = more creative">
                            <IconButton
                              aria-label="temperature-info"
                              icon={<FiInfo />}
                              size="xs"
                              variant="ghost"
                            />
                          </Tooltip>
                        </HStack>
                      </FormLabel>
                      <Box px={3}>
                        <Slider
                          defaultValue={0.7}
                          min={0}
                          max={2}
                          step={0.1}
                          aria-label="temperature-slider"
                        >
                          <SliderMark value={0} mt="1" ml="-2.5" fontSize="sm">
                            Focused
                          </SliderMark>
                          <SliderMark value={1} mt="1" ml="-2.5" fontSize="sm">
                            Balanced
                          </SliderMark>
                          <SliderMark value={2} mt="1" ml="-2.5" fontSize="sm">
                            Creative
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                    </FormControl>

                    {/* Max Tokens */}
                    <FormControl>
                      <FormLabel>Max Response Length</FormLabel>
                      <Select defaultValue="2048">
                        <option value="1024">Short (1K tokens)</option>
                        <option value="2048">Medium (2K tokens)</option>
                        <option value="4096">Long (4K tokens)</option>
                        <option value="8192">Very Long (8K tokens)</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {/* Privacy & Data Section */}
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <ChakraText fontWeight="semibold">Privacy & Data</ChakraText>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    {/* Auto-save */}
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb="0">Auto-save conversations</FormLabel>
                        <ChakraText fontSize="sm" color="gray.500">
                          Automatically save chat history locally
                        </ChakraText>
                      </Box>
                      <Switch defaultChecked />
                    </FormControl>

                    {/* Data retention */}
                    <FormControl>
                      <FormLabel>Data Retention</FormLabel>
                      <Select defaultValue="30">
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                        <option value="0">Forever</option>
                      </Select>
                    </FormControl>

                    {/* Export format */}
                    <FormControl>
                      <FormLabel>Default Export Format</FormLabel>
                      <Select defaultValue="markdown">
                        <option value="markdown">Markdown (.md)</option>
                        <option value="pdf">PDF (.pdf)</option>
                        <option value="json">JSON (.json)</option>
                        <option value="txt">Plain ChakraText (.txt)</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {/* Keyboard Shortcuts Section */}
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <ChakraText fontWeight="semibold">Keyboard Shortcuts</ChakraText>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <ChakraText>Send message</ChakraText>
                      <Badge colorScheme="gray">Ctrl+Enter</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <ChakraText>Clear input</ChakraText>
                      <Badge colorScheme="gray">Escape</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <ChakraText>Toggle theme</ChakraText>
                      <Badge colorScheme="gray">Ctrl+Shift+T</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <ChakraText>Open settings</ChakraText>
                      <Badge colorScheme="gray">Ctrl+,</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <ChakraText>Open history</ChakraText>
                      <Badge colorScheme="gray">Ctrl+H</Badge>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme={accent} onClick={onClose}>
              Save Settings
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
