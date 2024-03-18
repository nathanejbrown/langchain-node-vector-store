import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const txtFilename = "The_Creative_Act";
const question = 'What is the wisdom of The Opposite Is True?';
const txtPath = `./${txtFilename}.txt`;
const VECTOR_STORE_PATH = `${txtFilename}.index`;

export const runWithEmbeddings = async () => {
  const model = new OpenAI({});

  let vectorStore;
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    console.log('Vector exists');
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
  } else {
    const text = fs.readFileSync(txtPath, 'utf8');

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000});

    const docs = await textSplitter.createDocuments([text]);

    vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    await vectorStore.save(VECTOR_STORE_PATH);
  }

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  const res = await chain.invoke({
    query: question,
  });

  console.log('res', { res });
}

runWithEmbeddings();