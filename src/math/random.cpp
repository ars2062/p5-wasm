#include <emscripten.h>
#include <math.h>
#include <string>
using std::string;

extern "C"
{
    const long long m = 4294967296;
    const int a = 1664525;
    const int c = 1013904223;
    unsigned int lcg_random_state = NULL;
    bool gaussian_previous;
    int y2 = 0;

    EMSCRIPTEN_KEEPALIVE
    int lcg()
    {
        lcg_random_state = (a * lcg_random_state) % m;
        return lcg_random_state / m;
    }

    EMSCRIPTEN_KEEPALIVE
    void lcgSetSeed(int val = NULL)
    {
        auto r = ((double)std::rand() / (RAND_MAX));
        lcg_random_state = ((val == NULL ? (int)(r * m) : val) >> 0);
    }

    EMSCRIPTEN_KEEPALIVE
    void randomSeed(int seed)
    {
        lcgSetSeed(seed);
        gaussian_previous = false;
    }

    EMSCRIPTEN_KEEPALIVE
    int getRand()
    {
        int rand;

        if (lcg_random_state != NULL)
        {
            rand = lcg();
        }
        else
        {
            rand = (double)std::rand() / (RAND_MAX);
        }
        return rand;
    }

    EMSCRIPTEN_KEEPALIVE
    int crandom(int min = NULL, int max = NULL)
    {

        int rand = getRand();
        if (min == NULL)
        {
            return rand;
        }
        else if (max == NULL)
        {
            return rand * min;
        }
        else
        {
            if (min > max)
            {
                int tmp = min;
                min = max;
                max = tmp;
            }

            return rand * (max - min) + min;
        }
    }

    EMSCRIPTEN_KEEPALIVE
    int randomGaussian(int mean, int sd = 1)
    {
        int y1, x1, x2, w;
        if (gaussian_previous)
        {
            y1 = y2;
            gaussian_previous = false;
        }
        else
        {
            do
            {
                x1 = crandom(2) - 1;
                x2 = crandom(2) - 1;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1);
            w = sqrt(-2 * log(w) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            gaussian_previous = true;
        }

        int m = mean ? mean : 0;
        return y1 * sd + m;
    }
}