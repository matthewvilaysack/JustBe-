import axios from "axios";
import { TOGETHER_API_KEY } from "@env";

/**
 * extracts keywords from a journal entry using llm (flow will be react -> llm -> react).
 * view "write log flow" for more clarity.
 * @param {string} journalText user's journal entry
 * @returns {Promise<string[]>} extracted keywords
 */
export const extractKeywords = async (
  journalText: string
): Promise<string[]> => {
  if (!journalText.trim()) return [];

  console.log("🔹 Sending request to Together AI...");

  try {
    const response = await axios.post(
      "https://api.together.ai/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content:
              "Extract only the key symptoms from a journal entry and return them as a comma-separated list.",
          },
          {
            role: "user",
            content: `Extract key symptoms from this journal entry: ${journalText}`,
          },
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

    const keywords = rawText
      .split(",")
      .map((word) => word.trim().replace(/^"|"$/g, "")) // Remove quotes if present
      .filter(Boolean); // Remove empty strings
    return keywords;
  } catch (error: any) {
    console.error(
      "❌ Error extracting keywords:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const extractExport = async (journalText: string): Promise<string[]> => {
  if (!journalText.trim()) return [];

  console.log("🔹 Sending request to Together AI...");

  try {
    const response = await axios.post(
      "https://api.together.ai/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that extracts key symptoms from journal entries and reformats them into clear, structured statements for a doctor. Provide three concise summaries with:
            - When the symptom started (e.g., "three days ago," "since this morning").
            - How it has changed over time (e.g., worsening, stable, intermittent).
            - How severe it is and how it affects daily life (e.g., "severe fatigue, making it hard to focus").
          
            **Output Example:**
              "I started feeling a sore throat three days ago, and now it’s painful to swallow."
              "My fever spiked to 100.2°F last night and hasn’t gone down."
              "I’ve been feeling exhausted since this morning, making it hard to focus on work."

          **Rules:**
            - Do **not** include numbered list, bullet points, or formatting symbols.
            - Keep the language **natural and easy to understand**.
            - Return only the three formatted symptom statements, **nothing else**.
            - Do not use bold formatting (**) in your response.`,
          },
          {
            role: "user",
            content: `Extract and structure the symptoms from this journal entry: \n\n"${journalText}"`,
          },
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
    return rawText.split("\n").filter(Boolean);
  } catch (error: any) {
    console.error(
      "❌ Error extracting keywords:",
      error.response?.data || error.message
    );
    return [];
  }
};
