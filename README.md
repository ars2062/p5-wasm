
![npm bundle size](https://img.shields.io/bundlephobia/min/p5-wasm-core) ![npm](https://img.shields.io/npm/dw/p5-wasm-core) ![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hw/p5-wasm-core) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/ars2062/p5-wasm)


<div id="top"></div>

# P5 wasm

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
a wasm core for [p5.js](https://github.com/processing/p5.js/) library written in C++ using [emscripten](https://emscripten.org/) for better speed in calculations.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Webpack](https://webpack.js.org/)
* [Emscripten](https://emscripten.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* Node.js
  Please download and install the latest version of Node.js from this [link](https://nodejs.org/en/download/)
* Emscripten
  ```sh
  # Get the emsdk repo
  git clone https://github.com/emscripten-core/emsdk.git

  # Enter that directory
  cd emsdk
  
  # Fetch the latest version of the emsdk (not needed the first time you clone)
  git pull

  # Download and install the latest SDK tools.
  ./emsdk install latest

  # Make the "latest" SDK "active" for the current user. (writes .emscripten file)
  ./emsdk activate latest

  # Activate PATH and other environment variables in the current terminal
  source ./emsdk_env.sh
  ```
  for more information please refer to [this](https://emscripten.org/docs/getting_started/downloads.html) link

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ars2062/p5-wasm.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
4. make a `.env` file containing
   ```sh
   MODE=development
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
for using this package please add the script tag after where you added your p5.js script tag and before your script.js file like so:
```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5-wasm-core@0.0.4/dist/p5.wasm.js"></script>
    <script src="sketch.js"></script>
  </head>
  <body>
    <main>
    </main>
  </body>
</html>
```
and inside your sketch file you need to wait for wasm file to load like so:
```javascript
// Global mode
// This is to stop global mode from starting automatically
p5.instance = true;

// Write your p5 sketch as usual
function setup(){
	//...
}

function draw(){
	//...
}

// Wait for promise to resolve then start p5 sketch
window.wasmReady.then(() => {
	new p5();
});
```
```javascript
// Instance mode
// Write your p5 sketch as usual
const sketch = function(p){
	p.setup = function(){
		//...
	};

	p.draw = function(){
		//...
	}
};

// Wait for promise to resolve then start p5 sketch
window.wasmReady.then(() => {
	new p5(sketch);
});
```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/ars2062/p5-wasm/blob/master/LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Arshia Moghaddam - [linkedin](https://www.linkedin.com/in/arshia-moghaddam-9357081a4/) - ars2062@gmail.com

Project Link: [https://github.com/ars2062/p5-wasm](https://github.com/ars2062/p5-wasm)

<p align="right">(<a href="#top">back to top</a>)</p>
