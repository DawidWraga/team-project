/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				brand: '#FF9800',
				secondary: {
					light: 'hsl(210, 18%, 30%)',
					main: '	hsl(210, 18%, 20%)',
					dark: '	hsl(210, 18%, 15%)',
					contrast: '#fff',
				},
				pale: {
					light: 'hsl(204, 15%, 95%)',
					main: 'hsl(198, 16%, 90%)',
					dark: 'hsl(198, 16%, 84%)',
					contrast: '	hsl(210, 18%, 12%)',
				},
			},
		},
	},
	plugins: [
		function ({ addVariant }) {
			addVariant('child', '& > *');
			addVariant('child-hover', '& > *:hover');
			addVariant('child-button', '& > button');
		},
	],
};

