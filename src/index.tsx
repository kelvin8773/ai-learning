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
} from "@chakra-ui/react";
import axios from "axios";
import { saveAs } from "file-saver";
import ReactMarkdown from "react-markdown";
import { openDB } from "idb";

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
  const [history, setHistory] = useState<
    { question: string; answer: string }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const savedHistory = await getAllFromDB();
      setHistory(savedHistory);
    };
    fetchHistory();
  }, []);

  const askQuestion = async () => {
    if (question.toLowerCase() === "exit") {
      setAnswer("Goodbye!");
      return;
    }

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

      const answerContent = response.data.choices[0].message.content;
      const markdownContent = `# Question\n\n${question}\n\n# Answer\n\n${answerContent}`;
      setAnswer(markdownContent);

      // Save the question and answer to the local database
      await saveToDB(question, answerContent);

      // Update the history state
      setHistory([...history, { question, answer: answerContent }]);
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        setAnswer("Error: " + error.message);
      } else {
        setAnswer("An unexpected error occurred");
      }
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
          <Button onClick={askQuestion}>Submit</Button>
          <Box as="pre" whiteSpace="pre-wrap" wordBreak="break-word">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </Box>
          <Box>
            <Text fontSize="xl">History</Text>
            {history.map((item, index) => (
              <Box key={index} p={2} borderWidth={1} borderRadius="md" mb={2}>
                <Text fontWeight="bold" fontSize={24}>
                  Question:
                </Text>
                <Text>{item.question}</Text>
                <br />

                <Text fontWeight="bold" fontSize={24}>
                  Answer:
                </Text>

                <Box as="pre" whiteSpace="pre-wrap" wordBreak="break-word">
                  <ReactMarkdown >{item.answer.trim()}</ReactMarkdown>
                </Box>
                {/* <Text fontWeight="bold">Answer:</Text>
                <Text>{item.answer}</Text> */}
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
