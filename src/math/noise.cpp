#include "../core/constants.h"
#include <emscripten.h>
#include <math.h>
#include <stdio.h>
int PERLIN_YWRAPB = 4;
int PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
int PERLIN_ZWRAPB = 8;
int PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
#define PERLIN_SIZE 4095
#define PLUS_PERLIN_SIZE 4096
int perlin_octaves = 4;         // default to medium smooth
float perlin_amp_falloff = 0.5; // 50% reduction/octave

float scaled_cosine(float i)
{
    return 0.5 * (1.0 - cos(i * PI));
}

double perlin[PLUS_PERLIN_SIZE] = {}; // will be initialized lazily by noise() or noiseSeed()
namespace lcg
{
    long long m = 4294967296;

    long a = 1664525;

    long c = 1013904223;
    int seed, z;
    void setSeed(int val);
    float rand();
}

void lcg::setSeed(int val = NULL)
{
    lcg::z = lcg::seed = (unsigned int)(val == NULL ? ((double)std::rand() / (RAND_MAX)) * lcg::m : val) >> 0;
}

float lcg::rand()
{
    // define the recurrence relationship
    lcg::z = (lcg::a * lcg::z + lcg::c) % lcg::m;
    // return a float in [0, 1)
    // if z = m then z / m = 0 therefore (z % m) / m < 1 always
    return lcg::z / lcg::m;
}

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    float noise(float x, float y, float z)
    {
        if (!perlin[0])
        {
            srand((unsigned int)time(NULL));
            for (int i = 0; i < PERLIN_SIZE + 1; i++)
            {
                perlin[i] = ((double)rand() / (RAND_MAX));
            }
        }

        if (x < 0)
        {
            x = -x;
        }
        if (y < 0)
        {
            y = -y;
        }
        if (z < 0)
        {
            z = -z;
        }

        int xi = floor(x),
            yi = floor(y),
            zi = floor(z);
        float xf = x - xi;
        float yf = y - yi;
        float zf = z - zi;
        float rxf, ryf;

        float r = 0;
        float ampl = 0.5;

        float n1, n2, n3;

        for (int o = 0; o < perlin_octaves; o++)
        {
            int of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

            rxf = scaled_cosine(xf);
            ryf = scaled_cosine(yf);

            n1 = perlin[of & PERLIN_SIZE];
            n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
            n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);

            of += PERLIN_ZWRAP;
            n2 = perlin[of & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
            n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);

            n1 += scaled_cosine(zf) * (n2 - n1);

            r += n1 * ampl;
            ampl *= perlin_amp_falloff;
            xi = xi << 1;
            xf *= 2;
            yi = yi << 1;
            yf *= 2;
            zi = zi << 1;
            zf *= 2;

            if (xf >= 1.0)
            {
                xi++;
                xf--;
            }
            if (yf >= 1.0)
            {
                yi++;
                yf--;
            }
            if (zf >= 1.0)
            {
                zi++;
                zf--;
            }
        }
        return r;
    }

    EMSCRIPTEN_KEEPALIVE
    void noiseDetail(int lod, float falloff)
    {
        if (lod > 0)
        {
            perlin_octaves = lod;
        }
        if (falloff > 0)
        {
            perlin_amp_falloff = falloff;
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void noiseSeed(int seed)
    {
        lcg::setSeed(seed);
        for (int i = 0; i < PERLIN_SIZE + 1; i++)
        {
            perlin[i] = lcg::rand();
        }
    }
}