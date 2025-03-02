/**
 * @file utils.ts
 * @description Utility functions for interacting with the Supabase API
 */

import { supabase } from "./supabase";

// Update user profile in supabase
export const updateUserProfile = async (userId: string, updates: { pain_type: string, pain_duration: string }) => {
  console.log('🔵 Attempting profile update for user:', userId);
  console.log('🔵 Update data:', updates);

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select();
  if (error) {
    console.error('❌ Profile update failed:', error.message);
  } else {
    console.log('✅ Profile updated successfully:', data);
  }
  return { error };
};
