/* Procedural shading example */
/* the student should make this more interesting */
/**
* I combined previous codes, consulted ChatGPT, and consulted the demo files to
* help with this solution.
*/
/* pass interpolated variables to from the vertex */
varying vec2 v_uv;
varying vec3 v_normal;

uniform float time;
uniform float bounce;
uniform vec3 lightDirection;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

void main()
{
    float x = v_uv.x;
    float y = v_uv.y;

    // Create the diagonal stripe effect based on the time.
    float dc = (sin((x * y) * 31.5 + time) + 1.0) / 2.0;

    // Mix the first two colors for the stripes.
    vec3 surfaceColor = mix(color1, color2, dc);

    // Lighting
    vec3 lightDir = normalize(viewMatrix * vec4(lightDirection, 0)).xyz;
    float light = abs(dot(v_normal, lightDir));

    // Mix in the third color alongside the first mix and the light.
    gl_FragColor = vec4(surfaceColor + light * color3, 1.);
}
