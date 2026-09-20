/**
 * The metaball field — the visual half of "Personality & Harmony".
 *
 * Bodies that drift together merge into one form while keeping their colour at
 * the seam, which is the school's own sentence rendered rather than illustrated.
 *
 * Two fields accumulate in a single loop: `f` at the pixel and `fh` at a point
 * offset down-right. Their difference is a free lighting normal — bright rim on
 * the upper-left, soft shade on the lower-right. That is what makes the bodies
 * read as jelly on a white ground instead of as flat circles.
 */
export const MAX_BODIES = 12

export const vertexShader = /* glsl */ `
  void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
`

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec2  uRes;
  uniform float uTime;
  uniform float uChurn;
  uniform vec3  uBlob[${MAX_BODIES}];   // xy = centre, z = radius
  uniform vec3  uCol[${MAX_BODIES}];
  uniform float uHeat[${MAX_BODIES}];

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes;
    float asp = uRes.x / uRes.y;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= asp;
    p.x += sin(p.y * 6.5 + uTime * 2.0) * 0.030 * uChurn;
    p.y += cos(p.x * 5.0 + uTime * 1.6) * 0.022 * uChurn;

    vec2 ph = p + vec2(0.055, -0.070);
    float f = 0.0, fh = 0.0;
    vec3 acc = vec3(0.0);

    for(int i = 0; i < ${MAX_BODIES}; i++){
      vec3 b = uBlob[i];
      float rr = b.z * b.z;
      vec2 d  = p  - b.xy;
      vec2 dh = ph - b.xy;
      float c = rr / (dot(d, d) + 0.0004);
      fh += rr / (dot(dh, dh) + 0.0004);
      f  += c;
      acc += uCol[i] * c * (0.60 + uHeat[i] * 0.55);
    }

    vec3 tint = acc / max(f, 0.0001);
    float body  = smoothstep(0.88, 1.06, f);
    float aura  = smoothstep(0.26, 0.96, f);
    float shine = smoothstep(0.10, 1.15, fh - f);
    float shade = smoothstep(0.10, 1.15, f - fh);

    vec3 bg = mix(vec3(0.996, 0.986, 0.968), vec3(0.968, 0.953, 0.928), uv.y * 0.85);
    vec3 fill = mix(vec3(1.0), tint, 0.60);

    vec3 col = bg;
    col = mix(col, mix(vec3(1.0), tint, 0.30), aura * 0.32);
    col = mix(col, fill, body);
    col = mix(col, tint * 0.80, body * shade * 0.55);
    col = mix(col, vec3(1.0), body * shine * 0.70);

    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
    col += (g - 0.5) * 0.014;

    gl_FragColor = vec4(col, 1.0);
  }
`
