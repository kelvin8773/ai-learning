/**
 * Theme configuration for Chakra UI
 * Centralizes theme customization and color schemes
 */

import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  fonts: {
    heading: `Inter, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    body: `Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  },
  colors: {
    // Custom accent colors
    accent: {
      50: '#e6f3ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb3',
      700: '#004280',
      800: '#002a4d',
      900: '#00111a',
    },
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      variants: {
        solid: {
          borderRadius: 'md',
          fontWeight: 'medium',
        },
      },
    },
    Textarea: {
      defaultProps: {
        size: 'md',
      },
      variants: {
        outline: {
          borderRadius: 'md',
        },
      },
    },
    Box: {
      variants: {
        card: {
          bg: 'white',
          borderRadius: 'lg',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'gray.200',
        },
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.900',
      },
    }),
  },
});

// Color schemes for accent colors
export const accentColors = [
  'blue',
  'green',
  'purple',
  'orange',
  'red',
  'teal',
  'pink',
  'cyan',
  'gray',
] as const;

export type AccentColor = typeof accentColors[number];

