#include <emscripten.h>
#include <math.h>
extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    float bezierPoint(float a, float b, float c, float d, float t)
    {
        float adjustedT = 1 - t;
        return (
            pow(adjustedT, 3) * a +
            3 * pow(adjustedT, 2) * t * b +
            3 * adjustedT * pow(t, 2) * c +
            pow(t, 3) * d);
    }

    EMSCRIPTEN_KEEPALIVE
    float bezierTangent(float a, float b, float c, float d, float t)
    {
        float adjustedT = 1 - t;
        return (
            3 * d * pow(t, 2) -
            3 * c * pow(t, 2) +
            6 * c * adjustedT * t -
            6 * b * adjustedT * t +
            3 * b * pow(adjustedT, 2) -
            3 * a * pow(adjustedT, 2));
    }

    EMSCRIPTEN_KEEPALIVE
    float curvePoint(float a, float b, float c, float d, float t)
    {
        float t3 = t * t * t,
              t2 = t * t,
              f1 = -0.5 * t3 + t2 - 0.5 * t,
              f2 = 1.5 * t3 - 2.5 * t2 + 1.0,
              f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t,
              f4 = 0.5 * t3 - 0.5 * t2;
        return a * f1 + b * f2 + c * f3 + d * f4;
    };

    EMSCRIPTEN_KEEPALIVE
    float curveTangent(float a, float b, float c, float d, float t)
    {
        float t2 = t * t,
              f1 = -3 * t2 / 2 + 2 * t - 0.5,
              f2 = 9 * t2 / 2 - 5 * t,
              f3 = -9 * t2 / 2 + 4 * t + 0.5,
              f4 = 3 * t2 / 2 - t;
        return a * f1 + b * f2 + c * f3 + d * f4;
    };
}