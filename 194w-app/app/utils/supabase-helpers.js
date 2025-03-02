import { supabase } from '../../src/lib/api/supabase';

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
    // Get logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
      
    if (authError || !user) {
      console.error("getUser failed");
    }
    const userId = user.id;

    console.log("increment Values: ",updates);
    // Loop through updates and modify the relevant column
    for (const column in updates) {
        console.log("column ", column, " key ", updates[column]);
        const keys = updates[column];
        if (keys == null || column == "entry_text" || column == "what-happened") continue;        
        // parse comma separated string key into array. e.g 'leg pain, headache' -> [leg pain, headache]
        
        let jsonData = data[column] || {}; 
        console.log("jsonData ", jsonData);
        const keysArray = updates[column].split(",").map(item => item.trim());
        console.log("keysArray: ", keysArray);
        for (const key in keysArray) {
          jsonData[keys] = (jsonData[keys] || 0) + 1; // ++
          console.log("keys i: ", keys);
        }
        console.log("jsonData ", jsonData);
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

// Usage Example: Increment values in multiple columns
// const userId = "user-123"; // Replace with actual user ID
// const updates = [
//     { column: "causes", key: "stress" }, // Increment "stress" in causes
//     { column: "causes", key: "fatigue" }, // Increment "fatigue" in causes
//     { column: "symptoms", key: "headache" }, // Increment "headache" in symptoms
//     { column: "symptoms", key: "nausea" } // Increment "nausea" in symptoms
// ];
// incrementValues(userId, updates);
// updates detailed_entries

export const addNewDetailedEntry = async (detailed_entry) => {
  let response;
  const insertData = async () => {
    
    response = await addRowToSupabase("detailed_entries", detailed_entry);
    console.log("add new detailed entry response: " , response);
  };
  insertData();
  incrementValues(detailed_entry);
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
