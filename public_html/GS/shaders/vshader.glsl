attribute vec2 vPosition;
uniform mat4 rotation;

void main()
{
    gl_Position = rotation*vec4( vPosition, 0.0, 1.0 );
}
