uniform float time;
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
