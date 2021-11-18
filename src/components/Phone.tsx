import {Svg,Path} from 'react-native-svg';
import React from 'react';

const Phone = () => {
  return <Svg
    width="36"
    height="36"
    stroke="white"
    fill="white"
    strokeWidth="1"
    style={{transform: [{rotate: '90deg'}]}}
    viewBox="0 0 42 42"
  >
    <Path d="M15.562,20.766c-1.328-1.922-2.118-4.241-2.281-4.438c1.945-1.356,5.749-3.06,5.962-5.505
	C19.514,7.664,14.162,1.06,13.136,1C10.328,1.03,5.189,5.782,4.58,7.218c-1.132,2.969-0.571,5.732,1.375,9.732
	c2.478,5.95,11.682,17.237,16.947,20.78c3.484,2.674,6.029,3.724,9.068,3.09c1.413-0.268,6.516-4.455,7.027-7.286
	c0.125-1.05-5.807-8.011-8.875-8.287c-2.382-0.22-4.666,3.346-6.303,5.089c-0.163-0.208-1.559-1.297-3.057-3.021
	C18.812,25.266,17,22.859,15.562,20.766z"/>
  </Svg>
}
export default Phone;