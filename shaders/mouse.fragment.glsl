#version 300 es

precision highp float;

uniform uint u_objectID;

out vec4 o_objectID;

void main(){

    //支持 255*255 个索引
    const float invColor = 1.0/255.0;
    float temp = float(u_objectID) * invColor;
    o_objectID.x = fract(floor(temp) * invColor);
    o_objectID.y = fract(temp);
}