// 1. Import the extendTheme function
import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
import '@fontsource/roboto';
// import '@fontsource/open-sans';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
};

// const breakpoints = {
// base: ABOVE 0px
// sm: ABOVE 480px
// md: ABOVE 768px ,
// lg: ABOVE 992px ,
// xl: ABOVE 1280px ,
// '2xl': ABOVE 1536px ,
// }

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    50: 'hsl(37, 100%, 93%)',
    100: 'hsl(33, 100%, 84%)',
    200: 'hsl(35, 100%, 75%)',
    300: 'hsl(36, 100%, 65%)',
    400: 'hsl(32, 100%, 60%)',
    500: 'hsl(32, 100%, 53%)',
    600: 'hsl(28, 96%, 48%)',
    700: 'hsl(26, 100%, 42%)',
    800: 'hsl(22, 100%, 35%)',
    900: 'hsl(18, 100%, 30%)',
    main: 'hsl(36, 100%, 55%)',
  },
  shade: {
    min: 'hsl(210, 18%, 32%)',
    light: 'hsl(210, 18%, 26%)',
    main: '	hsl(210, 18%, 20%)',
    dark: '	hsl(210, 18%, 15%)',
    max: '	hsl(210, 18%, 10%)',
    inv: 'hsl(0, 0%, 100%)',
  },
  pale: {
    light: 'hsl(204, 10%,99%)',
    // main: 'hsl(204, 15%,93%)',
    main: 'hsl(198, 16%, 90%)',
    dark: 'hsl(198, 15%, 83%)',
    inv: 'hsl(0, 0%, 100%)',
  },
  error: 'hsl(4,80%,58%)',
  success: 'hsl(87,50%,49%)',
};

const Paper = defineStyleConfig({
  // The styles all Cards have in common
  baseStyle: {
    display: 'flex',
    backgroundColor: 'white',
  },
  // Two variants: rounded and smooth
  variants: {
    elevated: {
      borderRadius: 'md',
      boxShadow: 'lg',
    },
    smooth: {
      borderRadius: 'sm',
      boxShadow: 'sm',
    },
  },
  // The default variant value
  defaultProps: {
    variant: 'smooth',
  },
});

export const theme = extendTheme({
  colors,
  config,
  fonts,
  components: { Paper },
});
