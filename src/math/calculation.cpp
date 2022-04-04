#include <emscripten.h>
#include <math.h>

float hypot3d(float x, float y, float z)
{
    return sqrt(x * x + y * y + z * z);
}
extern "C"
{

    EMSCRIPTEN_KEEPALIVE
    float cabs(float num)
    {
        return abs(num);
    }

    EMSCRIPTEN_KEEPALIVE
    float cceil(float num)
    {
        return ceil(num);
    }

    EMSCRIPTEN_KEEPALIVE
    float cexp(float n)
    {
        return exp(n);
    }

    EMSCRIPTEN_KEEPALIVE
    float constrain(float n, float low, float high)
    {
        return fmax(fmin(n, high), low);
    }

    EMSCRIPTEN_KEEPALIVE
    float dist(float args[], int length)
    {
        if (length == 4)
        {
            return hypot(args[2] - args[0], args[3] - args[1]);
        }
        else if (length == 6)
        {
            return hypot3d(args[3] - args[0], args[4] - args[1], args[5] - args[2]);
        }
        else
        {
            throw "not valid argument length";
        }
    }
}