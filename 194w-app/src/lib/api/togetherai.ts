import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { TOGETHER_API_KEY } from "@env";

/* helps make sure api does not lose connection before request call */
const isConnected = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

const BASE_URL = "https://api.together.xyz/v1/chat/completions";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOGETHER_API_KEY}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  timeout: 15000, // 15 seconds timeout
});

/**
 * extracts a JSON object from a journal entry using llm.
 * JSON Format {"symptoms": string, "duration": string, "sensation": string, "causes": string,
 *              "what-happened": string, "concerns": string, "when-does-it-hurt": string}
 * @param {string} journalText user's journal entry
 * @returns extracted JSON
 */
export const extractDetailedEntryJSON = async (
  journalText: string,
  retryCount = 3, // Retry logic
  delay = 2000 // Delay between retries
) => {
  if (!journalText.trim()) return {};

  console.log("🔹 Checking internet connection...");
  const connection = await isConnected();
  if (!connection) {
    console.warn("⚠️ No internet connection. Retrying...");
    return {};
  }

  console.log("🔹 Sending request to Together AI...");

  while (retryCount > 0) {
    try {
      const response = await axiosInstance.post("", {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: `You are a medical symptom extraction assistant. 
              
              Your task is to extract structured medical information from a user-provided journal entry and return it **strictly as a JSON object** with the following fields:

              {
                "symptoms": string, // Comma-separated list of symptoms (e.g., "headache, nausea"). Set to null if no symptoms found.
                "duration": string, // One of: "<1min", "few minutes", "<30 minutes", "1 hour", "few hours", "a day", "few days", "a week", ">a week", or null if not mentioned.
                "sensation": string, // Comma-separated list describing the sensations (e.g., "sharp, throbbing"). Set to null if not specified.
                "causes": string, // Short description of suspected causes if mentioned, otherwise null.
                "what-happened": string, // Brief summary of the situation leading to symptoms if available, otherwise null.
                "concerns": string, // User's explicit concerns (e.g., "I'm worried it's my heart") if mentioned, otherwise null.
                "when-does-it-hurt": string // One of: "constant", "occasional", "once", "movement", "other triggers", or null if not mentioned.
              }

              ### Rules
              - Fill every field based only on the journal entry.
              - If the journal entry does not mention a field, set it to null.
              - Return **only the JSON object**, with no commentary, explanations, disclaimers, or formatting.

              ### Example Journal Entry
              "My right knee hurts whenever I climb stairs."

              ### Example JSON Output
              {
                  "symptoms": "knee pain",
                  "duration": null,
                  "sensation": null,
                  "causes": null,
                  "what-happened": "right knee pain when climbing stairs",
                  "concerns": null,
                  "when-does-it-hurt": "movement"
              }

              Remember: Output only valid JSON, no extra text.`,
          },
          {
            role: "user",
            content: `Journal Entry: ${journalText}`,
          },
        ],
        temperature: 0,
      });

      const data = await response.data;
      console.log("✅ Response from AI:", data);

      let rawText: string = response.data.choices?.[0]?.message?.content || "";
      console.log("raw text: ", rawText);

      const jsonMatch = rawText.match(/\{[\s\S]*\}/); // remove additional assumptions
      if (!jsonMatch) {
        throw new Error("No JSON object found in AI response.");
      }

      const cleanedJson = jsonMatch[0]; // this should be only the JSON part
      console.log("Cleaned JSON:", cleanedJson);

      const parsedData = JSON.parse(cleanedJson);
      // fallback defaults to guarantee all fields exist
      const defaultFields = {
        symptoms: null,
        duration: null,
        sensation: null,
        causes: null,
        "what-happened": null,
        concerns: null,
        "when-does-it-hurt": null,
      };

      const finalData = { ...defaultFields, ...parsedData };

      console.log("✅ Final Parsed Data:", finalData);
      return finalData;
    } catch (error) {
      console.error(
        `❌ Error extracting info (Attempts left: ${retryCount - 1}):`,
        error
      );
      retryCount--;

      if (retryCount === 0) {
        console.warn("⚠️ Max retries reached. Returning empty obj.");
        return {}; // Max retries reached, return empty array
      }
      console.warn(`⚠️ Retrying AI Extraction... ${retryCount} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Exponential backoff
      delay *= 2; // Increase delay for next attempt
    }
  }

  console.warn("⚠️ Returning empty obj.");
  return {};
};

/**
 * extracts keywords from a journal entry using llm (flow will be react -> llm -> react).
 * view "write log flow" for more clarity.
 * @param {string} journalText user's journal entry
 * @returns {Promise<string[]>} extracted keywords
 */
export const extractKeywords = async (
  journalText: string,
  retryCount = 3, // Retry logic
  delay = 2000 // Delay between retries
): Promise<string[]> => {
  if (!journalText.trim()) return [];

  console.log("🔹 Checking internet connection...");
  const connection = await isConnected();
  if (!connection) {
    console.warn("⚠️ No internet connection. Retrying...");
    return [];
  }

  console.log("🔹 Sending request to Together AI...");

  while (retryCount > 0) {
    try {
      const response = await axiosInstance.post("", {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content:
              "Extract only the key symptoms from the following journal entry and return them as a comma-separated list, with no additional explanation, descriptions, or formatting.",
          },
          {
            role: "user",
            content: `Extract key symptoms from this journal entry: ${journalText}`,
          },
        ],
        temperature: 0,
      });

      const data = await response.data;
      console.log("✅ Response from AI:", data);

      // Extract keywords response
      let rawText: string =
        data.choices?.[0]?.message?.content.split("\n")[0].trim() || "";
      console.log(rawText);

      const keywords = rawText
        .split(",")
        .map((word) =>
          word.trim().replace(/^"|"$/g, "").toLowerCase().replace(/\.$/, "")
        ) // Remove quotes if present
        .filter(Boolean); // Remove empty strings

      return keywords;
    } catch (error) {
      console.error(
        `❌ Error extracting keywords (Attempts left: ${retryCount - 1}):`,
        error
      );
      retryCount--;

      if (retryCount === 0) {
        console.warn("⚠️ Max retries reached. Returning empty array.");
        return []; // Max retries reached, return empty array
      }
      console.warn(`⚠️ Retrying AI Extraction... ${retryCount} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Exponential backoff
      delay *= 2; // Increase delay for next attempt
    }
  }

  console.warn("⚠️ Returning empty array.");
  return [];
};

