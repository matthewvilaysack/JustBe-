import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Theme from '@/src/theme/theme';
import Arrow from './icons/Arrow';

// Define constants at the top
const BUTTON_WIDTH = 185;
const BUTTON_HEIGHT = 72.08; // 144.16/2
const ARROW_WIDTH = 38.8;

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', // primary or secondary
  disabled = false,
  showArrow = false,
  style,
}) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'secondary' && styles.buttonSecondary,
          disabled && styles.buttonDisabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[
          styles.text,
          variant === 'secondary' && styles.textSecondary,
          disabled && styles.textDisabled,
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
      {showArrow && (
        <Arrow 
          style={styles.arrow}
          color={Theme.colors.button.primary.border}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.button,
  },
  buttonSecondary: {
    backgroundColor: Theme.colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: Theme.colors.text.primary,
    fontSize: Theme.typography.sizes.xl,
    fontFamily: Theme.typography.fonts.regular,
    lineHeight: 30,
  },
  textSecondary: {
    color: Theme.colors.button.primary.text,
  },
  textDisabled: {
    opacity: 0.5,
  },
  arrow: {
    position: 'absolute',
    right: -ARROW_WIDTH - Theme.spacing.sm,
    top: BUTTON_HEIGHT/2 - 2.5,
  },
}); 