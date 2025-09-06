/// <reference types="vite/client" />
import "./index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  Text,
  Grid,
  VStack,
  HStack,
  Spinner,
  Center,
  Heading,
  Divider,
  extendTheme,
  ColorModeScript,
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
// use simple emoji icons to avoid adding @chakra-ui/icons dependency
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { openDB } from "idb";

/**
 * Initializes the IndexedDB database for storing question and answer pairs.
 * If the database doesn't exist, it will be created with a single object
 * store named "qa" which has an auto-incrementing key named "id".
 * @returns {Promise<IDBDatabase>} The initialized database.
 */
const initDB = async () => {
  const db = await openDB("DeepSeekDB", 1, {
    upgrade(db) {
      db.createObjectStore("qa", { keyPath: "id", autoIncrement: true });
    },
  });
  return db;
};

const saveToDB = async (question: string, answer: string) => {
  const db = await initDB();
  const id = await db.add("qa", { question, answer, timestamp: new Date() });
  return id;
};

const deleteFromDB = async (id: number) => {
  const db = await initDB();
  await db.delete("qa", id);
};

// clearDB removed per user request; selective delete remains

const getAllFromDB = async () => {
  const db = await initDB();
  return await db.getAll("qa");
};

const theme = extendTheme({
  config: { initialColorMode: "system", useSystemColorMode: true },
  fonts: { heading: `Inter, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`, body: `Inter, system-ui, -apple-system, 'Segoe UI', Roboto` },
});

const AccentSwatch: React.FC<{ color: string; selected: boolean; onClick: () => void }> = ({ color, selected, onClick }) => (
  <IconButton
    aria-label={`accent-${color}`}
    onClick={onClick}
    size="sm"
    bg={`${color}.400`}
    _hover={{ bg: `${color}.500` }}
    border={selected ? "2px solid" : undefined}
    borderColor={selected ? "whiteAlpha.800" : undefined}
    borderRadius="full"
    w={6}
    h={6}
  />
);

