require('lodash');
import Benchmark from 'benchmark'
import p5 from 'p5';

new Benchmark('test', ()=>{
    console.log('test');
    
},  {
    onComplete(res){
        console.log(res); 
    }
}).run()