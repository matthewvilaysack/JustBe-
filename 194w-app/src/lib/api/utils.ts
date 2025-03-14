/**
 * @file utils.ts
 * @description Utility functions for interacting with the Supabase API
 * and Zustand
 */

import { supabase } from "./supabase";
import { useUserPainStore } from "@/src/store/userPainStore";

// Get today's most recent pain entry
export const getTodayLatestPainEntry = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('journal_entries')
    .select('pain_rating')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('❌ Failed to fetch latest pain entry:', error.message);
    return null;
  }

  return data?.pain_rating || null;
};

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
