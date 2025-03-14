import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Theme from '@/src/theme/theme';
import { statusBarHeight } from './Constants';

const windowWidth = Dimensions.get('window').width;

export default function PainTracker({ painType }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{painType || 'Pain Type'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 189,
    height: 49,
    top: statusBarHeight + (Platform.OS === 'ios' ? 44 : 20), // Adjusted for status bar + safe area
    left: (windowWidth - 189) / 2, // Centers horizontally
    backgroundColor: Theme.colors.white,
    borderRadius: 20,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.darkBlue,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 