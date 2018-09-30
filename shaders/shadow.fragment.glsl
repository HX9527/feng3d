precision mediump float;

#include<packing_pars>

varying vec3 v_worldPosition;

uniform int u_lightType;
uniform vec3 u_lightPosition;
uniform float u_shadowCameraNear;
uniform float u_shadowCameraFar;

void main() {

    vec3 lightToPosition = (v_worldPosition - u_lightPosition);
    float dp = ( length( lightToPosition ) - u_shadowCameraNear ) / ( u_shadowCameraFar - u_shadowCameraNear ); // need to clamp?
    gl_FragColor = packDepthToRGBA( dp );
}