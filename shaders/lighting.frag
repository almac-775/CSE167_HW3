#version 330 core

in vec4 position; // raw position in the model coord
in vec3 normal;   // raw normal in the model coord

uniform mat4 modelview; // from model coord to eye coord
uniform mat4 view;      // from world coord to eye coord

// Material parameters
uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform vec4 emision;
uniform float shininess;

// Light source parameters
const int maximal_allowed_lights = 10;
uniform bool enablelighting;
uniform int nlights;
uniform vec4 lightpositions[ maximal_allowed_lights ];
uniform vec4 lightcolors[ maximal_allowed_lights ];

// Output the frag color
out vec4 fragColor;


void main (void){
    if (!enablelighting){
        // Default normal coloring (you don't need to modify anything here)
        vec3 N = normalize(normal);
        fragColor = vec4(0.5f*N + 0.5f , 1.0f);
    } else {
        
        // HW3: You will compute the lighting here.

        vec4 sum = vec4(0,0,0,0);

        for (int j=0; j < maximal_allowed_lights; j++) {    // calculate according to num of lights
            vec4 lpc = view * lightpositions[j];
            vec4 pc = modelview * position;

            vec3 n = normalize( inverse(transpose(mat3(modelview))) * normal );    // camera coord
            vec4 v = normalize( vec4(0,0,0,1) - pc );  // camera coord
            vec3 l = normalize( pc.w * lpc.xyz - lpc.w * pc.xyz );  // camera coord
            vec3 h = normalize( vec3(v) + l );  // camera coord

            sum += (ambient + (diffuse*max(dot(n,l),0)) + specular*pow(max(dot(n,h),0),shininess)) * lightcolors[j];
        }
        fragColor = emision + sum;
    }
}
