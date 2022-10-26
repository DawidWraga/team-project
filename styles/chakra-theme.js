// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react';

const config = {
	initialColorMode: 'light',
	useSystemColorMode: false,
};

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
	brand: {
		50: '#fff4da',
		100: '#ffe0ae',
		200: '#ffcc7d',
		300: '#ffb84b',
		400: '#ffa31a',
		500: '#e68a00',
		600: '#b36b00',
		700: '#814d00',
		800: '#4f2d00',
		900: '#1f0d00',
		main: '#ffa31a',
	},
	shade: {
		light: 'hsl(210, 18%, 30%)',
		main: '	hsl(210, 18%, 20%)',
		dark: '	hsl(210, 18%, 15%)',
		inv: '#fff',
	},
	pale: {
		light: 'hsl(204, 10%,99%)',
		main: 'hsl(204, 15%,93%)',
		dark: 'hsl(198, 15%, 83%)',
		inv: '#fff',
	},
	error: 'hsl(4,80%,58%)',
	success: 'hsl(87,50%,59%)',
};

export const theme = extendTheme({ colors, config });
