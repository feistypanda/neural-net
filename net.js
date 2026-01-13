

const inputLength = 8;

const trainingData = (() => {

	// convert the games data into arrays
	function parseData (rawData) {

		const gamesData = (() => {
		const gamesData = rawData.split("|");

		for (const i in gamesData) {
			gamesData[i] = gamesData[i].split(":");
			for (const j in gamesData[i]) {
				gamesData[i][j] = gamesData[i][j].split("-");
			}
		}
		return gamesData})();

		// seperate the data into chunks with 4 input matches and an expected output
		const dataChunks = (() => {

			const dataChunks = [];

			function gamesToArr (arr) {
				const input = [];
				for (let i in arr) {
					for (let j in arr[i]) {
						input.push( (arr[i][j] === "r" ? 1 : 0), 
									(arr[i][j] === "p" ? 1 : 0), 
									(arr[i][j] === "s" ? 1 : 0));
					}
				}
				return input;
			}

			for (let i in gamesData) {
				if (gamesData[i].length === inputLength) {
					dataChunks.push({input: gamesToArr(gamesData[i])});
				}

				for (let j = inputLength + 1; j <= gamesData[i].length; j ++) {

					const chunk = gamesData[i].slice(j - inputLength - 1, j);
					const input = gamesToArr(copyObj(chunk.slice(0, -1)));

					const expected = (() => {
						const letter = chunk[inputLength][0];
						return [
							letter === "r" ? 1:0,
							letter === "p" ? 1:0,
							letter === "s" ? 1:0,
						];
					})();

					dataChunks[dataChunks.length] = {
						input,
						expected,
					}

				}
			}
			return dataChunks;})();

		return dataChunks;
	}

	return {parseData, data: parseData(rawData)};
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
	
	// adapted from geeksforgeeks.org
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
	}; // mult two matricies

	const scalarMat = (s, mat) => {
		const res = [];
		for (const i in mat) {
			res.push ([]);
			for (const j in mat[i]) {
				res[i][j] = mat[i][j] * s;
			}
		}

		return res;
	}; // multiply all values in a matrix by a scalar

	const addMats = (mat1, mat2, sub) => {

		// make sure mats are the same size
		if (mat1.length !== mat2.length || mat1[0].length !== mat2[0].length) return false;

		const res = new Array(mat1.length);
		
		for (let i = 0; i < mat1.length; i ++) {
			res [i] = [];
			for (let j = 0; j < mat1[i].length; j++) {
			
				if (sub) {
					res[i][j] = mat1[i][j] - mat2[i][j];
				} else {
					res[i][j] = mat1[i][j] + mat2[i][j];
				};

			}
		}

		return res;
	} // add all of the values element by element

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

		getChoiceFromOutput (output) {
			let max = {val: 0, ind: -1};
			for (const i in output) {
				if (output[i] > max.val) {
					max.val = output[i];
					max.ind = i;
				}
			}
			return parseInt(max.ind, 10);
		}

		run (_input, getActivations) {

			let input = copyObj(_input);

			if (typeof _input.input === "object") input = copyObj(_input.input);

			const activations = [transpose(input)];
			const zs = [];

			for (let i in this.weights) {

				input = matMat (this.weights[i], transpose(input)).map(x => x[0]).map((value, ind) => {return value + this.bias[i][ind][0]});
				if (getActivations)  zs.push(transpose(input));
				input = input.map(activation);
				if (getActivations) activations.push(transpose(input));
			}

			if (getActivations) return {output: input, activations, zs};

			return input;
		}

		getNeededDiff(expected, aiResult) {
			return expected.map((ell, ind) => ell - aiResult[ind][0]);
		}

		getCost (data, _aiResult) {


			const expected = copyObj(data.expected);
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

		getAvgCost (dataSet) {
			let res = 0;
			for (const i of dataSet) {
				res += this.getCost(i);
			}
			return res / dataSet.length
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

		updateForBatch (batch, learningRate) {

			let [nablaB, nablaW] = [NeuralNet.generateBias(this.sizes), NeuralNet.generateWeights(this.sizes)];

			for (const i of batch) {
				const deltaNabla = this.getGradient (i);
				const [deltaNablaW, deltaNablaB] = [deltaNabla.nablaW, deltaNabla.nablaB];
				
				for (const j in nablaW) {
					nablaW[j] = addMats(nablaW[j], deltaNablaW[j]);
					nablaB[j] = addMats(nablaB[j], deltaNablaB[j]);
				}
			}

			for (const i in this.weights) {
				this.weights[i] = addMats (this.weights[i], scalarMat((learningRate/batch.length), nablaW[i]));
				const ratedNablaB = nablaB[i].map((ell, ind) => ell * (learningRate/batch.length));
				this.bias[i] = this.bias[i].map((ell, ind) => [ell[0] + ratedNablaB[ind]]);
			}

			return "";
		}

		doMiniBatchs (allData, batchSize, learningRate) {
			for (let i = 0; i < allData.length; i += batchSize) {
				const curBatch = allData.slice(i, i + batchSize);
				this.updateForBatch(curBatch, learningRate);
			}
		}

		retrainSelf (_data) {
			let data = copyObj(_data);
			if (typeof data === "string") data = trainingData.parseData(data);

			let usingData = data.concat(utils.getRandArrElls(trainingData.data, data.length)); 

			for (let i = 0; i < 10; i ++) this.updateForBatch(usingData, 1);
		}
	}

	return NeuralNet;
})();

const data = trainingData.data;

const net = new NeuralNet([6 * inputLength, 15, 15, 3]);

// innitial training
(() => {
console.log (net.getAvgCost(data));

for (let i = 0; i < 15; i ++ ) {net.doMiniBatchs (data, 150, 2)}; 

console.log (net.getAvgCost(data));})();
