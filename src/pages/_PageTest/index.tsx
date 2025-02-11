import React from 'react';

import Map from '../../components/Map';

const PageTest: React.FC = () => {
  return <Map center={{ lat: -12.9704, lng: -38.5124 }} 
  zoom={13} 
  markers={[]}/>;
};

export default PageTest;
