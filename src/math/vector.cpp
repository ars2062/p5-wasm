#include "../wasmUtils/string.h"
#include "../core/constants.h"
#include <math.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <algorithm>

using std::string;
using namespace emscripten;

float randFloat()
{
    srand((unsigned)time(NULL));
    return ((float)std::rand() / (RAND_MAX));
}

template <typename T>
int sgn(T val)
{
    return (T(0) < val) - (val < T(0));
}

template <typename T>
bool every(std::vector<T> list, bool (*func)(T))
{
    for (const auto i : list)
    {
        if (!func(i))
            return false;
    }
    return true;
}
class vector
{
private:
public:
    float x, y, z;
    vector(float x = 0, float y = 0, float z = 0)
    {
        this->x = x;
        this->y = y;
        this->z = z;
    }

    string toString()
    {
        return string_format("p5.Vector Object : [%d, %d, %d]", this->x, this->y, this->z);
    }

    vector *set(vector x)
    {
        this->x = x.x;
        this->y = x.y;
        this->z = x.z;
        return this;
    }

    vector *set(const val &x)
    {
        const auto vec = vecFromJSArray<float>(x);

        this->x = vec[0];
        this->y = vec[1];
        this->z = vec[2];
        return this;
    }

    vector *set(float x, float y, float z)
    {

        this->x = x;
        this->y = y;
        this->z = z;
        return this;
    }

    vector *copy()
    {
        return new vector(this->x, this->y, this->z);
    }

    vector *add(vector x)
    {
        this->x += x.x || 0;
        this->y += x.y || 0;
        this->z += x.z || 0;
        return this;
    }

    vector *add(const val &x)
    {
        const auto vec = vecFromJSArray<float>(x);

        this->x += vec[0] || 0;
        this->y += vec[1] || 0;
        this->z += vec[2] || 0;
        return this;
    }

    vector *add(float x, float y, float z)
    {
        this->x += x || 0;
        this->y += y || 0;
        this->z += z || 0;
        return this;
    }

    vector *calculateRemainder2D(float xComponent, float yComponent)
    {
        if (xComponent != 0)
        {
            this->x = fmod(this->x, xComponent);
        }
        if (yComponent != 0)
        {
            this->y = fmod(this->y, yComponent);
        }
        return this;
    }

    vector *calculateRemainder3D(float xComponent, float yComponent, float zComponent)
    {

        if (xComponent != 0)
        {
            this->x = fmod(this->x, xComponent);
        }
        if (yComponent != 0)
        {
            this->y = fmod(this->y, yComponent);
        }
        if (zComponent != 0)
        {
            this->z = fmod(this->z, zComponent);
        }
        return this;
    }

    vector *rem(vector x)
    {
        if (isfinite(x.x) && isfinite(x.y) && isfinite(x.z))
        {
            return this->calculateRemainder3D(x.x, x.y, x.z);
        }
        return this;
    }

    vector *rem(const val &x)
    {
        const auto vec = vecFromJSArray<float>(x);
        if (every(vec, &isfinite))
        {
            const int length = vec.size();
            if (length == 2)
            {
                return this->calculateRemainder2D(vec[0], vec[1]);
            }
            else if (length == 3)
            {
                return this->calculateRemainder3D(vec[0], vec[1], vec[2]);
            }
        }
        return this;
    }

    vector *rem(float x)
    {
        if (isfinite(x) && x != 0)
        {
            this->x = fmod(this->x, x);
            this->y = fmod(this->y, x);
            this->z = fmod(this->z, x);
        }
        return this;
    }

    vector *rem(float x, float y)
    {
        if (isfinite(x) && isfinite(y))
        {
            return this->calculateRemainder2D(x, y);
        }
        return this;
    }

    vector *rem(float x, float y, float z)
    {
        if (isfinite(x) && isfinite(y) && isfinite(z))
        {
            return this->calculateRemainder3D(x, y, z);
        }
        return this;
    }

