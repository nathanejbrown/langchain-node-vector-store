import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGoogleVertexAI } from "@langchain/community/chat_models/googlevertexai";
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
// import { StringOutputParser } from '@langchain/core/output-parsers'
import * as dotenv from 'dotenv'
dotenv.config()

const prompt = ChatPromptTemplate.fromTemplate("Write a summary of the book {title} by {author}")

// const model = new ChatGoogleGenerativeAI({
//   modelName: "gemini-pro",
//   maxOutputTokens: 2048
// })

const model = new ChatGoogleVertexAI({
  temperature: 0.7,
});

const promptChain = new LLMChain({llm: model, prompt})

// const res = await model.stream([
//   ["human", "Summarize the movie 'fight club'"]
// ])

const res = await promptChain.stream({title: "middlesex", author: "jeffrey eugenides"})
// console.log('res', {res})

// let text = ''
for await (const chunk of res) {
  console.log(chunk)
  // text += chunk.content;
  // console.log(text)
}


