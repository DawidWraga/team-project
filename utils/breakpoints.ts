import { objectMap } from 'utils/objectMap';

export const screenIsSm = () =>
  global?.window && window.matchMedia('(max-width: 480px)').matches;

const labelToPixelScreenWidth = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1280,
  '2xl': 1536,
};

export const breakpoints: Record<
  keyof typeof labelToPixelScreenWidth,
  (dir?: 'above' | 'below') => boolean
> = objectMap(labelToPixelScreenWidth, (breakpoint) => {
  return (dir: 'above' | 'below' = 'above') =>
    global?.window && // prevent SSR errors
    window.matchMedia(
      `(${
        //map dir arg to media query
        { above: 'min', below: 'max' }[dir]
      }-width: ${breakpoint}px)`
    ).matches;
}) as any;
