import { supabase } from '../../src/lib/api/supabase';

async function getUserID() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
      
  if (authError || !user) {
    console.error("getUser failed");
  }
  return user.id;
}

// Called everytime a new entry is made
// Function to increment the counts of keys (ex nausea) in multiple JSON columns (ex symptoms)
// Takes in Updates, a JSON object, ex {duration: "sdjak", sensation: "a,b,c", etc}
async function incrementValues(updates) {
    // Fetch data for the user
    const { data, error } = await supabase
        .from('count_data').select('*').single();  // Get single user record
    if (error) {
        console.error("Error fetching data for incrementValues:", error);
        return;
    }

    const userId = await getUserID();

    // console.log("Function: Increment Values. Updates: ", updates);
    // Loop through updates and modify the relevant column
    for (const column in updates) {
        const keys = String(updates[column]);

        if (keys === null || column == "entry_text" || column == "what-happened") continue;   

        // console.log("Column: ", column, " Keys: ", keys);
        const jsonData = data[column] || {};  

        // parse comma separated string key into array. e.g 'leg pain, headache' -> [leg pain, headache]
        const keysArray = keys.split(",").map(item => item.trim());
        // console.log("keysarray ", keysArray);
        for (const i in keysArray) {
          jsonData[keysArray[i]] = (jsonData[keysArray[i]] || 0) + 1; // ++
          // console.log("key ", keysArray[i]);
        }
        // console.log("jsondata", jsonData);
        // Update the modified JSON objects in Supabase // not super efficient
        const { error: updateError } = await supabase
          .from("count_data")
          .update({ [column]: jsonData }) 
          .eq("user_id", userId); 

        if (updateError) {
          console.error("Error updating data:", updateError);
        } else {
            console.log(`Successfully updated values for user ${userId}`);
        }
    }
}

export const addNewDetailedEntry = async (detailed_entry) => {
  const response = await supabase.from("detailed_entries").insert([detailed_entry]).select();
  await incrementValues(detailed_entry);
  return response;
};

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

export async function getHighestPainRatingPerDay() {
  const userId = await getUserID();
  const { data, error } = await supabase
      .rpc('get_highest_pain_rating_per_day', { user_id_param: userId });

  if (error) {
      console.error("Error fetching data from get_highest_pain_rating_per_day:", error);
      return [];
  }

  console.log("get_highest_pain_rating_per_day data: ", data);
  return data;
}
