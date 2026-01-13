const doGame = (() =>{

	function genRandInput (len) {

		let randLetter = () => "rps".split("")[Math.floor(Math.random() * 2.99)];
		let res = "";
		for (let i = 0; i < len; i ++) {
			res += `${randLetter()}-${randLetter()}:`
		}
		return res;
	}

	// start with a non-empty record so that the AI can have a full input
	let record = genRandInput(8); // record of past games
	let playerWins = 0; // num playerWins
	let losses = 0; // num losses

	let newTrainingData = {};
	const allNewTrainingData = [];

	function findAiChoice () {
		const _input = record.slice(0, -1).split(":"); // slice off trailing ":"
			
		if (_input.length < inputLength) {
			const ind = Math.floor(Math.random() * 2.99);
			return {letter: "rps"[ind], ind};
		};

		// store input for the new data that will be used for training 
		newTrainingData = copyObj(trainingData.parseData(record.slice(-4 * inputLength, -1))[0]);

		const aiOut = net.run(newTrainingData.input); // use that data to determine the AI's response to the player's PAST actions

		const aiInd = (net.getChoiceFromOutput(aiOut) + 1) % 3;

		return {letter: "rps".split("")[aiInd], ind: aiInd};
	}

	return function (playerInput) {
		
		const aiChoice = findAiChoice();

		let playerInd = {r:0,p:1,s:2}[playerInput];
		let aiInd = aiChoice.ind;

		// update the game record
		record += `${playerInput}-${aiChoice.letter}:`;

		let winner = 0; // 0 = ai, 1 = player, 2 = tie

		// get results
		if (playerInd === (aiInd + 1) % 3) {
			winner = 1;
			playerWins ++;
		} else if (playerInd === aiInd) {
			winner = 2;
		} else {
			losses ++;
		}

		if (newTrainingData.input) {
			net.retrainSelf (record.slice(0, -1));
		}
		
		return {record, playerWins, aiWins: losses, winner};
	}
})();