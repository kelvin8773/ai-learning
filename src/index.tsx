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
  Tooltip,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import { Toaster } from "react-hot-toast";

// Import our custom components and utilities
import { ChatInput } from "./components/ChatInput";
import { ChatDisplay } from "./components/ChatDisplay";
import { ChatHistory } from "./components/ChatHistory";
import { SettingsPanel } from "./components/SettingsPanel";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { DataManagement } from "./components/DataManagement";
import { markdownComponents } from "./components/MarkdownComponents";
import { useStreamingChat } from "./hooks/useStreamingChat";
import { useKeyboardShortcuts, createAppShortcuts } from "./hooks/useKeyboardShortcuts";
import { usePreferences } from "./hooks/usePreferences";
import { theme, AccentColor } from "./config/theme";
import { validateEnvironment } from "./config/env";
import { testApiConnection } from "./services/deepseekApi";
import { storageService } from "./services/storageService";

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
  
  const { 
    isOpen: isAnalyticsOpen, 
    onOpen: onAnalyticsOpen, 
    onClose: onAnalyticsClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDataMgmtOpen, 
    onOpen: onDataMgmtOpen, 
    onClose: onDataMgmtClose 
  } = useDisclosure();
  
  // Use our custom streaming chat hook
  const {
    question,
    answer,
    loading,
    streaming,
    history,
    selectedIndex,
    error,
    setQuestion,
    askQuestion,
    askQuestionStreaming,
    deleteHistoryItem,
    selectHistoryItem,
    clearError,
    stopStreaming,
  } = useStreamingChat();
  
  // User preferences
  const { preferences, updatePreference } = usePreferences();
  
  // Update analytics on question submit
  React.useEffect(() => {
    if (answer && !loading) {
      storageService.updateAnalytics({ questionsAsked: 1 });
    }
  }, [answer, loading]);

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

  // Add analytics and data management shortcuts
  shortcuts.push({
    key: 'a',
    ctrlKey: true,
    description: 'Open Analytics',
    action: onAnalyticsOpen,
  });
  
  shortcuts.push({
    key: 'd',
    ctrlKey: true,
    shiftKey: true,
    description: 'Open Data Management',
    action: onDataMgmtOpen,
  });

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
              <Heading size="lg">AI Chat</Heading>
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
              <Tooltip label="Analytics (Ctrl+A)">
                <IconButton
                  aria-label="analytics"
                  icon={<Box as="span">📊</Box>}
                  size="sm"
                  variant="ghost"
                  onClick={onAnalyticsOpen}
                />
              </Tooltip>
              <Tooltip label="Data Management (Ctrl+Shift+D)">
                <IconButton
                  aria-label="data-management"
                  icon={<Box as="span">🗂️</Box>}
                  size="sm"
                  variant="ghost"
                  onClick={onDataMgmtOpen}
                />
              </Tooltip>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    await testApiConnection();
                  } catch (error) {
                    console.error('API test failed:', error);
                  }
                }}
              >
                Test API
              </Button>
              <Tooltip label="Settings (Ctrl+,)">
                <IconButton
                  aria-label="settings"
                  icon={<SettingsIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={onSettingsOpen}
                />
              </Tooltip>
            </HStack>
          </HStack>

          <ChatInput
            question={question}
            onQuestionChange={setQuestion}
            onSubmit={askQuestion}
            onSubmitStreaming={askQuestionStreaming}
            loading={loading}
            streaming={streaming}
            error={error}
            onClearError={clearError}
            onStopStreaming={stopStreaming}
            accent={accent}
          />

          <ChatDisplay
            question={question}
            answer={answer}
            loading={loading}
            streaming={streaming}
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

      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={onAnalyticsClose}
        conversationCount={history.length}
      />

      {/* Data Management */}
      <DataManagement
        isOpen={isDataMgmtOpen}
        onClose={onDataMgmtClose}
        onDataCleared={() => {
          // Data will be cleared and page will refresh
        }}
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

const container = document.getElementById("root") as HTMLElement;

// Check if root already exists (for HMR compatibility)
let root = (container as any)._reactRoot;
if (!root) {
  root = ReactDOM.createRoot(container);
  (container as any)._reactRoot = root;
}

root.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>
);
