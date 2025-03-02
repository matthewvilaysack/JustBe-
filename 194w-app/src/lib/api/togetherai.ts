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
            // {
            //   role: "system",
            //   content:
            //     "Fill out a JSON string using a journal entry, make sure to capture key medical information. Put null when information is not mentioned in the journal entry",
            // },
            {
              role: "user",
              content: 
              `Fill out and return this JSON string {"symptoms": string, "duration": string, "sensation": string, "causes": string, "what-happened": string, "concerns": string, "when-does-it-hurt": string} \
              using only key medical information from a journal entry. Set values to null if not specified in journal entry: \
              Duration should be one of the following values (<1min, few minutes, <30 minutes, 1 hour, few hours, a day, few days, a week, > a week). 
              When-does-it-hurt should be one of the following values: (constant, occasional, once, movement, other triggers). \
              For example, "my shoulder hurts everytime I move" should be filled out as "movement" and "my head hurts when I smell perfume" should be filled as "other triggers".\
              Sensations should be a comma separated list, like "sharp, shooting, sore". Symptoms should be a comma separated list. \
              Concerns should be filled only when the text expresses some concern such as fear for a potential spinal injury. \
              Remember to return a JSON {symptoms, duration, sensation, causes, what-happened, concerns, when-does-it-hurt} and set values to null if their information is not specified in this journal entry:  ${journalText}`,
            },
          ],
          temperature: 0,
      });      

      const data = await response.data;
      console.log("✅ Response from AI:", data);

      let rawText: string = response.data.choices?.[0]?.message?.content || "";
      console.log("raw text: ", rawText);
    
      const obj = JSON.parse(rawText); 
      return obj;
    } catch (error) {
      console.error(`❌ Error extracting info (Attempts left: ${retryCount - 1}):`, error);
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
      let rawText: string = data.choices?.[0]?.message?.content.split("\n")[0].trim() || "";
      console.log(rawText);

      const keywords = rawText
        .split(",")
        .map((word) => word.trim().replace(/^"|"$/g, "").toLowerCase().replace(/\.$/, "")) // Remove quotes if present
        .filter(Boolean); // Remove empty strings

      return keywords;
    } catch (error) {
      console.error(`❌ Error extracting keywords (Attempts left: ${retryCount - 1}):`, error);
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


/**
 * extracts structured symptom summaries from a journal entry for export to a doctor.
 * @param {string} journalText User's journal entry
 * @returns {Promise<string[] | null>} Array of 3 symptom statements (or null if failed)
 */
// export const extractForExport = async (
//   journalText: string,
//   retryCount = 3,
//   delay = 2000
// ): Promise<string[] | null> => {
//   if (!journalText.trim()) return null;

//   console.log("🔹 Checking internet connection for export...");
//   const connection = await isConnected();
//   if (!connection) {
//     console.warn("⚠️ No internet connection for export. Aborting.");
//     return null;
//   }

//   console.log("🔹 Sending request to Together AI for doctor export...");

//   while (retryCount > 0) {
//     try {
//       const response = await fetch("https://api.together.xyz/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${TOGETHER_API_KEY}`,
//           "Content-Type": "application/json",
//           "Accept-Encoding": "gzip, deflate, br",
//         },
//         body: JSON.stringify({
//           model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//           messages: [
//             {
//               role: "system",
//               content: `
//                   You are a helpful assistant that extracts key symptoms from journal entries and reformats them into clear, structured statements for a doctor. 
//                   Provide exactly three concise summaries with:
//                   - When the symptom started (e.g., "three days ago," "since this morning").
//                   - How it has changed over time (e.g., worsening, stable, intermittent).
//                   - How severe it is and how it affects daily life (e.g., "severe fatigue, making it hard to focus").

//                   **Output Example:**
//                   "I started feeling a sore throat three days ago, and now it’s painful to swallow."
//                   "My fever spiked to 100.2°F last night and hasn’t gone down."
//                   "I’ve been feeling exhausted since this morning, making it hard to focus on work."

//                   **Rules:**
//                   - Do NOT include numbered lists, bullet points, or formatting symbols.
//                   - Keep the language natural and easy to understand.
//                   - Return only the three formatted symptom statements, nothing else.
//                   - Do NOT use bold formatting or markdown in your response.
//                 `,
//             },
//             {
//               role: "user",
//               content: `Journal entry: ${journalText}`,
//             },
//           ],
//           temperature: 0,
//         }),
//       });

//       if (!response.ok) {
//         console.error("❌ API Error - Status Code:", response.status);
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("✅ Raw Response from AI (Export):", data);

//       let rawText: string = data.choices?.[0]?.message?.content || "";
//       console.log("🔹 Raw Extracted Text (Export):", rawText);

//       if (!rawText.trim()) {
//         throw new Error("AI returned an empty export response.");
//       }

//       const summaries = rawText
//         .trim()
//         .split("\n")
//         .map((line) => line.trim())
//         .filter(Boolean);

//       if (summaries.length !== 3) {
//         console.warn("⚠️ Unexpected export format. Expected exactly 3 summaries.");
//         throw new Error("Unexpected symptom count.");
//       }

//       return summaries;
//     } catch (error) {
//       console.error(`❌ Export Extraction Failed (Attempts left: ${retryCount - 1}):`, error);

//       retryCount--;
//       if (retryCount === 0) {
//         console.warn("⚠️ Max retries reached. Returning empty array.");
//         return []; // Max retries reached, return empty array
//       }

//       console.warn(`⚠️ Retrying export extraction... ${retryCount} attempts left`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//       delay *= 2;
//     }
//   }

//   return null;
// };