    vector *sub(vector x)
    {
        this->x -= x.x || 0;
        this->y -= x.y || 0;
        this->z -= x.z || 0;
        return this;
    }

    vector *sub(const val &x)
    {
        const auto vec = vecFromJSArray<float>(x);

        this->x -= vec[0] || 0;
        this->y -= vec[1] || 0;
        this->z -= vec[2] || 0;
        return this;
    }

    vector *sub(float x, float y, float z)
    {
        this->x -= x || 0;
        this->y -= y || 0;
        this->z -= z || 0;
        return this;
    }

    vector *mult(vector x)
    {
        if (isfinite(x.x) && isfinite(x.y) && isfinite(x.z))
        {
            this->x *= x.x;
            this->y *= x.y;
            this->z *= x.z;
        }
        else
        {
            EM_ASM({
                console.warn(
                    'p5.Vector.prototype.mult:',
                    'x contains components that are either undefined or not finite numbers');
            });
        }
        return this;
    }

    vector *mult(const val &x)
    {
        const auto vec = vecFromJSArray<float>(x);
        if (every(vec, &isfinite))
        {
            const auto length = vec.size();
            if (length == 1)
            {
                this->x *= vec[0];
                this->y *= vec[0];
                this->z *= vec[0];
            }
            else if (length == 2)
            {
                this->x *= vec[0];
                this->y *= vec[1];
            }
            else if (length == 3)
            {
                this->x *= vec[0];
                this->y *= vec[1];
                this->z *= vec[2];
            }
        }
        else
        {
            EM_ASM({
                console.warn(
                    'p5.Vector.prototype.mult:',
                    'x contains components that are either undefined or not finite numbers');
            });
        }
        return this;
    }

    vector *mult(float x)
    {
        if (isfinite(x))
        {
            this->x *= x;
            this->y *= x;
            this->z *= x;
        }
        return this;
    }

    vector *mult(float x, float y)
    {
        if (isfinite(x) && isfinite(y))
        {
            this->x *= x;
            this->y *= y;
        }
        return this;
    }

    vector *mult(float x, float y, float z)
    {
        if (isfinite(x) && isfinite(y) && isfinite(z))
        {
            this->x *= x;
            this->y *= y;
            this->z *= z;
        }
        return this;
    }
    // div

    vector *div(vector x)
    {
        if (isfinite(x.x) && isfinite(x.y) && isfinite(x.z))
        {
            this->x /= x.x;
            this->y /= x.y;
            this->z /= x.z;
        }
        else
        {
            EM_ASM({
                console.warn(
                    'p5.Vector.prototype.div:',
                    'x contains components that are either undefined or not finite numbers');
            });
        }
        return this;
    }

    vector *div(const val &x)
    {
        const auto vec = vecFromJSArray<float>(x);
        if (every(vec, &isfinite))
        {
            const auto length = vec.size();
            if (length == 1)
            {
                this->x /= vec[0];
                this->y /= vec[0];
                this->z /= vec[0];
            }
            else if (length == 2)
            {
                this->x /= vec[0];
                this->y /= vec[1];
            }
            else if (length == 3)
            {
                this->x /= vec[0];
                this->y /= vec[1];
                this->z /= vec[2];
            }
        }
        else
        {
            EM_ASM({
                console.warn(
                    'p5.Vector.prototype.div:',
                    'x contains components that are either undefined or not finite numbers');
            });
        }
        return this;
    }

    vector *div(float x)
    {
        if (isfinite(x))
        {
            this->x /= x;
            this->y /= x;
            this->z /= x;
        }
        return this;
    }

    vector *div(float x, float y)
    {
        if (isfinite(x) && isfinite(y))
        {
            this->x /= x;
            this->y /= y;
        }
        return this;
    }

    vector *div(float x, float y, float z)
    {
        if (isfinite(x) && isfinite(y) && isfinite(z))
        {
            this->x /= x;
            this->y /= y;
            this->z /= z;
        }
        return this;
    }

