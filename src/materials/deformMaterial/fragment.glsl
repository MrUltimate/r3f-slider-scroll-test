uniform float time;
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
}