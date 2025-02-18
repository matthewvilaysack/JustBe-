import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../../src/lib/api/supabase';

const FetchSupabaseData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        
    const fetchData = async () => {
      const { data: journal_entries, err } = await supabase.from('journal_entries').select('*')
      if (err) {
        text = "err";
        setData(null);
        console.log("error") 
        console.error('Error fetching data:', err);
      } else {
        console.log("getting data");
        setData(journal_entries);
        setError(null);
      }
      setLoading(false);
    };        

    fetchData();
  }, []);

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
