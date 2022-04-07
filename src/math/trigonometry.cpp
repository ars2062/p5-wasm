#include <emscripten.h>
#include "../global.h"
#include "../core/constants.h"
#include <string>
#include <math.h>

string _angleMode = RADIANS;

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    float fromRadians(float angle)
    {
        if (_angleMode == DEGREES)
        {
            return angle * RAD_TO_DEG;
        }
        return angle;
    }

    EMSCRIPTEN_KEEPALIVE
    int toDegrees(float angle)
    {
        if (_angleMode == RADIANS)
        {
            return angle * RAD_TO_DEG;
        }
        return angle;
    }

    EMSCRIPTEN_KEEPALIVE
    float toRadians(int angle)
    {
        if (_angleMode == DEGREES)
        {
            return angle * DEG_TO_RAD;
        }
        return angle;
    }

    EMSCRIPTEN_KEEPALIVE
    void angleMode(string mode)
    {
        if (mode == DEGREES || mode == RADIANS)
        {
            _angleMode = mode;
        }
    }

    EMSCRIPTEN_KEEPALIVE
    float radians(int angle)
    {
        return angle * DEG_TO_RAD;
    }

    EMSCRIPTEN_KEEPALIVE
    int degrees(float angle)
    {
        return angle * RAD_TO_DEG;
    }

    EMSCRIPTEN_KEEPALIVE
    float cacos(float ratio)
    {
        return fromRadians(acos(ratio));
    }

    EMSCRIPTEN_KEEPALIVE
    float casin(float ratio)
    {
        return fromRadians(asin(ratio));
    }

    EMSCRIPTEN_KEEPALIVE
    float catan(float ratio)
    {
        return fromRadians(atan(ratio));
    }

    EMSCRIPTEN_KEEPALIVE
    float catan2(float y, float x)
    {
        return fromRadians(atan2(y, x));
    }

    EMSCRIPTEN_KEEPALIVE
    float ccos(int angle)
    {
        return cos(toRadians(angle));
    }

    EMSCRIPTEN_KEEPALIVE
    float csin(int angle)
    {
        return sin(toRadians(angle));
    }

    EMSCRIPTEN_KEEPALIVE
    float ctan(int angle)
    {
        return tan(toRadians(angle));
    }
}