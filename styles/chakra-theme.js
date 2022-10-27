// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react';

const config = {
	initialColorMode: 'light',
	useSystemColorMode: false,
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
		light: 'hsl(210, 18%, 30%)',
		main: '	hsl(210, 18%, 20%)',
		dark: '	hsl(210, 18%, 15%)',
		inv: 'hsl(0, 0%, 100%)',
	},
	pale: {
		light: 'hsl(204, 10%,99%)',
		main: 'hsl(204, 15%,93%)',
		dark: 'hsl(198, 15%, 83%)',
		inv: 'hsl(0, 0%, 100%)',
	},
	error: 'hsl(4,80%,58%)',
	success: 'hsl(87,50%,59%)',
};

export const theme = extendTheme({ colors, config });
