#include <emscripten.h>
#include <string>
#include <math.h>
using std::string;

extern "C"
{
    float roundoff(float value, unsigned char prec)
    {
        float pow_10 = pow(10.0f, (float)prec);
        return round(value * pow_10) / pow_10;
    }

    EMSCRIPTEN_KEEPALIVE
    void acuteArcToBezier(float start, float size, float *res)
    {
        float alpha = size / 2.0,
              cos_alpha = cos(alpha),
              sin_alpha = sin(alpha),
              cot_alpha = 1.0 / tan(alpha),
              phi = start + alpha,
              cos_phi = cos(phi),
              sin_phi = sin(phi),
              lambda = (4.0 - cos_alpha) / 3.0,
              mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;

        res[0] = cos(start);
        res[1] = sin(start);
        res[2] = (lambda * cos_phi + mu * sin_phi);
        res[3] = (lambda * sin_phi - mu * cos_phi);
        res[4] = (lambda * cos_phi - mu * sin_phi);
        res[5] = (lambda * sin_phi + mu * cos_phi);
        res[6] = cos(start + size);
        res[7] = sin(start + size);
    }
}