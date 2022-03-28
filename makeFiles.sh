touchdir() { mkdir -p "$(dirname "$1")" && touch "$1" ; }
for file in $(find ../p5.js/src -name '*.js')
do
    touchdir $(echo $file | sed 's/..\/p5.js/./g' | sed 's/.js/.ts/g')
    touchdir $(echo $file | sed 's/..\/p5.js/./g' | sed 's/.js/.cpp/g')
done