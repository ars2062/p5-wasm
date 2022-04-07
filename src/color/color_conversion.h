#ifndef COLOR_CONVESION
#define COLOR_CONVESION
extern "C"
{
    void hsbaToHSLA(float *hsba, float *res);
    void hsbaToRGBA(float *hsba, float *res);
    void hslaToHSBA(float *hsla, float *res);
    float hzvToRGB(float hue, float zest, float val);
    void hslaToRGBA(float *hsla, float *res);
    void rgbaToHSBA(float *rgba, float *res);
    void rgbaToHSLA(float *rgba, float *res);
}

#endif
