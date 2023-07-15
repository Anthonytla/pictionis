import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

const DEFAULT_WORDS = [
  "fleur",
  "chat",
  "soleil",
  "arbre",
  "étoile",
  "maison",
  "voiture",
  "nuage",
  "montagne",
  "lapin",
  "coccinelle",
  "guitare",
  "feuille",
  "tasse",
  "chaussure",
  "crayon",
  "avion",
  "livre",
  "ballon",
  "chapeau",
  "horloge",
  "canard",
  "bateau",
  "éléphant",
  "pomme",
  "abeille",
  "grenouille",
  "souris",
  "éclair",
  "gâteau",
  "guitare",
  "marteau",
  "igloo",
  "méduse",
  "échelle",
  "ananas",
  "lunettes",
  "poisson",
  "serpent",
  "girafe",
  "bulles",
  "feu",
  "lune",
  "arc-en-ciel",
  "dragon",
  "boussole",
  "nuage",
  "fraise",
];
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const useChatGpt = () => {
  const [fetchingWords, setFetchingWords] = useState(false);

  const getRandomWords = async () => {
    try {
      setFetchingWords(true);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              "donne moi 50 mots aléatoires, différents, en minuscule et faciles à dessiner. Chaque mot doit être séparés par une virgule",
          },
        ],
        temperature: 0.9,
      });
      setFetchingWords(false);
      return completion.data.choices[0].message?.content?.split(",") ?? [];
    } catch (error: any) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        // res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
      setFetchingWords(false);
      return DEFAULT_WORDS;
    }
  };

  return { fetchingWords, getRandomWords };
};
