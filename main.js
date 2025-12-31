
const copyObj = obj => JSON.parse(JSON.stringify(obj));

const trainingData = (() => {

	// player-bot:player-bot
	const rawData = "r-s:r-s:r-s:r-s:r-s";
	
	// convert the games data into arrays
	const gamesData = (() => {
		const gamesData = rawData.split("|");
		for (const i in gamesData) {
			gamesData[i] = gamesData[i].split(":");
			for (const j in gamesData[i]) {
				gamesData[i][j] = gamesData[i][j].split("-");
			}
		}
		return gamesData})();

	const dataChunks = (() => {
		const dataChunks = [];
		for (let i in gamesData) {
			for (let j = 5; j <= gamesData[i].length; j ++) {

				dataChunks.push(copyObj(gamesData[i].slice(j - 5, j)));
				dataChunks[dataChunks.length - 1] = {
					"input": copyObj(dataChunks[dataChunks.length - 1].slice(0, -1)),
					"expected": copyObj(dataChunks[dataChunks.length -1][4][0]),
				}

			}
		}
		return dataChunks;})();

	return dataChunks;
})();

const NeuralNet = (() => {

const sigmoid = value => 1/(1 + Math.pow(Math.E, -value));

const activation = sigmoid; // we can choose different activation functions later

const matrix = (rows, columns) => {
	let arr = new Array(rows).fill([]);

	for(const i in arr) {arr[i] = new Array(columns).fill(0)};

	return arr;
};

const vecMat = (vector, matrix) => {

	if (vector.length !== matrix[0].length) return false;

    let output = Array(matrix.length).fill(0);

    for (let i = 0; i < output.length; i ++) {        
        for (let j = 0; j < matrix.length; j ++) {
            output[i] += vector[j] * matrix[j][i]; 
        }
    }
    
    return output;
};

const randomizeNestedArr = (array, minAlter = 0, maxAlter = 1) => {

    let arr = JSON.parse(JSON.stringify(array));

    for (let i in arr) {
        if (typeof arr[i] === "number") {
            arr[i] = arr[i] + Math.random() * (maxAlter - minAlter) + minAlter;
        } else {
            arr[i] = randomizeNestedArr(arr[i], minAlter, maxAlter);
        }
    }

    return arr;
}

class NeuralNet {
	constructor (sizesOfLayers) {

		this.sizes = sizesOfLayers;

		// initialize randomized matrices that will be altered in training.
		this.weights = (() => {
			const arr = [];

			// all other hidden layers
			for (let i = 0; i < this.sizes.length - 1; i ++) {
				arr.push(matrix(this.sizes[i + 1], this.sizes[i]))
			}

			return randomizeNestedArr(arr, -2, 2); 
		})();

		this.bias = (() => {
			const arr = [];

			//hidden layers
			for (let i = 1; i <= this.sizes.length; i ++) {
				arr.push(new Array(this.sizes[i]).fill(0));
			}

			return randomizeNestedArr(arr, -5, 5);
		})();
	}

	run (input) {
		input = copyObj(input);

		for (let i in this.weights) {
			input = vecMat (input, this.weights[i]);
			let j = 0;
			input = input.map((value) => {j ++; return value + this.bias[i][j - 1]});
			input = input.map(activation);
		}

		return input;
	}

	getCost (data) {

		const input = (() => {
			const input = [];

			for (let i in data.input) {
				for (let j in data.input[i]) {
					input.push( (data.input[i][j] === "r" ? 1 : 0), 
								(data.input[i][j] === "p" ? 1 : 0), 
								(data.input[i][j] === "s" ? 1 : 0));
				}
			}

			return input;})();
		const expected = (() => {
			return [(data.expected === "r" ? 1 : 0), 
					(data.expected === "p" ? 1 : 0), 
					(data.expected === "s" ? 1 : 0)]})();
		const aiResult = (() => {
			return this.run(input)})();

		const cost = (expected[0] - aiResult[0]) * (expected[0] - aiResult[0]) + (expected[1] - aiResult[1]) * (expected[1] - aiResult[1]) + (expected[1] - aiResult[1]) * (expected[1] - aiResult[1]);

		return {
			"cost": cost,
			// diffNeeded: 
		};
	}
}

return NeuralNet;
})();

// three inputs per player * 4 games = 24 inputs
let test = new NeuralNet([24, 10, 10, 3]);

// console.log (test.weights, test.bias);
console.log (test.run(new Array(24).fill(0)));

test.getCost (trainingData[0]);