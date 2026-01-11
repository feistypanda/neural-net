const doGame = (() =>{

	let record = ""; // record of past games
	let wins = 0; // num wins
	let losses = 0; // num losses

	let newTrainingData = {};
	const allNewTrainingData = [];

	function findAiChoice () {
		const _input = record.slice(0, -1).split(":"); // slice off trailing ":"
			
		if (_input.length < 4) {
			const ind = Math.floor(Math.random() * 2.99);
			return {letter: "rps"[ind], ind};
		};

		// store input for the new data that will be used for training 
		newTrainingData = copyObj(trainingData.parseData(record.slice(-16, -1))[0]);

		const aiOut = net.run(newTrainingData.input); // use that data to determine the AI's response to the player's PAST actions

		const aiInd = (net.getChoiceFromOutput(aiOut) + 1) % 3;

		return {letter: "rps".split("")[aiInd], ind: aiInd};
	}

	function getRandArrElls (arr, numElls) {
		let res = [];
		let copy = copyObj(arr);
		for (let i = 0; i < numElls; i ++) {
			let ind = Math.floor(Math.random() * (copy.length - 0.01))
			res.push(copy[ind]);
			copy.splice(ind, 1);
		}
		return res;
	}

	function retrainAi () {

		allNewTrainingData.push (newTrainingData);

		let usingData = allNewTrainingData.slice(-60);
		usingData = usingData.concat(getRandArrElls(trainingData.data, usingData.length)); 

		for (let i = 0; i < 10; i ++) net.updateForBatch(usingData, 1);
	};

	return function (playerInput) {
		
		const aiChoice = findAiChoice();

		let playerInd = {r:0,p:1,s:2}[playerInput];
		let aiInd = aiChoice.ind;

		let winner = 0; // 0 = ai, 1 = player, 2 = tie

		// get results
		if (playerInd === (aiInd + 1) % 3) {
			winner = 1;
			wins ++;
		} else if (playerInd === aiInd) {
			winner = 2;
		} else {
			losses ++;
		}
		
		newTrainingData.expected = (() => {const arr = [0, 0, 0]; arr[playerInd] = 1; return arr})();

		if (newTrainingData.input) {
			retrainAi();
		}
		
		// update the game record
		record += playerInput + "-" + aiChoice.letter + ":";

		return {record, playerWins: wins, aiWins: losses, winner};
	}
})();