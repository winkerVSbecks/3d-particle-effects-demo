import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';

const radiusVariance = () => Random.range(0.2, 1);

function FatLine({ curve, width, color, speed, animate, dash }) {
  const material = useRef();

  useFrame(() => {
    if (animate) {
      material.current.uniforms.dashOffset.value -= speed;
    }
  });

  return (
    <mesh>
      <meshLine attach="geometry" points={curve} />
      <meshLineMaterial
        attach="material"
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={dash ? 0.1 : undefined}
        dashRatio={dash ? 0.95 : undefined}
      />
    </mesh>
  );
}

export function Sparks({ count, colors, radius = 10, animate, dash }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        const pos = new THREE.Vector3(
          Math.sin(0) * radius * radiusVariance(),
          Math.cos(0) * radius * radiusVariance(),
          Math.sin(0) * Math.cos(0) * radius * radiusVariance()
        );
        const points = new Array(30).fill().map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;

          return pos
            .add(
              new THREE.Vector3(
                Math.sin(angle) * radius * radiusVariance(),
                Math.cos(angle) * radius * radiusVariance(),
                Math.sin(angle) * Math.cos(angle) * radius * radiusVariance()
              )
            )
            .clone();
        });
        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000);
        return {
          color: colors[parseInt(colors.length * Math.random(), 10)],
          width: Math.max(0.1, (0.2 * index) / 10),
          speed: Math.max(0.001, 0.004 * Math.random()),
          curve,
        };
      }),
    [count, colors, radius]
  );

  return (
    <group position={[-radius * 2, -radius, -10]} scale={[1, 1.3, 1]}>
      {lines.map((props, index) => (
        <FatLine key={index} animate={animate} dash={dash} {...props} />
      ))}
    </group>
  );
}
