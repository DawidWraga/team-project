export const isMobile = () =>
	global?.window && window.matchMedia('(max-width: 992px)').matches;
export const isDesktop = () => window.matchMedia('(min-width: 992px)').matches;
