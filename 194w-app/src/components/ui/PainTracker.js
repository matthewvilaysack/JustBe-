import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/src/theme/theme';
import { statusBarHeight } from './Constants';

const windowWidth = Dimensions.get('window').width;

export default function PainTracker({ painType }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#85ABE0', '#5671DA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{painType || 'Pain Type'}</Text>
      </LinearGradient>
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
    borderRadius: 25,
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  text: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}); 