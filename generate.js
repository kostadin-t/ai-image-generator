import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';

const configuration = {
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "sk-proj-gdStKEKvmKxqpN0QymmqT3BlbkFJ5T4l7JivItdaSKZoWEKF",
};

const openai = new OpenAI(configuration);

const prompt = 'Generate A logo that contains no text and letters at all. It is for a product of the company Novarto. The product is called Novarto Goldfish AI. Do not put any text in the logo image. The product is an AI software that answers questions for company employees based on files fetched from google drive using RAG technology. ';

const result = await openai.images.generate(
    {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
    }
)


const url = result.data[0].url;
console.log(url);


const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  
  const writer = fs.createWriteStream(`./img/`);
  
  response.data.pipe(writer);
  
  writer.on('finish', () => {
    console.log('Image downloaded successfully');
  });
  
  writer.on('error', (error) => {
    console.error('Error occurred while downloading image:', error);
  });
// const imgResult = fetch(url);
// const blob = await imgResult.blob();
// const buffer = Buffer.from(await blob.arrayBuffer());
// writeFileSync(`./img/${Date.now()}.png`, buffer);