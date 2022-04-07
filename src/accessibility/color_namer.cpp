#include <emscripten.h>
#include "../color/color_conversion.h"
#include <string>
#include <math.h>
#include <iostream>
using std::string;
extern "C"
{
    struct HSBColor
    {
        float h;
        float s;
        float b;
        string name;
    };

    float originalHSB[3];

    HSBColor colorExceptions[] = {
        {0,
         0,
         0.8275,
         "gray"},
        {0,
         0,
         0.8627,
         "gray"},
        {0,
         0,
         0.7529,
         "gray"},
        {0.0167,
         0.1176,
         1,
         "light pink"}};

    HSBColor colorLookUp[] = {
        {0,
         0,
         0,
         "black"},
        {0,
         0,
         0.5,
         "gray"},
        {0,
         0,
         1,
         "white"},
        {0,
         0.5,
         0.5,
         "dark maroon"},
        {0,
         0.5,
         1,
         "salmon pink"},
        {0,
         1,
         0,
         "black"},
        {0,
         1,
         0.5,
         "dark red"},
        {0,
         1,
         1,
         "red"},
        {5,
         0,
         1,
         "very light peach"},
        {5,
         0.5,
         0.5,
         "brown"},
        {5,
         0.5,
         1,
         "peach"},
        {5,
         1,
         0.5,
         "brick red"},
        {5,
         1,
         1,
         "crimson"},
        {10,
         0,
         1,
         "light peach"},
        {10,
         0.5,
         0.5,
         "brown"},
        {10,
         0.5,
         1,
         "light orange"},
        {10,
         1,
         0.5,
         "brown"},
        {10,
         1,
         1,
         "orange"},
        {15,
         0,
         1,
         "very light yellow"},
        {15,
         0.5,
         0.5,
         "olive green"},
        {15,
         0.5,
         1,
         "light yellow"},
        {15,
         1,
         0,
         "dark olive green"},
        {15,
         1,
         0.5,
         "olive green"},
        {15,
         1,
         1,
         "yellow"},
        {20,
         0,
         1,
         "very light yellow"},
        {20,
         0.5,
         0.5,
         "olive green"},
        {20,
         0.5,
         1,
         "light yellow green"},
        {20,
         1,
         0,
         "dark olive green"},
        {20,
         1,
         0.5,
         "dark yellow green"},
        {20,
         1,
         1,
         "yellow green"},
        {25,
         0.5,
         0.5,
         "dark yellow green"},
        {25,
         0.5,
         1,
         "light green"},
        {25,
         1,
         0.5,
         "dark green"},
        {25,
         1,
         1,
         "green"},
        {30,
         0.5,
         1,
         "light green"},
        {30,
         1,
         0.5,
         "dark green"},
        {30,
         1,
         1,
         "green"},
        {35,
         0,
         0.5,
         "light green"},
        {35,
         0,
         1,
         "very light green"},
        {35,
         0.5,
         0.5,
         "dark green"},
        {35,
         0.5,
         1,
         "light green"},
        {35,
         1,
         0,
         "very dark green"},
        {35,
         1,
         0.5,
         "dark green"},
        {35,
         1,
         1,
         "green"},
        {40,
         0,
         1,
         "very light green"},
        {40,
         0.5,
         0.5,
         "dark green"},
        {40,
         0.5,
         1,
         "light green"},
        {40,
         1,
         0.5,
         "dark green"},
        {40,
         1,
         1,
         "green"},
        {45,
         0.5,
         1,
         "light turquoise"},
        {45,
         1,
         0.5,
         "dark turquoise"},
        {45,
         1,
         1,
         "turquoise"},
        {50,
         0,
         1,
         "light sky blue"},
        {50,
         0.5,
         0.5,
         "dark cyan"},
        {50,
         0.5,
         1,
         "light cyan"},
        {50,
         1,
         0.5,
         "dark cyan"},
        {50,
         1,
         1,
         "cyan"},
        {55,
         0,
         1,
         "light sky blue"},
        {55,
         0.5,
         1,
         "light sky blue"},
        {55,
         1,
         0.5,
         "dark blue"},
        {55,
         1,
         1,
         "sky blue"},
        {60,
         0,
         0.5,
         "gray"},
        {60,
         0,
         1,
         "very light blue"},
        {60,
         0.5,
         0.5,
         "blue"},
        {60,
         0.5,
         1,
         "light blue"},
        {60,
         1,
         0.5,
         "navy blue"},
        {60,
         1,
         1,
         "blue"},
        {65,
         0,
         1,
         "lavender"},
        {65,
         0.5,
         0.5,
         "navy blue"},
        {65,
         0.5,
         1,
         "light purple"},
        {65,
         1,
         0.5,
         "dark navy blue"},
        {65,
         1,
         1,
         "blue"},
        {70,
         0,
         1,
         "lavender"},
        {70,
         0.5,
         0.5,
         "navy blue"},
        {70,
         0.5,
         1,
         "lavender blue"},
        {70,
         1,
         0.5,
         "dark navy blue"},
        {70,
         1,
         1,
         "blue"},
        {75,
         0.5,
         1,
         "lavender"},
        {75,
         1,
         0.5,
         "dark purple"},
        {75,
         1,
         1,
         "purple"},
        {80,
         0.5,
         1,
         "pinkish purple"},
        {80,
         1,
         0.5,
         "dark purple"},
        {80,
         1,
         1,
         "purple"},
        {85,
         0,
         1,
         "light pink"},
        {85,
         0.5,
         0.5,
         "purple"},
        {85,
         0.5,
         1,
         "light fuchsia"},
        {85,
         1,
         0.5,
         "dark fuchsia"},
        {85,
         1,
         1,
         "fuchsia"},
        {90,
         0.5,
         0.5,
         "dark fuchsia"},
        {90,
         0.5,
         1,
         "hot pink"},
        {90,
         1,
         0.5,
         "dark fuchsia"},
        {90,
         1,
         1,
         "fuchsia"},
        {95,
         0,
         1,
         "pink"},
        {95,
         0.5,
         1,
         "light pink"},
        {95,
         1,
         0.5,
         "dark magenta"},
        {95,
         1,
         1,
         "magenta"}};

    char *calculateColor(float *hsb)
    {
        char *colortext;
        if (hsb[0] != 0)
        {
            hsb[0] = round(hsb[0] * 100);
            string hue = std::to_string(hsb[0]);
            const int last = hue.length() - 1;
            float hueLast = (float)(hue[last]);
            if (hueLast < 2.5)
            {
                hueLast = 0;
            }
            else if (hueLast >= 2.5 && hueLast < 7.5)
            {
                hueLast = 5;
            }
            if (hue.length() == 2)
            {
                hue[0] = (int)(hue[0]);
                if (hueLast >= 7.5)
                {
                    hueLast = 0;
                    hue[0] = hue[0] + 1;
                }
                hsb[0] = hue[0] * 10 + hue[1];
            }
            else
            {
                if (hueLast >= 7.5)
                {
                    hsb[0] = 10;
                }
                else
                {
                    hsb[0] = hueLast;
                }
            }
        }
        hsb[2] = hsb[2] / 255;
        for (int i = 2; i >= 1; i--)
        {
            if (hsb[i] <= 0.25)
            {
                hsb[i] = 0;
            }
            else if (hsb[i] > 0.25 && hsb[i] < 0.75)
            {
                hsb[i] = 0.5;
            }
            else
            {
                hsb[i] = 1;
            }
        }
        if (hsb[0] == 0 && hsb[1] == 0 && hsb[2] == 1)
        {
            for (int i = 2; i >= 0; i--)
            {
                originalHSB[i] = round(originalHSB[i] * 10000) / 10000;
            }
            for (int e = 0; e < 4; e++)
            {
                if (
                    colorExceptions[e].h == originalHSB[0] &&
                    colorExceptions[e].s == originalHSB[1] &&
                    colorExceptions[e].b == originalHSB[2])
                {
                    colortext = (char *)colorExceptions[e].name.c_str();
                    break;
                }
                else
                {
                    string white = "white";
                    colortext = (char *)white.c_str();
                }
            }
        }
        else
        {
            for (int i = 0; i < 96; i++)
            {
                if (
                    colorLookUp[i].h == hsb[0] &&
                    colorLookUp[i].s == hsb[1] &&
                    colorLookUp[i].b == hsb[2])
                {
                    colortext = (char *)colorLookUp[i].name.c_str();
                    break;
                }
            }
        }
        return colortext;
    }

    EMSCRIPTEN_KEEPALIVE
    char *rgbColorName(float r, float g, float b, float a)
    {
        float hsba[4];
        float rgba[] = {r, g, b, a};
        rgbaToHSBA(rgba, hsba);
        float hsb[] = {hsba[0], hsba[1], hsba[2]};
        return calculateColor(hsb);
    }
}