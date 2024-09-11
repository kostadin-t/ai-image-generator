import OpenAI from "openai";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Please enter a prompt to describe the image you want to generate: ",
  async (userPrompt) => {
    try {
      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt: userPrompt,
        n: 1,
        size: "1024x1024",
      });

      const url = result.data[0].url;
      console.log(url);

      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(`./img/`);

      response.data.pipe(writer);

      writer.on("finish", () => {
        console.log("Image downloaded successfully");
        rl.close();
      });

      writer.on("error", (error) => {
        console.error("Error occurred while downloading image:", error);
        rl.close();
      });
    } catch (error) {
      console.error("Error occurred:", error);
      rl.close();
    }
  }
);
