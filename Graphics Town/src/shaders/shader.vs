
/*
 * Simple Shader
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
*
/**
* I combined previous codes, consulted ChatGPT, and consulted the demo files to
* help with this solution.
*/

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
varying vec3 v_normal;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
uniform float time;
uniform float bounce;

void main() {
    // Pass the texture coordinate to the fragment
    v_uv = uv;

    // The diagonal stripe pattern
    float x = v_uv.x;
    float y = v_uv.y;

    float dist = (sin(y * 6.5 + time) + 1.0) / 2.0;

    // pos: Enables the sphere and sign to bounce.
    vec3 pos = position * (1.0 + dist * bounce);

    v_normal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
}
