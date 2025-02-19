import Auth from '@/app/components/Auth';
import { ImageBackground } from 'react-native';

export default function AuthScreen() {
  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Auth />
    </ImageBackground>
  );
} 