

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

		const iconPos = {
			r: [10, 430, 180, 160],
			p: [210, 440, 180, 160],
			s: [410, 430, 180, 160]
		};

		const origIconPos = copyObj(iconPos);

		function getCurSelected () {

			let baseColor = get(1, 500).join(",");

			if (mouseY < 420) return false;
			if (mouseX < 200 && get(mouseX, mouseY).join(",") !== baseColor) return "r";
			if (mouseX < 400 && get(mouseX, mouseY).join(",") !== baseColor) return "p";
			if (get(mouseX, mouseY).join(",") !== baseColor) return "s";
			return false;
		}

		function icons () {

			// im using get() based colision detection because im lazy so I have to draw the icons before and after
			// collision testing
			image(images.rock, iconPos.r[0], iconPos.r[1], iconPos.r[2], iconPos.r[3]);
			image(images.paper, iconPos.p[0], iconPos.p[1], iconPos.p[2], iconPos.p[3]);
			image(images.scisors, iconPos.s[0], iconPos.s[1], iconPos.s[2], iconPos.s[3]);

			let curSelected = getCurSelected();

			function lerpIconPos (icon, selected) {

				for (let i = 0; i < iconPos[icon].length; i ++) {
					let val = origIconPos[icon][i]

					if (selected) {
						val += 10 * utils.sign(i - 1.1);
						if (utils.sign(i - 1.1) > 0) val += 10;
						
					}

					iconPos[icon][i] = lerp (iconPos[icon][i], val, 0.2);

				}
			}
			
			lerpIconPos ("r", (curSelected === "r"));
			lerpIconPos ("p", (curSelected === "p"))
			lerpIconPos ("s", (curSelected === "s"))

			image(images.rock, iconPos.r[0], iconPos.r[1], iconPos.r[2], iconPos.r[3]);
			image(images.paper, iconPos.p[0], iconPos.p[1], iconPos.p[2], iconPos.p[3]);
			image(images.scisors, iconPos.s[0], iconPos.s[1], iconPos.s[2], iconPos.s[3]);
		}

		return function () {
			background (250);
			
			stroke(30);
			strokeWeight(10);
			fill(0, 20);

			rect(-50, 400, 700, 450);

			noStroke();
			textFont('Rowdies');
			
			let options = "rock.paper.scissors".split(".");
			let inds = {r:0,p:1,s:2};

			textSize(100);

			push();
			textAlign(LEFT, TOP);
			fill (80, 80, 220);
			text ("YOU", 20, 20);
			pop();

			push();
			textAlign(RIGHT, TOP);
			fill (220, 80, 80);
			text ("BOT", 580, 20);
			pop();

			// draw and handle interactions with rock, paper, and scisor icons
			icons();
		}
	})(),
};

let then = Date.now();

draw = function() {
	scenes.runCur();
	then = Date.now();
};