export const extractExport = async (
  formattedInput: string,
  retryCount = 3, // Retry logic
  delay = 2000 // Delay between retries
): Promise<string[]> => {
  if (!formattedInput.trim()) return [];

  console.log("🔹 Sending request to Together AI...");
  while (retryCount > 0) {
    try {
      const response = await axiosInstance.post("", {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that extracts key symptoms  **strictly based on the provided structured medical data** and reformats them into clear, structured statements for a doctor. Provide three concise summaries with:
              - When the symptom started (e.g., "three days ago," "since this morning").
              - How it has changed over time (e.g., worsening, stable, intermittent).
              - How severe it is and how it affects daily life (e.g., "severe fatigue, making it hard to focus").

            **Output Example:**
                "I started feeling a sore throat three days ago, and now it’s painful to swallow."
                "My fever spiked to 100.2°F last night and hasn’t gone down."
                "I’ve been feeling exhausted since this morning, making it hard to focus on work."
            
            **Rules:**
              - Do **not** include numbered list, bullet points, or formatting symbols.
              - Only use data from the structured input.
              - Do not add any symptoms, durations, or causes not present.
              - Do not add placeholders or generic text if no symptom exists.
              - Keep the language **natural and easy to understand**.
              - Return only the formatted symptom statements, **nothing else**.
              - Do not use bold formatting (**) in your response.`,
          },
          {
            role: "user",
            content: `Extract and structure the symptoms from this structured symptom data: \n\n"${formattedInput}"`,
          },
        ],
        temperature: 0,
      });

      console.log("✅ Response from AI:", response.data);

      // extract keywords response
      let rawText: string = response.data.choices?.[0]?.message?.content || "";
      console.log("rawText from AI:", rawText);
      const cleanedSummaries = rawText
        .split("\n")
        .map((line) =>
          line
            .trim()
            .replace(/^\d+\.\s*/, "") // remove "1. ", "2. ", etc.
            .replace(/^[-•]\s*/, "") // remove bullet points like "-" or "•"
            .trim()
        )
        .filter(Boolean); // remove empty lines

      console.log("Cleaned summaries:", cleanedSummaries);

      return cleanedSummaries;
    } catch (error: any) {
      console.error(
        `❌ Error extracting structured summaries (Attempts left: ${
          retryCount - 1
        }):`,
        error.response?.data || error.message
      );
      retryCount--;

      if (retryCount === 0) {
        console.warn("⚠️ Max retries reached. Returning empty array.");
        return [];
      }
      console.warn(`⚠️ Retrying extractExport... ${retryCount} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  console.warn("⚠️ Returning empty array.");
  return [];
};
