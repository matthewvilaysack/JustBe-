import { supabase } from "../../src/lib/api/supabase";

/**
 * Fetches the user id for current user
 * @returns {user id} from Supabase
 */
async function getUserID() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("getUser failed");
  }
  return user.id;
}

/**
 * Fetches the current user's profile, including pain_type.
 * @returns {Promise<Object|null>} User profile or null if error
 */
export async function fetchUserProfile() {
  const userId = await getUserID();
  if (!userId) {
    console.error("No user ID found. Cannot fetch user profile.");
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("pain_type, pain_duration")
    .eq("id", userId)
    .single(); // Assuming there's only one profile per user

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

/**
 * Called everytime a new entry is made
 * Increment the counts of keys (ex nausea) in multiple JSON columns (ex symptoms)
 * @param {Object} updates - JSON data to update table with. ex {duration: "sdjak", sensation: "a,b,c", etc}
 * @param {Object} entry - The JSON data to insert
 */
async function incrementValues(updates) {
  // Fetch data for the user
  const { data, error } = await supabase
    .from("count_data")
    .select("*")
    .single(); // Get single user record
  if (error) {
    console.error("Error fetching data for incrementValues:", error);
    return;
  }

  const userId = await getUserID();

  for (let column in updates) {
    const keys = String(updates[column]);

    if (
      keys === null ||
      keys === "null" ||
      keys === "none specified" ||
      column == "entry_text" ||
      column == "causes"
    )
      continue;

    if (column == "what-happened") column = "context";
    const keysArray = keys.split(",").map((item) => item.trim());
    for (const i in keysArray) {
      jsonData[keysArray[i]] = (jsonData[keysArray[i]] || 0) + 1; // ++
    }
    const { error: updateError } = await supabase
      .from("count_data")
      .update({ [column]: jsonData })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating data:", updateError);
    }
  }
}

/**
 * Adds new detailed entry to Supabase
 * @param {Object} detailed_entry - JSON data to insert
 */
export const addNewDetailedEntry = async (detailed_entry) => {
  const response = await supabase
    .from("detailed_entries")
    .insert([detailed_entry])
    .select();
  await incrementValues(detailed_entry);
  return response;
};

/**
 * Fetches all detailed entries for the current logged-in user
 * @returns {Promise<Array>} Array of detailed entries
 */
export async function fetchDetailedEntriesForUser() {
  const userId = await getUserID();

  if (!userId) {
    console.error("No user ID found. Cannot fetch detailed entries.");
    return [];
  }

  const { data, error } = await supabase
    .from("detailed_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching detailed entries:", error);
    return [];
  }

  return data;
}

/**
 * Will format entries of a user for ai prompting
 * @param {string} entries - all entries for a user
 * @returns The ai prompt from Supabase
 */
export function formatEntriesForAI(entries) {
  const combinedText = entries
    .map((entry) => {
      const parts = [
        entry.symptoms ? `Symptoms: ${entry.symptoms}` : null,
        entry.duration ? `Duration: ${entry.duration}` : null,
        entry.sensation ? `Sensation: ${entry.sensation}` : null,
        entry.causes ? `Causes: ${entry.causes}` : null,
        entry["what-happened"]
          ? `What happened: ${entry["what-happened"]}`
          : null,
        entry.concerns ? `Concerns: ${entry.concerns}` : null,
        entry["when-does-it-hurt"]
          ? `When does it hurt: ${entry["when-does-it-hurt"]}`
          : null,
      ];

      // Join parts of a single entry and remove empty/null lines
      return parts.filter(Boolean).join("\n");
    })
    .join("\n\n---\n\n");

  // Clean up excess whitespace and multiple dividers
  return combinedText
    .replace(/[\t ]+/g, " ") // Collapse multiple spaces
    .replace(/\n{3,}/g, "\n\n") // Collapse 3+ newlines into 2
    .replace(/(\n---\n){2,}/g, "\n---\n") // Collapse repeated dividers into 1
    .replace(/(^---\n|\n---$)/g, "") // Remove leading or trailing dividers
    .trim(); // Trim final leading/trailing whitespace
}

/**
 * Adds a row to a Supabase table
 * @param {string} tableName - The name of the table
 * @param {Object} entry - The JSON data to insert
 * @returns {Promise<Object>} - The response from Supabase
 */
// export const addRowToSupabase = async (tableName, entry) => {
//   try {
//     const { data: insertedData, error } = await supabase.from(tableName).insert([entry]).select();
//     if (error) throw error;

//     return insertedData;
//   } catch (error) {
//     console.error("Error inserting data:", error.message);
//     return { error: error.message };
//   }
// };

/**
 * Fetches data of highest pain rating per day
 * @returns {Promise<Object>} JSON table data
 */
export async function getHighestPainRatingPerDay() {
  const userId = await getUserID();
  const { data, error } = await supabase.rpc(
    "get_highest_pain_rating_per_day",
    { user_id_param: userId }
  );

  if (error) {
    console.error(
      "Error fetching data from get_highest_pain_rating_per_day:",
      error
    );
    return [];
  }
  return data;
}

/**
 * Fetches countData
 * @returns {Promise<Object>} JSON table data
 */
export async function fetchCountData() {
  const { data, error } = await supabase
    .from("count_data")
    .select("*")
    .single();
  if (error) {
    console.error("Error fetching data from count_data:", error);
    return error;
  }
  return data;
}