    float magSq()
    {
        const float x = this->x;
        const float y = this->y;
        const float z = this->z;
        return x * x + y * y + z * z;
    }

    float mag()
    {
        return sqrt(this->magSq());
    }

    float dot(float x, float y, float z)
    {
        return this->x * (x || 0) + this->y * (y || 0) + this->z * (z || 0);
    }

    float dot(vector x)
    {
        return this->dot(x.x, x.y, x.z);
    }

    vector *cross(vector v)
    {
        const auto x = this->y * v.z - this->z * v.y;
        const auto y = this->z * v.x - this->x * v.z;
        const auto z = this->x * v.y - this->y * v.x;
        return new vector(x, y, z);
    }

    float dist(vector v)
    {
        return v.copy()->sub(*this)->mag();
    }

    vector *normalize()
    {
        const auto len = this->mag();
        if (len != 0)
            this->mult(1 / len);
        return this;
    }

    vector *limit(float max)
    {
        const auto mSq = this->magSq();
        if (mSq > max * max)
        {
            this->div(sqrt(mSq))->mult(max);
        }
        return this;
    }

    vector *setMag(float n)
    {
        return this->normalize()->mult(n);
    }

    float heading()
    {
        return atan2(this->y, this->x);
    }

    vector *setHeading(float a)
    {
        const auto m = this->mag();
        this->x = m * cos(a);
        this->y = m * sin(a);
        return this;
    }

    vector *rotate(float a)
    {
        const auto newHeading = this->heading() + a;
        const auto mag = this->mag();
        this->x = cos(newHeading) * mag;
        this->y = sin(newHeading) * mag;
        return this;
    }

    float angleBetween(vector v)
    {
        const auto dotmagmag = this->dot(v) / (this->mag() * v.mag());

        float angle = acos(fmin(1.0f, fmax(-1, dotmagmag)));
        return angle * sgn(this->cross(v)->z || 1);
    }

    vector *lerp(vector x, float y)
    {
        return this->lerp(x.x, x.y, x.z, y);
    }

    vector *lerp(float x, float y, float z, float amt)
    {
        this->x += (x - this->x) * amt || 0;
        this->y += (y - this->y) * amt || 0;
        this->z += (z - this->z) * amt || 0;
        return this;
    }

    vector *reflect(vector surfaceNormal)
    {
        surfaceNormal.normalize();
        return this->sub(*surfaceNormal.mult(2 * this->dot(surfaceNormal)));
    }

    auto array()
    {
        std::vector<float> v = {this->x ? this->x : 0, this->y ? this->y : 0, this->z ? this->z : 0};
        return val::array(v);
    }

    bool equals(vector v)
    {
        return this->equals(v.x, v.y, v.z);
    }

    bool equals(const val &v)
    {
        const auto vec = vecFromJSArray<float>(v);
        return this->equals(vec[0], vec[1], vec[2]);
    }

    bool equals(float x, float y, float z)
    {
        const auto a = x ? x : 0;
        const auto b = y ? y : 0;
        const auto c = z ? z : 0;
        return this->x == a && this->y == b && this->z == c;
    }

    static vector *fromAngle(float angle, float length = 1)
    {
        return new vector(length * cos(angle), length * sin(angle));
    }

    static vector *fromAngles(float theta, float phi, float length = 1)
    {
        const auto cosPhi = cos(phi);
        const auto sinPhi = sin(phi);
        const auto cosTheta = cos(theta);
        const auto sinTheta = sin(theta);

        return new vector(
            length * sinTheta * sinPhi,
            -length * cosTheta,
            length * sinTheta * cosPhi);
    }

    static vector *random2D()
    {
        return vector::fromAngle(randFloat() * TWO_PI);
    }

