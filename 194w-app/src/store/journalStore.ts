// journalStore.ts
// This file contains the store for the journal logs to be stored in the user's device cache.
// Essentially, it retrieves all the detailed_entries coming from the current user's id and using zustand's middleware,
// it caches them in the user's device cache (localStorage)
// code by @matthewvilaysack
import { create } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
import { supabase } from '../lib/api/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JournalLog {
  id: number;
  user_id: string;
  created_at: string;
  entry_text: string;
  pain_rating: number;
  causes: string | null;
  concerns: string | null;
  duration: string | null;
  sensation: string | null;
  symptoms: string | null;
  "what-happened": string | null;
  "when-does-it-hurt": string | null;
}

interface JournalState {
  journalLogs: { [date: string]: JournalLog[] };
  isLoading: boolean;
  error: null | Error;
  getJournalLogs: () => Promise<JournalLog[]>;
  getLogsByDate: (date: string) => JournalLog[];
  clearLogs: () => void;
  addJournalLog: (log: JournalLog) => void;
}

type JournalStorePersist = {
  journalLogs: { [date: string]: JournalLog[] };
  isLoading: boolean;
};

// Custom async storage using Zustand
const customStorage = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error: any) {
      console.warn(`Error reading from storage: ${error.message}`);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error: any) {
      console.warn(`Error writing to storage: ${error.message}`);
    }
  },
  removeItem: async (name: string) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error: any) {
      console.warn(`Error removing from storage: ${error.message}`);
    }
  },
};


const persistConfig: PersistOptions<JournalState, JournalStorePersist> = {
  name: 'journal-storage',
  storage: createJSONStorage(() => customStorage),
  partialize: (state) => ({
    journalLogs: state.journalLogs,
    isLoading: state.isLoading
  }),
};

const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      journalLogs: {},
      isLoading: false,
      error: null,

      // Get the logs by date, used for the history page
      getLogsByDate: (date: string) => {
        const state = get();
        return state.journalLogs[date] || [];
      },

      // Add a new log entry 
      addJournalLog: (log: JournalLog) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        set((state) => ({
          journalLogs: {
            ...state.journalLogs,
            [date]: [log, ...(state.journalLogs[date] || [])],
          },
        }));
      },

      // Get all journal logs from supabase
      getJournalLogs: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            set({ isLoading: false });
            return [];
          }
          
          const { data, error } = await supabase
            .from('detailed_entries')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Transform array into date-indexed object
          // this is used to display the logs in the history page storing each journal log by date
          // in a dictionary, the key is the date and the value is an array of logs for that date
          const logsByDate = (data || []).reduce((journalLogs: { [key: string]: JournalLog[] }, log) => {
            const date = new Date(log.created_at).toISOString().split('T')[0];
            if (!journalLogs[date]) {
              journalLogs[date] = [];
            }
            journalLogs[date].push(log);
            return journalLogs;
          }, {});

          set({ 
            journalLogs: logsByDate, 
            isLoading: false 
          });
          return data || [];
        } catch (err) {
          console.error('Error fetching journal logs:', err);
          set({ 
            isLoading: false,
            error: err as Error
          });
          return [];
        }
      },

      clearLogs: () => {
        set({ isLoading: false, journalLogs: {} });
      },
    }),
    persistConfig
  )
);

export default useJournalStore;