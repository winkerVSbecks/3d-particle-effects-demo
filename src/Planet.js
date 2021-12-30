import React from 'react';
import { TextureLoader } from 'three';

const loader = new TextureLoader();
const matcap = loader.load('wax_red.jpg');

export const Planet = () => {
  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[12, 32, 32]} />
      <meshMatcapMaterial matcap={matcap} />
    </mesh>
  );
};
