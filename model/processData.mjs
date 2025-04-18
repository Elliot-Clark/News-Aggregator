import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';

import getHeadlines_CNN from './cnnScraper.js';
import getHeadlines_Fox from './foxNewsScraper.js';
import getHeadlines_AP from './apNewsScraper.js';
import getHeadlines_MSNBC from './msnbcScraper.js';
import getHeadlines_ABC from './abcScraper.js';
import getHeadlines_NPR from './nprScraper.js';
import getHeadlines_Politico from './politicoScraper.js';
import getHeadlines_USA from './usaScraper.js';
import getHeadlines_WashingtonPost from './washingtonPostScraper.js';

import dotenv from 'dotenv';
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.geminiAPIKEY });


async function getAllHeadlines() {
  const currentHeadlines = ["CNN", "Fox News", "AP", "MSNBC", "ABC", "NPR", "Politico", "Usa Today", "Washington Post"]
  const allHeadlines = await Promise.all([
      getHeadlines_CNN(),
      // getHeadlines_Fox(),
      // getHeadlines_AP(),
      // getHeadlines_MSNBC(),
      // getHeadlines_ABC(),
      // getHeadlines_NPR(),
      // getHeadlines_Politico(),
      // getHeadlines_USA(),
      // getHeadlines_WashingtonPost()
  ]);
  // console.log("All data gathered!", allHeadlines.map(index => index.length));

  // allHeadlines.forEach((element, index) => {
  //   if (element.length <= 15) {
  //     fs.appendFile('../logs/errors.txt', `\nSource of ${currentHeadlines[index]} returned no headlines.`, err => {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         console.log("File written")
  //       }
  //     });
  //   }
  // })

  console.log(allHeadlines)
  return allHeadlines;
}

async function geminiCall() {
  try {
    const gatheredHeadlines = await getAllHeadlines();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `The following data is a collection of data with headlines from news websites, followed by their respective URLs. 
      Go through the data and find the most occuring events, it must be mentioned on at least two different news sites to qualify. 
      Ignore any entries with missing text, or URL. Ignore any entires that seem like advertisements or don't seem like news.
      Respond only with an array of a maximum 6 smaller arrays, each containing a single sentence summary of the event at index 0, and in the following indexes put the exact URLs from each news organization that talked about it. 
      Only list each news organization a maximum of once per array. ${JSON.stringify(gatheredHeadlines)}`,
    });
    console.log(response.text);
    console.log()
    console.log()
    let stringResponse = response.text.toString();
    let formatedResponse = stringResponse.slice(stringResponse.indexOf('['), stringResponse.length - 4);
    console.log(JSON.parse(formatedResponse));

    fs.writeFile('../logs/message.txt', formatedResponse, err => {
      if (err) {
        console.error(err);
      } else {
        console.log("File written")
      }
    });
  }
  catch (error) {
    console.error("An error occurred:", error);
  }
}

geminiCall();


