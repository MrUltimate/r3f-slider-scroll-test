import * as THREE from "three";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, ScrollControls, Scroll, useScroll, Plane, useTexture, useAspect } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { Minimap } from "./Minimap";
import { state, damp } from "../utils/utils";

import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useSpring, a } from "@react-spring/three";

import "./../materials/deformMaterial";
import "./../materials/noiseMaterial";

// function Item({ index, position, scale, c = new THREE.Color(), ...props }) {
//   const ref = useRef();
//   const scroll = useScroll();
//   const { clicked, urls } = useSnapshot(state);
//   const [hovered, hover] = useState(false);
//   const click = () => (state.clicked = index === clicked ? null : index);
//   const over = () => hover(true);
//   const out = () => hover(false);
//   useFrame((state, delta) => {
//     const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length);
//     ref.current.material.scale[1] = ref.current.scale.y = damp(
//       ref.current.scale.y,
//       clicked === index ? 5 : 4 + y,
//       8,
//       delta
//     );
//     ref.current.material.scale[0] = ref.current.scale.x = damp(
//       ref.current.scale.x,
//       clicked === index ? 4.7 : scale[0],
//       6,
//       delta
//     );
//     if (clicked !== null && index < clicked)
//       ref.current.position.x = damp(ref.current.position.x, position[0] - 2, 6, delta);
//     if (clicked !== null && index > clicked)
//       ref.current.position.x = damp(ref.current.position.x, position[0] + 2, 6, delta);
//     if (clicked === null || clicked === index)
//       ref.current.position.x = damp(ref.current.position.x, position[0], 6, delta);
//     ref.current.material.grayscale = damp(
//       ref.current.material.grayscale,
//       hovered || clicked === index ? 0 : Math.max(0, 1 - y),
//       6,
//       delta
//     );
//     ref.current.material.color.lerp(c.set(hovered || clicked === index ? "white" : "#aaa"), hovered ? 0.3 : 0.1);
//   });
//   return (
//     <Image
//       ref={ref}
//       {...props}
//       position={position}
//       scale={scale}
//       onClick={click}
//       onPointerOver={over}
//       onPointerOut={out}
//     />
//   );
// }

const useStore = create(
  subscribeWithSelector((set) => ({
    intensity: 0,
  }))
);

function Pl({ map, scale, ...props }) {
  const mat = useRef();
  const scroll = useScroll();
  useEffect(() => {
    useStore.subscribe(
      (state) => state.intensity,
      (i) => {
        mat.current.uniforms.intensity.value = i;
      }
    );
  }, []);

  const [, set] = useSpring(() => ({
    hover: 0,
    mouse: [0, 0],
    config: { mass: 5, friction: 40, tension: 200 },
    onChange: {
      hover: (val) => {
        mat.current.uniforms.hover.value = val;
      },
      mouse: (val) => {
        mat.current.uniforms.mouse.value = val;
      },
    },
  }));

  const handleMove = useCallback(
    (e) => {
      set({ mouse: e.uv });
    },
    [set]
  );
  const handlePointerOver = useCallback(
    (e) => {
      set({ hover: 0.5 });
    },
    [set]
  );
  const handlePointerOut = useCallback(
    (e) => {
      set({ hover: 0 });
    },
    [set]
  );

  const data = useScroll();
  const [spring, change] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 5, friction: 100, tension: 800 },
    onChange: (data) => {
      useStore.setState({
        intensity: data.delta,
      });
    },
  }));

  return (
    <Plane
      args={scale}
      {...props}
      onPointerMove={handleMove}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <deformMaterial map={map} ref={mat} />
    </Plane>
  );
}

// function Items({ w = 0.7, gap = 0.15 }) {
//   const { urls } = useSnapshot(state);
//   const { width } = useThree((state) => state.viewport);
//   const xW = w + gap;
//   return (
//     <ScrollControls horizontal damping={6} pages={(width - xW + urls.length * xW) / width}>
//       <Minimap />
//       <Scroll>
//         {
//           urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} url={url} />) /* prettier-ignore */
//         }
//       </Scroll>
//     </ScrollControls>
//   );
// }

function Items({ w = 6, gap = 0.5 }) {
  const { urls } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  const tex = useTexture(urls);

  const noise = useRef();

  const scale = useAspect("cover", 16, 9);
  console.log(scale);
  useFrame(({ clock }) => {
    noise.current.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <ScrollControls horizontal damping={6} pages={(width - xW + urls.length * xW) / width}>
      <Minimap />
      <Scroll>
        <group>
          <a.group>
            {tex.map((t, i) => (
              <Pl key={i} index={i} map={t} position={[i * xW, 0, 0]} scale={[w, 4, 24, 48]} />
            ))}
          </a.group>
        </group>
        <Plane args={[20, 12]} scale={scale} position-z={-10}>
          <noiseMaterial opacity={0.1} transparent ref={noise} />
        </Plane>
      </Scroll>
    </ScrollControls>
  );
}

export const App = () => (
  <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
    <Items />
  </Canvas>
);
