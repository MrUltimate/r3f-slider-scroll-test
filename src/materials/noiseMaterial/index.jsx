import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// import vertex from "./vertex.glsl";
// import fragment from "./fragment.glsl";

const NoiseMaterial = shaderMaterial(
  { time: 0, opacity: 1 },
  `uniform float time;

varying vec2 vUv;

void main()	{
    vUv = uv;
    
    float updateTime = time / 1000.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);

    gl_Position = projectionMatrix * mvPosition;
}
`,
  `uniform float time;
uniform float opacity;
varying vec2 vUv;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()	{
    gl_FragColor = vec4(vec3(rand(vUv * time)), opacity);
}`
);

extend({ NoiseMaterial });
