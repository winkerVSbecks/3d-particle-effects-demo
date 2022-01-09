import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import {
  createAttractor,
  updateAttractor,
  dadrasAttractor,
  aizawaAttractor,
  arneodoAttractor,
  dequanAttractor,
  lorenzAttractor,
  lorenzMod2Attractor,
} from './attractor';

const simulation = () =>
  Random.pick([
    dadrasAttractor,
    aizawaAttractor,
    arneodoAttractor,
    dequanAttractor,
    lorenzAttractor,
    lorenzMod2Attractor,
  ]);

function StormLine({ radius, simulation, width, color }) {
  const line = useRef();

  useFrame(() => {
    if (line.current) {
      const nextPosition = updateAttractor(
        currentPosition,
        radius,
        simulation,
        0.005
      );

      line.current.advance(nextPosition);
    }
  });

  const [positions, currentPosition] = useMemo(() => createAttractor(5), []);

  return (
    <mesh>
      <meshLine ref={line} attach="geometry" points={positions} />
      <meshLineMaterial transparent lineWidth={width} color={color} />
    </mesh>
  );
}

export function SparkStorm({ count, colors, radius = 10 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        return {
          color: Random.pick(colors),
          width: Random.range(0.1, 0.2),
          speed: Random.range(0.001, 0.002),
          simulation: simulation(),
          radius: Random.range(2, 2.25) * radius,
        };
      }),
    [count, colors, radius]
  );

  return (
    <group>
      <group>
        {lines.map((props, index) => (
          <StormLine key={index} {...props} />
        ))}
      </group>
    </group>
  );
}