const App: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { id?: number; question: string; answer: string; timestamp: any }[]
  >([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [accent, setAccent] = useState<string>("blue");
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.800");
  const panelBg = useColorModeValue("white", "gray.700");
  const itemBgDefault = useColorModeValue("gray.50", "gray.700");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");
  const itemText = useColorModeValue("gray.600", "gray.300");
  const timeText = useColorModeValue("gray.500", "gray.400");
  const selectedBg = useColorModeValue(`${accent}.50`, `${accent}.700`);
  const selectedBorder = `${accent}.400`;

  useEffect(() => {
    const fetchHistory = async () => {
      const savedHistory = await getAllFromDB();
      // Normalize timestamps (they may be strings in IndexedDB)
      const normalized = savedHistory.map((h: any) => ({
        ...h,
        timestamp: h.timestamp ? new Date(h.timestamp) : new Date(),
      }));
      // Sort history in descending order by timestamp
      normalized.sort((a: any, b: any) => b.timestamp - a.timestamp);
      setHistory(normalized);
    };
    fetchHistory();
  }, []);

  const askQuestion = async () => {
    if (question.toLowerCase() === "exit") {
      setAnswer("Goodbye!");
      return;
    }
  setLoading(true);
  try {
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          messages: [{ role: "user", content: question }],
          model: "deepseek-chat",
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

        const answerContent = response.data.choices[0].message.content.trim();
        // store raw answer content (rendered separately in UI)
        setAnswer(answerContent);

  // Save the question and answer to the local database
  const timestamp = new Date();
  const idRaw = await saveToDB(question, answerContent);
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw);

  // Update the history state and select the new entry (use functional update to avoid stale state)
  setHistory((h) => [{ id, question, answer: answerContent, timestamp }, ...h]);
  setSelected(0);
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        setAnswer("Error: " + error.message);
      } else {
        setAnswer("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Grid bg={bg} p={6} borderRadius="lg" templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} maxW="1100px" mx="auto">
          {/* Left/Main panel */}
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="lg">DeepSeek Chat</Heading>
              <HStack spacing={3}>
                <HStack spacing={2} align="center">
                  <Text fontSize="sm" color="gray.500">Theme</Text>
                  <IconButton aria-label="toggle-color-mode" onClick={toggleColorMode} size="sm" icon={<Box as="span">{colorMode === 'light' ? '🌙' : '☀️'}</Box>} />
                </HStack>
                <HStack spacing={2} align="center">
                  <Text fontSize="sm" color="gray.500">Accent</Text>
                  {['blue','teal','purple','orange','pink'].map(c => (
                    <AccentSwatch key={c} color={c} selected={accent===c} onClick={() => setAccent(c)} />
                  ))}
                </HStack>
              </HStack>
            </HStack>

            <HStack>
              <Input
                placeholder="Ask a question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                bg={useColorModeValue('white','gray.600')}
                borderColor={useColorModeValue('gray.200','gray.600')}
              />
              <Button onClick={askQuestion} isLoading={loading} loadingText="Thinking..." colorScheme={accent}>
                Submit
              </Button>
            </HStack>

            <VStack spacing={4} align="stretch">
              {/* Question section */}
              <Box
                bg={panelBg}
                p={4}
                borderRadius="md"
                boxShadow="xs"
                borderWidth={1}
                borderColor={useColorModeValue('gray.100','gray.600')}
              >
                <Text fontSize="sm" color="gray.500">
                  Question
                </Text>
                <Text fontSize="lg" fontWeight="semibold" mt={2}>
                  {question || (selected !== null ? history[selected]?.question : "No question selected")}
                </Text>
              </Box>

              {/* Answer section */}
              <Box bg={panelBg} p={6} borderRadius="md" boxShadow="sm" minH="220px" overflowY="auto">
                {loading ? (
                  <Center py={8}>
                    <Spinner size="xl" />
                  </Center>
                ) : answer ? (
                  <Box>
                    <Text fontSize="sm" color="gray.500">Answer</Text>
                    <Box
                      mt={3}
                      p={4}
                      borderRadius="md"
                      fontSize="md"
                      lineHeight="1.9"
                      sx={{
                        'p': { mb: 4, lineHeight: 1.9 },
                        'li': { mb: 2 },
                        'pre': { whiteSpace: 'pre-wrap', overflowX: 'auto', p: 3, bg: useColorModeValue('gray.100','gray.700'), borderRadius: 6 },
                        'code': { bg: useColorModeValue('gray.100','gray.700'), px: 1, borderRadius: 4, fontSize: '0.95em' },
                        'table': { width: '100%', borderCollapse: 'collapse', mt: 4 },
                        'th, td': { border: '1px solid', borderColor: useColorModeValue('gray.200','gray.600'), px: 3, py: 2, textAlign: 'left' },
                        'thead th': { bg: useColorModeValue('gray.100','gray.600'), fontWeight: 600 },
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
                    </Box>
                  </Box>
                ) : (
                  <Text color="gray.500">No answer yet. Ask something above.</Text>
                )}
              </Box>
            </VStack>
          </VStack>

          {/* Right/History panel */}
          <Box>
            <Heading size="md">History</Heading>
            <Divider mb={3} />
            <VStack spacing={3} align="stretch" maxH={{ base: "40vh", md: "70vh" }} overflowY="auto">
              {history.length === 0 && <Text color="gray.500">No history yet.</Text>}
              {history.map((item, index) => {
                // create a plain-text preview to avoid rendering markdown tables in the sidebar
                const preview = (item.answer || "").replace(/\s+/g, " ").trim();
                const previewShort = preview.length > 160 ? preview.slice(0, 157) + "..." : preview;
                return (
                  <Box
                      key={`${item.timestamp?.toString() || index}-${index}`}
                      p={3}
                      bg={selected === index ? selectedBg : itemBgDefault}
                      borderRadius="md"
                      boxShadow={selected === index ? "sm" : "xs"}
                      borderLeft={selected === index ? "4px solid" : undefined}
                      borderColor={selected === index ? selectedBorder : undefined}
                      position="relative"
                      _hover={{ bg: selected === index ? selectedBg : itemHoverBg, cursor: "pointer", '.delete-btn': { opacity: 1 } }}
                    >
                    <Text fontSize="sm" color={timeText}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                      <HStack justify="space-between" align="start">
                        <Box onClick={() => { setSelected(index); setQuestion(item.question); setAnswer(item.answer); }}>
                          <Text fontWeight="semibold" mt={2} noOfLines={1} color={itemText}>
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
                              await deleteFromDB(item.id);
                              setHistory((h) => h.filter((x) => x.id !== item.id));
                              if (selected === index) {
                                setSelected(null);
                                setAnswer("");
                              }
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
        </Grid>
      </Box>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>
);
