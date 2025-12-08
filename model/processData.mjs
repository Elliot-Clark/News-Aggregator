import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';

import getHeadlines_CNN from './webScrapers/cnnScraper.js';
import getHeadlines_Fox from './webScrapers/foxNewsScraper.js';
import getHeadlines_AP from './webScrapers/apNewsScraper.js';
import getHeadlines_MSNBC from './webScrapers/msnbcScraper.js';
import getHeadlines_ABC from './webScrapers/abcScraper.js';
import getHeadlines_NPR from './webScrapers/nprScraper.js';
import getHeadlines_Politico from './webScrapers/politicoScraper.js';
import getHeadlines_USA from './webScrapers/usaScraper.js';
import getHeadlines_WashingtonPost from './webScrapers/washingtonPostScraper.js';
import getHeadlines_Yahoo from './webScrapers/yahooScraper.js'

import dotenv from 'dotenv';
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.geminiAPIKEY });


async function getAllHeadlines() {
  const currentHeadlines = ["CNN", "Fox News", "AP", "MSNBC", "ABC", "NPR", "Politico", "Usa Today", "Washington Post", "Yahoo"]
  const allHeadlines = await Promise.all([
      getHeadlines_CNN(),
      getHeadlines_Fox(),
      getHeadlines_AP(),
      getHeadlines_MSNBC(),
      getHeadlines_ABC(),
      getHeadlines_NPR(),
      getHeadlines_Politico(),
      getHeadlines_USA(),
      getHeadlines_WashingtonPost(),
      getHeadlines_Yahoo()
  ]);
  console.log("All data gathered!", allHeadlines.map(index => index.length));

  allHeadlines.forEach((element, index) => {
    if (element.length <= 2) {
      console.log(`Source of ${currentHeadlines[index]} returned no headlines at: ${new Date()}`)
    }
  })
  return allHeadlines;
}

async function geminiCall() {
  try {
    const gatheredHeadlines = await getAllHeadlines();

    async function geminiFetch(gatheredHeadlines, attempt)  {

      if (attempt > 1) {
        console.log("Repeat gemini call failed");
        return 
      }

      const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The following data is a collection of data with headlines from news websites, followed by their respective URLs. 
      Go through the data and find the most occuring events, it must be mentioned on at least two different news sites to qualify. 
      Ignore any entries with missing text, or URL. Ignore any entires that seem like advertisements or don't seem like news.
      Respond only with an array of a maximum 8 smaller arrays, each containing a single sentence summary of the event at index 0, and in the following indexes put the exact URLs from each news organization that talked about it. 
      Only list each news organization a maximum of once per array. Do not add any additional text to the URLs.
      Example format:
      [
        [
          "Summary of news event",
          "headline URL 1",
          "headline URL 2",
          "headline URL..."
        ],
        [
          "Summary of other event",
          "headline URL 1",
          "headline URL 2..."
        ],
      ]

      ${JSON.stringify(gatheredHeadlines)}`,
      });
      let stringResponse = response.text.toString();
      try {
        // The resposne from gemini can convert into the desired JSON format 98% of the time
        let formattedResponse = stringResponse.slice(stringResponse.indexOf('['), stringResponse.length - 4);
        let arrayResponse = JSON.parse(formattedResponse)
        return arrayResponse;
      } catch {
        // For when it doesn't, we simply need to send the data back to gemini and give it another go
        console.log("AI response parse text error:");
        console.log(stringResponse);
        console.log("Trying again...");
        // But there's always a chance gemini is simply down or something else is causing the error, so we increment a max attempt amount so it doesn't try forever
        return await geminiFetch(gatheredHeadlines, attempt++);
      }
    }

    let jsonResponse = await geminiFetch(gatheredHeadlines, 0);
    console.log("AI response formatted!");
    return jsonResponse;
  }
  catch (error) {
    console.error("An error occurred:", error);
  }
}

export default geminiCall;