#include <emscripten.h>
#include "./color_conversion.h"
#include <math.h>
#include <algorithm>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void hsbaToHSLA(float *hsba, float *res)
    {
        const float hue = hsba[0];
        float sat = hsba[1];
        const float val = hsba[2];

        const float li = (2 - sat) * val / 2;

        if (li != 0)
        {
            if (li == 1)
            {
                sat = 0;
            }
            else if (li < 0.5)
            {
                sat = sat / (2 - sat);
            }
            else
            {
                sat = sat * val / (2 - li * 2);
            }
        }

        res[0] = hue;
        res[1] = sat;
        res[2] = li;
        res[3] = hsba[3];
    }

    EMSCRIPTEN_KEEPALIVE
    void hsbaToRGBA(float *hsba, float *res)
    {
        const float hue = hsba[0] * 6;
        const float sat = hsba[1];
        const float val = hsba[2];

        if (sat == 0)
        {
            res[0] = res[1] = res[2] = val;
            res[3] = hsba[3];
        }
        else
        {
            const float sector = floor(hue);
            const float tint1 = val * (1 - sat);
            const float tint2 = val * (1 - sat * (hue - sector));
            const float tint3 = val * (1 - sat * (1 + sector - hue));
            float red;
            float green;
            float blue;
            if (sector == 1)
            {
                red = tint2;
                green = val;
                blue = tint1;
            }
            else if (sector == 2)
            {
                red = tint1;
                green = val;
                blue = tint3;
            }
            else if (sector == 3)
            {
                red = tint1;
                green = tint2;
                blue = val;
            }
            else if (sector == 4)
            {
                red = tint3;
                green = tint1;
                blue = val;
            }
            else if (sector == 5)
            {
                red = val;
                green = tint1;
                blue = tint2;
            }
            else
            {
                red = val;
                green = tint3;
                blue = tint1;
            }
            res[0] = red;
            res[1] = green;
            res[2] = blue;
            res[3] = hsba[3];
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void hslaToHSBA(float *hsla, float *res)
    {
        const float hue = hsla[0];
        float sat = hsla[1];
        const float li = hsla[2];

        float val;
        if (li < 0.5)
        {
            val = (1 + sat) * li;
        }
        else
        {
            val = li + sat - li * sat;
        }

        sat = 2 * (val - li) / val;

        res[0] = hue;
        res[1] = sat;
        res[2] = val;
        res[3] = hsla[3];
    }

    EMSCRIPTEN_KEEPALIVE
    float hzvToRGB(float hue, float zest, float val)
    {
        if (hue < 0)
        {
            hue += 6;
        }
        else if (hue >= 6)
        {
            hue -= 6;
        }
        if (hue < 1)
        {

            return zest + (val - zest) * hue;
        }
        else if (hue < 3)
        {

            return val;
        }
        else if (hue < 4)
        {

            return zest + (val - zest) * (4 - hue);
        }
        else
        {

            return zest;
        }
    };

    EMSCRIPTEN_KEEPALIVE
    void hslaToRGBA(float *hsla, float *res)
    {
        const float hue = hsla[0] * 6;
        const float sat = hsla[1];
        const float li = hsla[2];

        if (sat == 0)
        {
            res[0] = li;
            res[1] = li;
            res[2] = li;
            res[3] = hsla[3];
        }
        else
        {
            float val;
            if (li < 0.5)
            {
                val = (1 + sat) * li;
            }
            else
            {
                val = li + sat - li * sat;
            }

            const float zest = 2 * li - val;

            res[0] = hzvToRGB(hue + 2, zest, val);
            res[1] = hzvToRGB(hue, zest, val);
            res[2] = hzvToRGB(hue - 2, zest, val);
            res[3] = hsla[3];
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void rgbaToHSBA(float *rgba, float *res)
    {
        const float red = rgba[0];
        const float green = rgba[1];
        const float blue = rgba[2];

        const float val = std::max({red, green, blue});
        const float chroma = val - std::min({red, green, blue});

        float hue;
        float sat;
        if (chroma == 0)
        {
            hue = 0;
            sat = 0;
        }
        else
        {
            sat = chroma / val;
            if (red == val)
            {
                hue = (green - blue) / chroma;
            }
            else if (green == val)
            {
                hue = 2 + (blue - red) / chroma;
            }
            else if (blue == val)
            {
                hue = 4 + (red - green) / chroma;
            }
            if (hue < 0)
            {
                hue += 6;
            }
            else if (hue >= 6)
            {
                hue -= 6;
            }
        }

        res[0] = hue / 6;
        res[1] = sat;
        res[2] = val;
        res[3] = rgba[3];
    }

    EMSCRIPTEN_KEEPALIVE
    void rgbaToHSLA(float *rgba, float *res)
    {
        const float red = rgba[0];
        const float green = rgba[1];
        const float blue = rgba[2];

        const float val = std::max({red, green, blue});
        const float min = std::min({red, green, blue});
        const float li = val + min;
        const float chroma = val - min;

        float hue;
        float sat;
        if (chroma == 0)
        {
            hue = 0;
            sat = 0;
        }
        else
        {
            if (li < 1)
            {
                sat = chroma / li;
            }
            else
            {
                sat = chroma / (2 - li);
            }
            if (red == val)
            {
                hue = (green - blue) / chroma;
            }
            else if (green == val)
            {
                hue = 2 + (blue - red) / chroma;
            }
            else if (blue == val)
            {
                hue = 4 + (red - green) / chroma;
            }
            if (hue < 0)
            {
                hue += 6;
            }
            else if (hue >= 6)
            {
                hue -= 6;
            }
        }

        res[0] = hue / 6;
        res[1] = sat;
        res[2] = li / 2;
        res[3] = rgba[3];
    }
}