    static vector *random3D()
    {
        const auto angle = randFloat() * TWO_PI;
        const auto vz = randFloat() * 2 - 1;
        const auto vzBase = sqrt(1 - vz * vz);
        const auto vx = vzBase * cos(angle);
        const auto vy = vzBase * sin(angle);
        return new vector(vx, vy, vz);
    }

    static vector *add(vector v1, vector v2, vector *target = nullptr)
    {
        if (!target)
        {
            target = v1.copy();
        }
        else
        {
            target->set(v1);
        }
        target->add(v2);
        return target;
    }

    static vector *rem(vector v1, vector v2)
    {
        auto target = v1.copy();
        target->rem(v2);
        return target;
    }

    static vector *sub(vector v1, vector v2, vector *target = nullptr)
    {
        if (!target)
        {
            target = v1.copy();
        }
        else
        {
            target->set(v1);
        }
        target->sub(v2);
        return target;
    }

    static vector *mult(vector v1, vector v2, vector *target = nullptr)
    {
        if (!target)
        {
            target = v1.copy();
        }
        else
        {
            target->set(v1);
        }
        target->mult(v2);
        return target;
    }

    static vector *rotate(vector v, float a, vector *target = nullptr)
    {
        if (!target)
        {
            target = v.copy();
        }
        else
        {
            target->set(v);
        }
        target->rotate(a);
        return target;
    }

    static vector *div(vector v, float n, vector *target = nullptr)
    {
        if (!target)
        {
            target = v.copy();
        }
        else
        {
            target->set(v);
        }
        target->div(n);
        return target;
    }

    static float dot(vector v1, vector v2)
    {
        return v1.dot(v2);
    }

    static vector *cross(vector v1, vector v2)
    {
        return v1.cross(v2);
    }

    static float dist(vector v1, vector v2)
    {
        return v1.dist(v2);
    }

    static vector *lerp(vector v1, vector v2, float amt, vector *target = nullptr)
    {
        if (!target)
        {
            target = v1.copy();
        }
        else
        {
            target->set(v1);
        }
        target->lerp(v2, amt);
        return target;
    }

    static float mag(vector vecT)
    {
        auto x = vecT.x, y = vecT.y, z = vecT.z;
        auto magSq = x * x + y * y + z * z;
        return sqrt(magSq);
    }

    static vector *normalize(vector v, vector *target = nullptr)
    {
        if (!target)
        {
            target = v.copy();
        }
        else
        {
            target->set(v);
        }
        return target->normalize(v);
    }
};

