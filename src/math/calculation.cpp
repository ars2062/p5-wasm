#include <emscripten.h>
#include <math.h>
#include <stdio.h>

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
    float cfloor(float n)
    {
        return floor(n);
    }

    EMSCRIPTEN_KEEPALIVE
    float learp(float start, float stop, float amt)
    {
        return amt * (stop - start) + start;
    }

    EMSCRIPTEN_KEEPALIVE
    float clog(float x)
    {
        return log(x);
    }

    EMSCRIPTEN_KEEPALIVE
    float mag(float x, float y)
    {
        return hypot(x, y);
    }

    EMSCRIPTEN_KEEPALIVE
    float constrain(float n, float low, float high)
    {
        return fmax(fmin(n, high), low);
    }

    EMSCRIPTEN_KEEPALIVE
    float map(float n, float start1, float stop1, float start2, float stop2, bool withinBounds)
    {
        float newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds)
        {
            return newval;
        }
        if (start2 < stop2)
        {
            return constrain(newval, start2, stop2);
        }
        else
        {
            return constrain(newval, stop2, start2);
        }
    }

    EMSCRIPTEN_KEEPALIVE
    float dist(float a, float b, float c, float d, float e, float f)
    {
        if (isnan(f))
        {
            return hypot(c - a, d - b);
        }
        else
        {
            return hypot3d(d - a, e - b, f - c);
        }
    }

    EMSCRIPTEN_KEEPALIVE
    float norm(float n, float start, float stop)
    {
        return map(n, start, stop, 0, 1, false);
    }

    EMSCRIPTEN_KEEPALIVE
    float cpow(float n, float e)
    {
        return pow(n, e);
    }
}