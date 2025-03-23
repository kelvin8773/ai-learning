/// <reference types="vite/client" />
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Box, Input, Button, Text, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';
import { openDB } from 'idb';

const initDB = async () => {
  const db = await openDB('DeepSeekDB', 1, {
    upgrade(db) {
      db.createObjectStore('qa', { keyPath: 'id', autoIncrement: true });
    },
  });
  return db;
};

const saveToDB = async (question: string, answer: string) => {
  const db = await initDB();
  await db.add('qa', { question, answer, timestamp: new Date() });
};

const App: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askQuestion = async () => {
    if (question.toLowerCase() === 'exit') {
      setAnswer('Goodbye!');
      return;
    }

    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        messages: [{ role: "user", content: question }],
        model: "deepseek-chat"
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        }
      });

      const answerContent = response.data.choices[0].message.content;
      const markdownContent = `# Question\n\n${question}\n\n# Answer\n\n${answerContent}`;
      setAnswer(markdownContent);

      // Save the answer as a markdown file
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, `./results/Deepseek-Result-${Date.now()}.md`);

      // Save the question and answer to the local database
      await saveToDB(question, answerContent);
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        setAnswer('Error: ' + error.message);
      } else {
        setAnswer('An unexpected error occurred');
      }
    }
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Stack spacing={4} width={400} margin="auto">
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
        </Stack>
      </Box>
    </ChakraProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);