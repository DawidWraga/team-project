import { createIcon } from '@chakra-ui/icons';
import { Flex, Heading } from '@chakra-ui/react';

// using `path`
export const BrandLogoIcon = createIcon({
  displayName: 'logoIcon',
  viewBox: '0 0 421 473', // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: [
    <path
      d="M202.967 466.348L13.967 354.348V111.848L208.967 8.3483L238.467 28.3483L409.967 120.348C409.967 120.348 416.844 360.071 398.463 354.554C399.774 359.863 202.967 466.348 202.967 466.348Z"
      fill="#FFA31A"
      key={'logoa' + Date.now()}
    />,
    <path
      d="M399.122 102.354C412.426 110.035 420.622 124.231 420.622 139.594V332.793C420.622 348.156 412.426 362.352 399.121 370.033L231.81 466.625C218.506 474.305 202.116 474.305 188.812 466.625L21.5009 370.033C8.19615 362.352 0 348.156 0 332.793V139.594C0 124.231 8.19603 110.035 21.5006 102.354L188.813 5.76054C202.117 -1.92022 218.507 -1.92017 231.811 5.76064L399.122 102.354ZM380.964 359.544C394.268 351.863 402.464 337.668 402.464 322.305V150.079C402.464 134.717 394.268 120.521 380.964 112.84L231.812 26.7273C218.508 19.0461 202.116 19.0461 188.812 26.7272L39.6581 112.84C26.3538 120.522 18.158 134.717 18.158 150.079V322.305C18.158 337.668 26.3538 351.863 39.6581 359.544L188.811 445.657C202.115 453.339 218.507 453.339 231.811 445.657L380.964 359.544Z"
      fill="#FFA31A"
      key={'logob' + Date.now()}
    />,
    <path
      d="M347.401 314.789L246.584 213.976C242.806 210.197 237.204 209.44 232.638 211.61L222.624 201.593C226.641 196.676 226.414 189.46 221.827 184.879C216.941 179.989 209.021 179.989 204.138 184.879L189.156 199.854L129.76 140.467L129.799 140.425L131.329 138.895L119.77 119.033L91.4393 99.0018L89.9061 100.535L74.5319 115.912L73.0018 117.445L93.0298 145.779L112.895 157.329L114.425 155.805L114.461 155.763L173.854 215.159L158.876 230.141C153.989 235.021 153.986 242.938 158.876 247.83C163.46 252.414 170.679 252.641 175.59 248.624L185.61 258.641C183.44 263.204 184.197 268.809 187.976 272.587L288.792 373.401C293.588 378.196 301.366 378.196 306.161 373.401L347.404 332.158C352.199 327.366 352.199 319.588 347.401 314.789Z"
      fill="white"
      key={'logoc' + Date.now()}
    />,
    <path
      d="M152.37 261.227C146.861 259.39 140.975 258.381 134.845 258.381C104.306 258.381 79.5397 283.134 79.5397 313.684C79.5397 319.974 80.604 326.014 82.5394 331.649L120.013 294.175L155.376 329.538L118.402 366.514C123.597 368.131 129.119 368.993 134.847 369C165.395 369 190.154 344.234 190.154 313.69C190.154 306.162 188.65 298.992 185.922 292.448L267.63 210.773C273.136 212.61 279.025 213.619 285.153 213.619C315.692 213.619 340.46 188.862 340.46 158.314C340.46 152.024 339.396 145.986 337.461 140.352L299.987 177.825L264.622 142.46L301.598 105.486C296.403 103.871 290.881 103.002 285.153 103C254.605 103 229.846 127.762 229.846 158.307C229.846 165.835 231.35 173.006 234.079 179.547L152.37 261.227Z"
      fill="white"
      key={'logod' + Date.now()}
    />,
  ],
});

export const BrandLogoWithName = (props) => {
  return (
    <Flex
      {...props}
      gap="1"
      justifyContent={'center'}
      alignContent="center"
      alignItems={'center'}
    >
      <BrandLogoIcon fontSize={props.logoSize || '60px'} />
      <Heading
        textColor={props.headingColor || 'gray.700'}
        textDecoration={'underline'}
        textDecorationLine="underline"
        textDecorationColor={'brand.main'}
        size={props.headingSize || 'lg'}
      >
        Make-It-All
      </Heading>
    </Flex>
  );
};

{
  /* <BrandLogoIcon w/> */
}

// OR using the `d` value of a path (the path definition) directly
// export const UpDownIcon = createIcon({
// 	displayName: 'UpDownIcon',
// 	viewBox: '0 0 200 200',
// 	d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
// });
