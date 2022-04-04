#include <math.h>
#include <emscripten.h>
#include "../constants.h"

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void normalizeArcAngles(float start,
                              float stop,
                              int width,
                              int height,
                              bool correctForScaling,
                              float *res)
    {
        float epsilon = 0.00001;
        start = start - TWO_PI * floor(start / TWO_PI);
        stop = stop - TWO_PI * floor(stop / TWO_PI);
        float separation = fmin(abs(start - stop), TWO_PI - abs(start - stop));
        if (correctForScaling)
        {
            if (start <= HALF_PI)
            {
                start = atan(width / height * tan(start));
            }
            else if (start > HALF_PI && start <= 3 * HALF_PI)
            {
                start = atan(width / height * tan(start)) + PI;
            }
            else
            {
                start = atan(width / height * tan(start)) + TWO_PI;
            }
            if (stop <= HALF_PI)
            {
                stop = atan(width / height * tan(stop));
            }
            else if (stop > HALF_PI && stop <= 3 * HALF_PI)
            {
                stop = atan(width / height * tan(stop)) + PI;
            }
            else
            {
                stop = atan(width / height * tan(stop)) + TWO_PI;
            }
        }
        if (start > stop)
        {
            stop += TWO_PI;
        }
        res[0] = start;
        res[1] = stop;
        res[2] = (float)(separation < epsilon ? 1 : 0);
    }
}