EMSCRIPTEN_BINDINGS(vector_class)
{
    class_<vector>("vector")
        .constructor<float, float, float>()
        .property("x", &vector::x)
        .property("y", &vector::y)
        .property("z", &vector::z)
        .function("toString", &vector::toString)
        .function("set_vector", select_overload<vector *(vector)>(&vector::set), allow_raw_pointers())
        .function("set_array", select_overload<vector *(const val &)>(&vector::set), allow_raw_pointers())
        .function("set_float_float_float", select_overload<vector *(float, float, float)>(&vector::set), allow_raw_pointers())
        .function("copy", &vector::copy, allow_raw_pointers())
        .function("add_vector", select_overload<vector *(vector)>(&vector::add), allow_raw_pointers())
        .function("add_array", select_overload<vector *(const val &)>(&vector::add), allow_raw_pointers())
        .function("add_float_float_float", select_overload<vector *(float, float, float)>(&vector::add), allow_raw_pointers())
        .function("calculateRemainder2D", &vector::calculateRemainder2D, allow_raw_pointers())
        .function("calculateRemainder3D", &vector::calculateRemainder3D, allow_raw_pointers())
        .function("rem_vector", select_overload<vector *(vector)>(&vector::rem), allow_raw_pointers())
        .function("rem_array", select_overload<vector *(const val &)>(&vector::rem), allow_raw_pointers())
        .function("rem_float", select_overload<vector *(float)>(&vector::rem), allow_raw_pointers())
        .function("rem_float_float", select_overload<vector *(float, float)>(&vector::rem), allow_raw_pointers())
        .function("rem_float_float_float", select_overload<vector *(float, float, float)>(&vector::rem), allow_raw_pointers())
        .function("mult_vector", select_overload<vector *(vector)>(&vector::mult), allow_raw_pointers())
        .function("mult_array", select_overload<vector *(const val &)>(&vector::mult), allow_raw_pointers())
        .function("mult_float", select_overload<vector *(float)>(&vector::mult), allow_raw_pointers())
        .function("mult_float_float", select_overload<vector *(float, float)>(&vector::mult), allow_raw_pointers())
        .function("mult_float_float_float", select_overload<vector *(float, float, float)>(&vector::mult), allow_raw_pointers())
        .function("div_vector", select_overload<vector *(vector)>(&vector::div), allow_raw_pointers())
        .function("div_array", select_overload<vector *(const val &)>(&vector::div), allow_raw_pointers())
        .function("div_float", select_overload<vector *(float)>(&vector::div), allow_raw_pointers())
        .function("div_float_float", select_overload<vector *(float, float)>(&vector::div), allow_raw_pointers())
        .function("div_float_float_float", select_overload<vector *(float, float, float)>(&vector::div), allow_raw_pointers())
        .function("magSq", &vector::magSq)
        .function("mag", select_overload<float()>(&vector::mag))
        .function("dot_vector", select_overload<float(vector)>(&vector::dot))
        .function("dot_float_float_float", select_overload<float(float, float, float)>(&vector::dot))
        .function("cross", select_overload<vector *(vector)>(&vector::cross), allow_raw_pointers())
        .function("dist", select_overload<float(vector)>(&vector::dist))
        .function("normalize", select_overload<vector *()>(&vector::normalize), allow_raw_pointers())
        .function("limit", &vector::limit, allow_raw_pointers())
        .function("setMag", &vector::setMag, allow_raw_pointers())
        .function("heading", &vector::heading)
        .function("setHeading", &vector::setHeading, allow_raw_pointers())
        .function("rotate", select_overload<vector *(float)>(&vector::rotate), allow_raw_pointers())
        .function("angleBetween", &vector::angleBetween)
        .function("lerp_vector_float", select_overload<vector *(vector, float)>(&vector::lerp), allow_raw_pointers())
        .function("lerp_float_float_float_float", select_overload<vector *(float, float, float, float)>(&vector::lerp), allow_raw_pointers())
        .function("reflect", &vector::reflect, allow_raw_pointers())
        .function("array", &vector::array)
        .function("equals_vector", select_overload<bool(vector)>(&vector::equals))
        .function("equals_array", select_overload<bool(const val &)>(&vector::equals))
        .function("equals_float_float_float", select_overload<bool(float, float, float)>(&vector::equals))
        .class_function("fromAngle", &vector::fromAngle, allow_raw_pointers())
        .class_function("fromAngles", &vector::fromAngles, allow_raw_pointers())
        .class_function("random2D", &vector::random2D, allow_raw_pointers())
        .class_function("random3D", &vector::random3D, allow_raw_pointers())
        .class_function("add", &vector::add, allow_raw_pointers())
        .class_function("rem", &vector::rem, allow_raw_pointers())
        .class_function("sub", &vector::sub, allow_raw_pointers())
        .class_function("mult", &vector::mult, allow_raw_pointers())
        .class_function("rotate", &vector::rotate, allow_raw_pointers())
        .class_function("div", &vector::div, allow_raw_pointers())
        .class_function("dot", &vector::dot, allow_raw_pointers())
        .class_function("cross", &vector::cross, allow_raw_pointers())
        .class_function("dist", &vector::dist, allow_raw_pointers())
        .class_function("lerp", &vector::lerp, allow_raw_pointers())
        .class_function("mag", &vector::mag, allow_raw_pointers())
        .class_function("normalize", &vector::normalize, allow_raw_pointers());
}