import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../../src/lib/api/supabase';
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = "https://pjzgrltejhuodohksobs.supabase.co";
// const supabaseAnonKey =
//  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqemdybHRlamh1b2RvaGtzb2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0ODExMjQsImV4cCI6MjA1NDA1NzEyNH0.dZiemGp7D3fd-UOzciGxH-lKHeHQ7OqddWIOrjhGHJY";

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FetchSupabaseData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        
    // const fetchData = async () => {
    //   const { data: journal_entries, err } = await supabase.from('journal_entries').select('*')
    //   if (err) {
    //     text = "err";
    //     setData(null);
    //     console.log("error") 
    //     console.error('Error fetching data:', err);
    //   } else {
    //     console.log("getting data");
    //     setData(journal_entries);
    //     setError(null);
    //   }
    //   setLoading(false);
    // };
    console.log("your mom");
    const fetchData = async () => {
      const { data, error } = await supabase.from('fruit').insert([
        { name: 'someValue', color: 'otherValue' },
      ])
      .select()
      console.log("done");
    };
        

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log('Fetching data from Supabase...');
  //     try {
  //       const { data, err } = await supabase.from('journal_entries').select('*');
  //       if (err) {
  //         console.error('Supabase error:', err);
  //       } else {
  //         console.log('Data received:', data);
  //         setData(data);
  //       }
  //     } catch (e) {
  //       console.error('Fetch error:', e);
  //     }
  //     setLoading(false);
  //   };
  
  //   fetchData();
  // }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{JSON.stringify(item)}</Text>
        </View>
      )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FetchSupabaseData;
