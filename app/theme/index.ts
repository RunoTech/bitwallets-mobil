import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';

const colors = {
  primary: '#FF6500',
  onPrimary: '#FFFFFF',
  primaryContainer: '#331A00',
  onPrimaryContainer: '#FFDCC2',
  
  secondary: '#7C3AED',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#2D1066',
  onSecondaryContainer: '#E9DDFF',
  
  tertiary: '#EC4899',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#4A0B2A',
  onTertiaryContainer: '#FFD9E7',
  
  error: '#DC2626',
  onError: '#FFFFFF',
  errorContainer: '#4A0B0B',
  onErrorContainer: '#FFD9D9',
  
  background: '#252525',
  onBackground: '#FFFFFF',
  surface: '#1F1F1F',
  onSurface: '#FFFFFF',
  surfaceVariant: '#2D2D2D',
  onSurfaceVariant: '#E0E0E0',
  
  outline: '#666666',
  outlineVariant: '#404040',
  
  scrim: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.7)',
  
  elevation: {
    level0: 'transparent',
    level1: '#2D2D2D',
    level2: '#333333',
    level3: '#383838',
    level4: '#3D3D3D',
    level5: '#424242',
  },
};

const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  materialDark: MD3DarkTheme,
});

const theme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...colors,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    labelLarge: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '500' as '500',
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    labelMedium: {
      fontFamily: 'System',
      fontSize: 12,
      fontWeight: '500' as '500',
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelSmall: {
      fontFamily: 'System',
      fontSize: 11,
      fontWeight: '500' as '500',
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    bodyLarge: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '400' as '400',
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '400' as '400',
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: 'System',
      fontSize: 12,
      fontWeight: '400' as '400',
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    titleLarge: {
      fontFamily: 'System',
      fontSize: 22,
      fontWeight: '400' as '400',
      letterSpacing: 0,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '500' as '500',
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleSmall: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '500' as '500',
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    headlineLarge: {
      fontFamily: 'System',
      fontSize: 32,
      fontWeight: '400' as '400',
      letterSpacing: 0,
      lineHeight: 40,
    },
    headlineMedium: {
      fontFamily: 'System',
      fontSize: 28,
      fontWeight: '400' as '400',
      letterSpacing: 0,
      lineHeight: 36,
    },
    headlineSmall: {
      fontFamily: 'System',
      fontSize: 24,
      fontWeight: '400' as '400',
      letterSpacing: 0,
      lineHeight: 32,
    },
  },
};

export { theme };
export default theme; 