precision mediump float;

varying vec2 v_uv;
varying vec3 v_worldPosition;

uniform mat4 u_cameraMatrix;

#include<packing_pars>

#include<normal_pars_frag>
#include<diffuse_pars_frag>
#include<alphatest_pars_frag>

#include<ambient_frag_pars_frag>
#include<specular_pars_frag>
#include<lights_pars_frag>

#include<envmap_pars_frag>
#include<particle_pars_frag>
#include<fog_pars_frag>

void main()
{
    vec4 finalColor = vec4(1.0,1.0,1.0,1.0);

    #include<normal_frag>
    #include<diffuse_frag>
    #include<alphatest_frag>

    #include<ambient_frag>
    #include<specular_frag>
    #include<lights_frag>

    #include<envmap_frag>
    #include<particle_frag>
    #include<fog_frag>

    gl_FragColor = finalColor;
}