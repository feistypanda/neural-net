

function setup () {

	createCanvas (600, 600);
	frameRate(Infinity); // why not

	// center the canvas
	const container = document.querySelector("main");
	container.style.textAlign = "center";

	textAlign(CENTER, CENTER);
	angleMode = 'radians';
}

let lastGameData = {}; // data from the last game
// a string holding a record of the games played.
let record = "";

// handle playing a game on user input
(() => {

function handleGame (input) {

	// get info like the ai response and winner for a game with a certain player input
	const game = doGame(input);
	lastGameData = game;

	record = game.record;

	background(240);

	// everything that follows in this function is for logging/displaying the results of the game

	console.log (`\nyou: ${record[record.length - 4]} ai: ${record[record.length - 2]}\n${"AI wins,YOU win,TIE".split(",")[game.winner]}`);
	console.log (`winrate: ${game.winrate}%, recent winrate: ${game.winrateRecent}%`);
}

// user input
document.addEventListener("keydown", function (e) {

	if ("KeyR,KeyP,KeyS".split(",").includes(e.code) && scenes.current === "main") {
		// run the game if the player presses the r, p, or c key
		handleGame({KeyR:"r",KeyP:"p",KeyS:"s"}[e.code]);
	} else {
		// otherwise log the data from the game to get stolen for training the network
		console.log (record.slice(0, -1));
		console.log (`${record.split("").length/4} games`);
	}
	
});
})();

const scenes = {
	current: "loading",
	runCur () {this[this.current]()},

	transition: (() => {

		let fromImg;
		let to = "";
		let amt = 0;
		let speed = 1;

		return function (_to, img, _speed) {

			amt += (Date.now() - then)/1000 * speed;
			
			if (_to) {
				to = _to;
				fromImg = img;
				scenes.current = "transition";
				amt = 0;

				if (_speed && _speed > 0) speed = _speed;
			}

			if (amt < 0.5) {
				image(fromImg, 0, 0, 600, 600);
			} else if (amt < 1){
				scenes[to]();
			} else {
				scenes.current = to;
			}

			fill(200);
			noStroke();
			rect(-600 + 1200 * utils.anim1(amt), 0, 600, 600);
		}
	})(),

	loading: (() => {

		let curInd = 0;
		let keys = Object.keys(images);

		return function () {
			background (240);

			// replace the functions in the image objects with what they return;
			images[keys[curInd]] = images[keys[curInd]]();

			let txt = (() => {

				if (curInd >= keys.length - 1) return "LOADED!";

				let res = "LOADING";
				for (let j = 0; j <= curInd / 2; j ++) {
					res += "."
				}
				return res;
			})();

			
			textSize(100);
			textFont('Anton');
			fill(30);
			textAlign(CENTER, CENTER);

			text (txt, 300, 250);

			curInd ++;

			if (curInd >= keys.length) {
				scenes.current = "main";
			}
		}
	})(),

	training: (() => {
		
		let i = -1;
		let start;

		return function () {

			background (240);
			
			if (i <= -1) {
				start = Date.now ();
				i ++
			} else if (i < 15) {
				net.doMiniBatchs (trainingData.data, 150, 2);
				i ++
			}

			let txt = (() => {

				if (i >= 15) return "TRAINED!";

				let res = "TRAINING";
				for (let j = 0; j <= i / 2; j ++) {
					res += "."
				}
				return res;
			})();

			
			textSize(100);
			textFont('Anton');
			fill(30);
			textAlign(CENTER, CENTER);

			text (txt, 300, 250);

			if (i >= 15) {
				console.log (`training time: ${Date.now() - start}ms`);
				scenes.transition ("main", get(), 0.7);
			}
		}	
	})(),

	main: (() => {
		return function () {
			background (250);
			
			stroke(30);
			strokeWeight(12);
			fill(0, 20);

			rect(-50, 420, 700, 450);

			noStroke();
			textFont('Rowdies');
			
			let options = "rock.paper.scissors".split(".");
			let inds = {r:0,p:1,s:2};

			textSize(100);

			// push();
			// textAlign(LEFT, TOP);
			// fill (80, 80, 220);
			// text ("YOU", 20, 20);
			// pop();

			// push();
			// textAlign(RIGHT, TOP);
			// fill (220, 80, 80);
			// text ("BOT", 580, 20);
			// pop();

			image(images.rock, 10, 430, 180, 160);
			image(images.paper, 210, 430, 180, 160);

			// text (`YOU choose: ${options[inds[record[record.length - 4]]]}`, 20, 20);
			// text (`AI chooses: ${options[inds[record[record.length - 2]]]}`, 20, 80);

			// text ("AI wins,YOU win,TIE".split(",")[lastGameData.winner], 20, 140);
			
			// text (`winrate: ${lastGameData.winrateRecent}%`, 20, 200)


		}
	})(),
};

let then = Date.now();

draw = function() {
	scenes.runCur();
	then = Date.now();
};
