/// <reference types="vite/client" />
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  Text,
  Stack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
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
  await db.add("qa", { question, answer, timestamp: new Date() });
};

const getAllFromDB = async () => {
  const db = await initDB();
  return await db.getAll("qa");
};

const App: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { question: string; answer: string; timestamp: Date }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const savedHistory = await getAllFromDB();
      // Sort history in descending order by timestamp
      savedHistory.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(savedHistory);
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
      const markdownContent = `# Question\n\n${question}\n\n# Answer\n\n${answerContent}`;
      setAnswer(markdownContent);

      // Save the question and answer to the local database
      const timestamp = new Date();
      await saveToDB(question, answerContent);

      // Update the history state
      setHistory([{ question, answer: answerContent, timestamp }, ...history]);
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
    <ChakraProvider>
      <Box p={4}>
        <Stack spacing={4} width={500} margin="auto">
          <Text fontSize="2xl">DeepSeek Chat</Text>
          <Input
            placeholder="Ask a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button onClick={askQuestion} isLoading={loading} loadingText="Thinking...">
            Submit
          </Button>
          <Box as="pre" whiteSpace="pre-wrap" wordBreak="break-word" minHeight="120px">
            {loading ? (
              <Center py={8}>
                <Spinner size="xl" />
              </Center>
            ) : (
              <ReactMarkdown>{answer}</ReactMarkdown>
            )}
          </Box>
          <Box>
            <Text fontSize="xl">History</Text>
            {history.map((item, index) => (
              <Box key={index} p={2} borderWidth={1} borderRadius="md" mb={2}>
                <Text fontSize="lg" color="gray.500">
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
                <div>
                  <Text fontWeight="bold" fontSize={24}>
                    Question:
                  </Text>
                </div>
                <Text>{item.question}</Text>
                <Text fontWeight="bold" fontSize={24}>
                  Answer:
                </Text>
                <Box as="pre" whiteSpace="pre-wrap" wordBreak="break-word">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
    </ChakraProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
