/**
 * @file utils.ts
 * @description Utility functions for interacting with the Supabase API
 * and Zustand
 */

import { supabase } from "./supabase";
import { useUserPainStore } from "@/src/store/userPainStore";


// Update user profile in supabase
export const updateUserProfile = async (userId: string, updates: { pain_type: string, pain_duration: string }) => {
  const { setPainType, setPainDuration } = useUserPainStore.getState();
  console.log('🔵 Attempting profile update for user:', userId);
  console.log('🔵 Update data:', updates);

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select();
  if (error) {
    console.error('❌ Profile update failed:', error.message);
  } else {
    setPainType(updates.pain_type);
    setPainDuration(updates.pain_duration);
    console.log('✅ Profile updated successfully:', data);
  }
  return { error };
};
