import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  View 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/src/theme/theme';

interface SelectionButtonProps {
  title: string;
  onPress: () => void;
  selected?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function SelectionButton({ 
  title, 
  onPress, 
  selected, 
  style,
  textStyle 
}: SelectionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonContainer, style]}
    >
      {selected ? (
        <View style={[styles.gradient, styles.selected]}>
          <Text style={[styles.text, { color: theme.colors.primary[400] }]}>
            {title}
          </Text>
        </View>
      ) : (
        <LinearGradient
          colors={['#A2D0E4', '#748BE6', '#9997E1']}
          locations={[0.115, 0.52, 0.585]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.text}>
            {title}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: '#344A66',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  selected: {
    backgroundColor: theme.colors.white,
  },
  text: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '400',
  },
}); 