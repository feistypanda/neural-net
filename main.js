
// define the setup function that p5.js will call
function setup() {
    createCanvas(600, 600); // canvas if u couldnt tell
    frameRate(Infinity); // why not

    // align the canvas in the center of the screen
    const canvasContainer = document.querySelector("main");
	canvasContainer.style.textAlign = "center";
}

(() => {
// a string holding a record of the games played.
let record = "";

function handleGame (input) {

	// get info like the ai response and winner for a game with a certain player input
	const game = doGame(input);

	record = game.record;

	background(240);

	// everything that follows in this function is for logging/displaying the results of the game

	console.log (`\nyou: ${record[record.length - 4]} ai: ${record[record.length - 2]}\n${"AI wins,YOU win,TIE".split(",")[game.winner]}`);
	console.log (`winrate: ${game.winrate}%, recent winrate: ${game.winrateRecent}%`);

	textSize(40);
	textFont('Impact');
	fill(30);
	textAlign(LEFT, TOP);

	let options = "rock.paper.scissors".split(".");
	let inds = {r:0,p:1,s:2};

	text (`YOU choose: ${options[inds[record[record.length - 4]]]}`, 20, 20);
	text (`AI chooses: ${options[inds[record[record.length - 2]]]}`, 20, 80);

	text ("AI wins,YOU win,TIE".split(",")[game.winner], 20, 140);
	
	text (`winrate: ${game.winrateRecent}%`, 20, 200)
}

// user input
document.addEventListener("keydown", function (e) {

	if ("KeyR,KeyP,KeyS".split(",").includes(e.code)) {
		handleGame({KeyR:"r",KeyP:"p",KeyS:"s"}[e.code]);
	} else {
		console.log (record.slice(0, -1));
	}
	
});
})();

const keys = [];

function keyPressed () {
	keys[key] = true;
}

function keyReleased () {
	keys[key] = false;
}

const scenes = {
	current: "training",
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
			textFont('Impact');
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
			background (240);
		}
	})(),
};

let then = Date.now();

function draw () {
	scenes.runCur();
	then = Date.now();
};


