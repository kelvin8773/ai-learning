/// <reference types="vite/client" />
import "./index.css";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  Box,
  Grid,
  VStack,
  HStack,
  Heading,
  ColorModeScript,
  useColorMode,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import { Toaster } from "react-hot-toast";

// Import our custom components and utilities
import { ChatInput } from "./components/ChatInput";
import { ChatDisplay } from "./components/ChatDisplay";
import { ChatHistory } from "./components/ChatHistory";
import { SettingsPanel } from "./components/SettingsPanel";
import { markdownComponents } from "./components/MarkdownComponents";
import { useChat } from "./hooks/useChat";
import { useKeyboardShortcuts, createAppShortcuts } from "./hooks/useKeyboardShortcuts";
import { theme, accentColors, AccentColor } from "./config/theme";
import { validateEnvironment } from "./config/env";

// Validate environment on startup
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
}

const App: React.FC = () => {
  const [accent, setAccent] = useState<AccentColor>('blue');
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Mobile drawer state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Settings panel state
  const { 
    isOpen: isSettingsOpen, 
    onOpen: onSettingsOpen, 
    onClose: onSettingsClose 
  } = useDisclosure();
  
  // Use our custom chat hook
  const {
    question,
    answer,
    loading,
    history,
    selectedIndex,
    error,
    setQuestion,
    setAnswer,
    setSelectedIndex,
    askQuestion,
    deleteHistoryItem,
    selectHistoryItem,
    clearError,
  } = useChat();

  const selectedQuestion = selectedIndex !== null ? history[selectedIndex]?.question : undefined;

  // Keyboard shortcuts
  const shortcuts = createAppShortcuts(
    toggleColorMode,
    onSettingsOpen,
    onOpen,
    () => {
      // Focus input field
      const textarea = document.querySelector('textarea[placeholder*="question"]') as HTMLTextAreaElement;
      textarea?.focus();
    },
    () => {
      setQuestion('');
      clearError();
    }
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <Box p={{ base: 2, md: 4 }}>
      <Grid
        bg={useColorModeValue("gray.50", "gray.800")}
        p={{ base: 4, md: 6 }}
        borderRadius="lg"
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap={6}
        maxW="1100px"
        mx="auto"
        minH="100vh"
      >
        {/* Left/Main panel */}
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              {isMobile && (
                <IconButton
                  aria-label="open-history"
                  icon={<HamburgerIcon />}
                  onClick={onOpen}
                  size="sm"
                  variant="ghost"
                />
              )}
              <Heading size="lg">DeepSeek Chat</Heading>
            </HStack>
            <HStack spacing={3}>
              <HStack spacing={2} align="center">
                <ChakraText fontSize="sm" color="gray.500" display={{ base: "none", sm: "block" }}>
                  Theme
                </ChakraText>
                <IconButton
                  aria-label="toggle-color-mode"
                  onClick={toggleColorMode}
                  size="sm"
                  icon={
                    <Box as="span">{colorMode === "light" ? "🌙" : "☀️"}</Box>
                  }
                />
              </HStack>
              <IconButton
                aria-label="settings"
                icon={<SettingsIcon />}
                size="sm"
                variant="ghost"
                onClick={onSettingsOpen}
              />
            </HStack>
          </HStack>

          <ChatInput
            question={question}
            onQuestionChange={setQuestion}
            onSubmit={askQuestion}
            loading={loading}
            error={error}
            onClearError={clearError}
            accent={accent}
          />

          <ChatDisplay
            question={question}
            answer={answer}
            loading={loading}
            selectedQuestion={selectedQuestion}
            markdownComponents={markdownComponents}
          />
        </VStack>

        {/* Right/History panel - Desktop */}
        {!isMobile && (
          <ChatHistory
            history={history}
            selectedIndex={selectedIndex}
            onSelectItem={selectHistoryItem}
            onDeleteItem={deleteHistoryItem}
            accent={accent}
          />
        )}
      </Grid>

      {/* Mobile History Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chat History</DrawerHeader>
          <DrawerBody p={0}>
            <Box p={4}>
              <ChatHistory
                history={history}
                selectedIndex={selectedIndex}
                onSelectItem={(index) => {
                  selectHistoryItem(index);
                  onClose(); // Close drawer after selection on mobile
                }}
                onDeleteItem={deleteHistoryItem}
                accent={accent}
              />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
        accent={accent}
        onAccentChange={setAccent}
      />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: useColorModeValue('#fff', '#1a202c'),
            color: useColorModeValue('#1a202c', '#fff'),
          },
        }}
      />
    </Box>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>
);
