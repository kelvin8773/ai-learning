// skeleton code for a CLI that asks DeepSeek questions and prints the response
// Usage: node ask-deepseek-cli.js

import OpenAI from "openai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.VITE_OPENAI_API_KEY
});

async function getResponse(question) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: question }],
    model: "deepseek-chat",
  });

  return completion.choices[0].message.content;
}

async function main() {
  while (true) {
    const question = readlineSync.question('Ask a question: ');
    if (question.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      break;
    }
    const answer = await getResponse(question);
    console.log('Answer:', answer);
  }
}

main();