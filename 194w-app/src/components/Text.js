import { Text as RNText } from 'react-native';
import Theme from '@/src/theme/theme';

export default function Text({ style, children, bold, ...props }) {
  return (
    <RNText 
      style={[
        { 
          fontFamily: bold ? Theme.typography.fonts.bold : Theme.typography.fonts.regular,
          color: Theme.colors.text.primary,
        },
        style,
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
} 