import NetInfo from "@react-native-community/netinfo";
import { TOGETHER_API_KEY } from "@env";

/* helps make sure api does not lose connection before request call */
const isConnected = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

/**
 * extracts keywords from a journal entry using llm (flow will be react -> llm -> react).
 * view "write log flow" for more clarity.
 * @param {string} journalText user's journal entry
 * @returns {Promise<string[]>} extracted keywords
 */
export const extractKeywords = async (
  journalText: string,
): Promise<string[]> => {
  if (!journalText.trim()) return [];

  console.log("🔹 Checking internet connection...");
  const connection = await isConnected();
  if (!connection) {
    console.warn("⚠️ No internet connection. Retrying...");
    return [];
  }

  console.log("🔹 Sending request to Together AI...");

  if (typeof console.time === "function") console.time("Together AI Request Time");

  try {
    const response = await fetch(
      "https://api.together.ai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br", 
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1", 
          messages: [
            { role: "system", content: "Extract symptoms from the journal entry. Respond with only a comma-separated list of symptoms. Do NOT include explanations, formatting, or extra words."},
            { role: "user", content: `Journal entry: ${journalText}` },
          ],
        }),
      });

    if (typeof console.timeEnd === "function") console.timeEnd("Together AI Request Time");

    if (!response.ok) {
      console.error("❌ API Error - Status Code:", response.status);
      if (response.status === 429) {
        console.warn("⚠️ Rate limit exceeded. Retrying after delay...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        return extractKeywords(journalText);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Response from AI:", data);

    // extract keywords response
    let rawText: string = data.choices?.[0]?.message?.content.trim() || "";
    console.log(rawText);

    const keywords = rawText
      .split(",")
      .map((word) => word.trim().replace(/^"|"$/g, "").toLowerCase().replace(/\.$/, "")) // Remove quotes if present
      .filter(Boolean); // Remove empty strings
    return keywords;
  } catch (error: any) {
    if (typeof console.timeEnd === "function") console.timeEnd("Together AI Request Time");
    console.error(
      "❌ Error extracting keywords:",
      error.response?.data || error.message
    );
    return [];
  }
};
