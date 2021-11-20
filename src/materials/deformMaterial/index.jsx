import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// import vertex from "./vertex.glsl";
// import fragment from "./fragment.glsl";

const DeformMaterial = shaderMaterial(
  { time: 0, hover: 0, intensity: 0, map: null, mouse: [0, 0], hover: false },
  `uniform float time;
uniform vec2 mouse;
uniform float intensity;
uniform float hover;

varying vec3 vNormal;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

void main()	{
    vNormal = normal;
    vUv = uv;
    
    vec3 pos = position;
    pos.x = pos.x + -(cos(pos.y * 0.5) * 1.) * intensity;

    float d = distance(vec2(vUv.x, vUv.y), mouse);
    pos.z = pos.z - (hover * -(1. - d) * .8);

    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

    gl_Position = projectionMatrix * mvPosition;
}
`,
  `uniform float time;
uniform vec2 resolution;
uniform sampler2D map;

uniform float hover;

varying vec3 vNormal;
varying vec2 vUv;
uniform vec2 mouse;

void main()	{
    vec4 color = texture2D(map, vUv);

    float d = distance(vec2(vUv.x, vUv.y), mouse);

    color = color + ((1. - d) * .2 * hover * hover);

    vec3 bwColor =  vec3((color.r+color.g+color.b)/1.5-0.3);
    
    gl_FragColor = vec4(color.rgb, 1.);
}`
);

extend({ DeformMaterial });
