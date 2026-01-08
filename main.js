
const copyObj = obj => JSON.parse(JSON.stringify(obj));
const stringify = JSON.stringify;

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
	const sigmoidPrime = value => sigmoid(value) * (1 - sigmoid(value));

	const activation = sigmoid; // we can choose different activation functions later
	const activationPrime = sigmoidPrime;

	const matrix = (rows, columns) => {
		let arr = new Array(rows).fill([]);

		for(const i in arr) {arr[i] = new Array(columns).fill(0)};

		return arr;
	};

	const transpose = (matrix) => {
		if (matrix.length === 1 && typeof matrix[0] === "number") return matrix;

		const transposed = [];

		if (typeof matrix[0] === "number") {
			for (const i of matrix) {
				transposed.push([i]);
			}

			return transposed;
		}

	    for (const i in matrix[0]) {
	        transposed.push([]);
	        for (const j in matrix) {
	            transposed[i].push(matrix[j][i]);
	        }
	    }

	    return transposed;
	}; // swaps rows and columns

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

	
	const matMat = (mat1, mat2) => {
		const m1 = mat1.length;
		const m2 = mat1[0].length;
		const n1 = mat2.length;
		const n2 = mat2[0].length;

		let x, i, j;
	    let res = new Array(m1);
	    for (i = 0; i < m1; i++)
	        res[i] = new Array(n2);
	        
	    for (i = 0; i < m1; i++) 
	    {
	        for (j = 0; j < n2; j++) 
	        {
	            res[i][j] = 0;
	            for (x = 0; x < m2; x++) 
	            {
	                res[i][j] += mat1[i][x] * mat2[x][j];
	            }
	        }
	    }

	    return res;
	};

	// const matMat = (mat1, mat2) => {
	// 	const matRows1 = mat1.length;
	// 	const matColums1 = mat1[0].length;
	// 	const matRows2 = mat2.length;
	// 	const matColums2 = mat2[0].length;

	// };

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

		static generateWeights (sizes) {
			const arr = [];

			// all other hidden layers
			for (let i = 1; i < sizes.length; i ++) {
				arr.push(matrix(sizes[i], sizes[i - 1]))
			}

			return arr; 
		}

		static generateBias (sizes) {
			const arr = [];

			//hidden layers
			for (let i = 1; i < sizes.length; i ++) {
				arr.push(new Array(sizes[i]).fill([0]));
			}

			return arr;
		}

		constructor (sizesOfLayers) {

			this.sizes = sizesOfLayers;
			this.numLayers = this.sizes.length;

			// initialize randomized matrices that will be altered in training.
			this.weights = randomizeNestedArr(NeuralNet.generateWeights(this.sizes), -2, 2);

			this.bias = randomizeNestedArr(NeuralNet.generateBias(this.sizes), -5, 5);
		}

		run (_input, getActivations) {

			let input = copyObj(_input);

			if (typeof input.input === "object") input = this.parseInputData(input);

			const activations = [transpose(input)];
			const zs = [];

			for (let i in this.weights) {

				input = vecMat (input, this.weights[i]).map((value, ind) => {return value + this.bias[i][ind][0]});
				if (getActivations)  zs.push(transpose(input));
				input = input.map(activation);
				if (getActivations) activations.push(transpose(input));
			}

			if (getActivations) return {output: input, activations, zs};

			return input;
		}

		parseInputData (_data) {

			let data = copyObj(_data);

			if (data.input === undefined) {
				data = {input:data};
			}

			let input = [];

			if (typeof input[0] === "string") {
				for (let i in data.input) {
					for (let j in data.input[i]) {
						input.push( (data.input[i][j] === "r" ? 1 : 0), 
									(data.input[i][j] === "p" ? 1 : 0), 
									(data.input[i][j] === "s" ? 1 : 0));
					}
				}
			} else {
				input = data.input;
			}

			return input;
		}

		getNeededDiff(expected, aiResult) {
			return expected.map((ell, ind) => ell - aiResult[ind][0]);
		}

		getCost (data, _aiResult) {


			const expected = (() => {
				if (typeof data.expected === "object" && data.expected[0] !== undefined) return data.expected;

				return [(data.expected === "r" ? 1 : 0), 
						(data.expected === "p" ? 1 : 0), 
						(data.expected === "s" ? 1 : 0)]})();
			const aiResult = _aiResult || this.run(data);

			const cost = (() => {
				let total = 0;
				for (let i in expected) {
					total += Math.pow((expected[i] - aiResult[i]), 2)
				}
				return total;
			})()

			return cost;
		}

		getGradient (data) {

			const nablaW = NeuralNet.generateWeights(this.sizes); // changes needed for weights
			const nablaB = NeuralNet.generateBias(this.sizes); // changes needed for biases

			// feed forward
			const feedForeward = this.run (data.input, true);
			
			const activations = feedForeward.activations;
			const zs = feedForeward.zs;

			// get the cost partial derivative
			const costDer = transpose(this.getNeededDiff(data.expected, activations[activations.length - 1]));

			// backward pass
			
			// last layer
			let delta = transpose(costDer.map((ell, ind) => ell[0] * activationPrime(zs[zs.length - 1][ind][0])));
			nablaB[nablaB.length - 1] = [...delta]; // i googled it and this is a faster way of shallow copy than what i had previosly (my copyObj func) but I am only gonna use it for arrays cuz I feel like it
			nablaW[nablaW.length - 1] = matMat(delta, transpose(activations[activations.length - 2]));

			// previos layers, looping through from 2nd to last to first, this happens because all of the arr readings are arr[arr.length - i]
			for (let i = 2; i < this.numLayers; i ++) {
				
				const z = zs[zs.length - i];
				const prime = z.map(x => [activationPrime(x[0])]);

				delta = matMat(transpose(this.weights[this.weights.length - i + 1]), delta);
				delta = delta.map((x, i) => [x[0] * prime[i][0]]);

				nablaB[nablaB.length - i] = [...delta];
				nablaW[nablaW.length - i] = matMat(delta, transpose(activations[activations.length - i - 1]));
			}

			return {nablaB, nablaW};

		}
	}

	return NeuralNet;
})();

// 3 inputs/player * 2 players * 4 games = 24 inputs
// 3 possible predictions = 3 outputs
// hidden layers are arbitrary.
let net = new NeuralNet([24, 10, 10, 3]);

let testData = [{input:[0, 1, 0, 1], expected:[1, 0]}, {input:[1], expected:[1]}, {input:[0.5], expected:[0.5]}, {input:[0.2], expected:[0.2]}];

let testNet = new NeuralNet([4, 3, 3, 2]);

// console.log (`weights: ${stringify(testNet.bias)}, bias: ${stringify(testNet.bias)}`);

// console.log (`runOutput: ${stringify(testNet.run(testData[0], true))}`);

// console.log(`cost: ${stringify(testNet.getCost (testData[0]))}`);

// console.log (testNet.run(testData[0], true));

const grad = testNet.getGradient(testData[0])
console.log ("\n\n weights");
console.log(grad.nablaW);
console.log ("\n\n bias");
console.log(grad.nablaB);



