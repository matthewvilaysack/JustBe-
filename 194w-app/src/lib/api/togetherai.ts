import axios from "axios";
import { TOGETHER_API_KEY } from "@env"; 

/**
 * extracts keywords from a journal entry using llm (flow will be react -> llm -> react).
 * view "write log flow" for more clarity.
 * @param {string} journalText user's journal entry
 * @returns {Promise<string[]>} extracted keywords
 */
export const extractKeywords = async (journalText: string): Promise<string[]> => {
  if (!journalText.trim()) return [];

  console.log("🔹 Sending request to Together AI...");

  try {
    const response = await axios.post(
      "https://api.together.ai/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          { role: "system", content: "Extract only the key symptoms from a journal entry and return them as a comma-separated list." },
          { role: "user", content: `Extract key symptoms from this journal entry: ${journalText}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Response from AI:", response.data);


    // extract keywords response
    let rawText: string = response.data.choices?.[0]?.message?.content || "";
    console.log(rawText);

    const keywords = rawText.split(",").map((word) => word.trim()).filter(Boolean); // Split and clean
    return keywords;
  } catch (error: any) {
    console.error("❌ Error extracting keywords:", error.response?.data || error.message);
    return [];
  }
};
