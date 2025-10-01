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
  Text,
} from "@chakra-ui/react";

// Import our custom components and utilities
import { ChatInput } from "./components/ChatInput";
import { ChatDisplay } from "./components/ChatDisplay";
import { ChatHistory } from "./components/ChatHistory";
import { markdownComponents } from "./components/MarkdownComponents";
import { useChat } from "./hooks/useChat";
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

  return (
    <Box p={4}>
      <Grid
        bg={useColorModeValue("gray.50", "gray.800")}
        p={6}
        borderRadius="lg"
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap={6}
        maxW="1100px"
        mx="auto"
      >
        {/* Left/Main panel */}
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="lg">DeepSeek Chat</Heading>
            <HStack spacing={3}>
              <HStack spacing={2} align="center">
                <Text fontSize="sm" color="gray.500">
                  Theme
                </Text>
                <IconButton
                  aria-label="toggle-color-mode"
                  onClick={toggleColorMode}
                  size="sm"
                  icon={
                    <Box as="span">{colorMode === "light" ? "🌙" : "☀️"}</Box>
                  }
                />
              </HStack>
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

        {/* Right/History panel */}
        <ChatHistory
          history={history}
          selectedIndex={selectedIndex}
          onSelectItem={selectHistoryItem}
          onDeleteItem={deleteHistoryItem}
          accent={accent}
        />
      </Grid>
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
