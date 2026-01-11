
function setup() {
    createCanvas(600, 600); // canvas if u couldnt tell
    frameRate(Infinity); // UNLIMITEDDDD

    const canvasContainer = document.querySelector("main");
	canvasContainer.style.textAlign = "center";
}

let record = "";

function handleGame (input) {
	const game = doGame(input);

	record = game.record;

	background(240);

	textSize(40);
	textFont('Impact');
	fill(30);
	textAlign(LEFT, TOP);

	let options = "rock.paper.scissors".split(".");
	let inds = {r:0,p:1,s:2};

	console.log (" ");
	console.log (`you: ${record[record.length - 4]} ai: ${record[record.length - 2]}`)
	console.log ("AI wins,YOU win,TIE".split(",")[game.winner]);
	if (game.playerWins + game.aiWins > 0) console.log (`winrate ${(game.playerWins/(game.playerWins + game.aiWins) * 100).toFixed(2)}%`);

	text (`YOU choose: ${options[inds[record[record.length - 4]]]}`, 20, 20);
	text (`AI chooses: ${options[inds[record[record.length - 2]]]}`, 20, 80);

	text ("AI wins,YOU win,TIE".split(",")[game.winner], 20, 140);

	if (game.playerWins + game.aiWins > 0) text (`winrate ${(game.playerWins/(game.playerWins + game.aiWins) * 100).toFixed(2)}%`, 20, 200)
}


// user input

document.addEventListener("keydown", function (e) {

	if ("KeyR,KeyP,KeyS".split(",").includes(e.code)) {
		handleGame({KeyR:"r",KeyP:"p",KeyS:"s"}[e.code]);
	} else {
		console.log (record.slice(0, -1));
	}
	
});

function draw () {
	// background(240);
};


