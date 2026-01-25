
let click = false;

function setup () {

	createCanvas (600, 600);
	frameRate(Infinity); // why not

	// center the canvas
	const container = document.querySelector("main");
	container.style.textAlign = "center";

	textAlign(CENTER, CENTER);
	angleMode = 'radians';
}

let lastGameData = {winner:1,playerWins:0,aiWins:0,ties:0,winrateRecent:0,}; // data from the last game
// a string holding a record of the games played.
let record = "";

// handle playing a game on user input
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
		// handleGame({KeyR:"r",KeyP:"p",KeyS:"s"}[e.code]);
	} else {
		// otherwise log the data from the game to get stolen for training the network
		console.log (record.slice(0, -1));
		console.log (`${record.split("").length/4} games`);
	}
	
});

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
				scenes.current = "training";
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
				console.log (JSON.stringify(net.weights));
				console.log (`training time: ${Date.now() - start}ms`);
				scenes.transition ("main", get(), 0.7);
			}
		}	
	})(),

	main: (() => {

		let visualization = 67;

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

			// handle the scisors as a bounding box because otherwise it can be difficult to click
			if (mouseX > 445 && mouseY > 420 && mouseX < 445 + 115 && mouseY < 420 + 170) return "s";
			return false;
		}

		function icons () {

			// im using get() based colision detection because im lazy so I have to draw the icons before and after
			// collision testing
			image(images.rock, iconPos.r[0], iconPos.r[1], iconPos.r[2], iconPos.r[3]);
			image(images.paper, iconPos.p[0], iconPos.p[1], iconPos.p[2], iconPos.p[3]);
			image(images.scisors, iconPos.s[0], iconPos.s[1], iconPos.s[2], iconPos.s[3]);

			let curSelected = getCurSelected();

			// logic to change sizes of icons
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
			
			// change the size of whichever icon is being hoverd over
			lerpIconPos ("r", (curSelected === "r"));
			lerpIconPos ("p", (curSelected === "p"))
			lerpIconPos ("s", (curSelected === "s"))

			// display newly enlarged/shrunken icons
			image(images.rock, iconPos.r[0], iconPos.r[1], iconPos.r[2], iconPos.r[3]);
			image(images.paper, iconPos.p[0], iconPos.p[1], iconPos.p[2], iconPos.p[3]);
			image(images.scisors, iconPos.s[0], iconPos.s[1], iconPos.s[2], iconPos.s[3]);

			// if clicking an icon then play the game
			if (click && curSelected) {
				handleGame (curSelected);
				updateVisualization(); // the ai has been retrained
				scenes.result (record[record.length - 2], record[record.length - 4]);
			}
		}

		function updateVisualization () {

			console.log ("ello");

			visualization.background(0, 0);

			let nodes = Array(net.sizes.length).fill(0).map((x, i) => Array(net.sizes[i]).fill(0));
        
			let weights = copyObj (net.weights);

	        let cull = 6;
	        
	        let maxWeight = Math.max(...weights.flat().flat().map((a) => Math.abs(a)));
	        
	        let diff = visualization.width/(nodes.length + 1);
	       
	        for (let i = 0; i < nodes.length; i ++) {
	            if (i === 0)  {
	                let yd = visualization.height/(min(nodes[i].length + 1, cull * 2 + 3));
	                for (let j = 0; j < nodes[i].length; j ++) {
	                    if (j >= nodes[i].length - cull) {
	                        nodes[i][j] = [diff * (i + 1), yd * (j + 1 - (nodes[i].length - cull * 2 - 2))];
	                    } else {
	                        nodes[i][j] = [diff * (i + 1), yd * (j + 1)];
	                    }
	                }
	            } else {
	                let yd = visualization.height/(min(nodes[i].length + 1));
	                for (let j = 0; j < nodes[i].length; j ++) {
	                    nodes[i][j] = [diff * (i + 1), yd * (j + 1)];
	                }
	            }    
	        }
	        
	        for (let i = 1; i < nodes.length; i ++) {
	            for (let j = 0; j < nodes[i].length; j ++) {
	                
	                for (let l in weights[i - 1][j]) {
	                    if (i < 2 && l > cull - 1 && l < weights[i - 1][j].length - cull) continue;
	                    
	                    let val = weights[i - 1][j][l];
	                    val /= maxWeight; // normalize the weight

	                    // apply style based on weight
	                    visualization.strokeWeight (abs(val) * 5);
	                    
	                    if (val < 0) {
	                        visualization.stroke(255 * val* -1, 50, 50, 200);
	                    } else {
	                        visualization.stroke(50, 50, 255 * val, 200);
	                    }
	                    
	                    // draw the weight
	                    visualization.line (nodes[i][j][0], nodes[i][j][1], nodes[i - 1][l][0], nodes[i - 1][l][1])
	                }
	                
	            }
	        }
	        
	        visualization.stroke (0);
	        visualization.strokeWeight (3);
	        visualization.fill (255);
	        for (let i = 0; i < nodes.length; i ++) {
	            for (let j = 0; j < nodes[i].length; j ++) {
	                if (i < 1 && j > cull - 1 && j < nodes[i].length - cull) continue;
	                visualization.ellipse (nodes[i][j][0], nodes[i][j][1], 10, 10);

	            }
	        }
	       
		}

		return function () {

			background (250);
			
			stroke(30);
			strokeWeight(10);
			fill(0, 20);

			rect(-50, 400, 700, 450);

			noStroke();
			textFont('Rowdies');
			
			textSize(100);
			textAlign(LEFT, TOP);

			const dat = lastGameData;

			// display the score at the top
			// if mouse is hovering, then display winrate

			if (mouseY > 100) {
				// start by getting width of each section of text

				const texts = [ [`${dat.playerWins}`, textWidth(`${dat.playerWins}`)],
								[`${dat.ties}`, textWidth(`${dat.ties}`)],
								[`${dat.aiWins}`, textWidth(`${dat.aiWins}`)]];

				const totalWidth = textWidth(`${texts[0][0]} - ${texts[1][0]} - ${texts[2][0]}`);

				let x = 300 - totalWidth / 2;
				for (let i in texts) {
					fill (...[[80, 80, 220], [100, 100, 100], [220, 80, 80]][i]);
					
					text (texts[i][0], x, 20);
					x += texts[i][1];

					fill (20);

					if (i !== "2") text (" - ", x, 13); x += textWidth (" - ");
				}
			} else {
				fill (80, 80, 220);
				textAlign (CENTER, TOP);
				textSize (80);
				text (`${(dat.winrateRecent)}%`, 300, 25);
			}

			// draw and handle interactions with rock, paper, and scisor icons
			icons();

			if (visualization === 67) { // if the visualization has not yet been initialized
				visualization = createGraphics(600, 300); 
				updateVisualization();
			}

			image(visualization, 0, 120, 600, 260);
		}
	})(),

	result: (() => {
		let aiChoice = "r"; // set some defaults in case something goes wrong
		let playerChoice = "r";
		let animAmt = 0;
		let colorFade = 1;

		// animation functions for rock paper and scisors
		let animFuncs = {
			r (amt, flip) {
				const anim = (a) => {
					if (a <= 0.9) {
						return 0.1 * Math.pow(0.02, a) - 0.1
					} else {
						return 11 * a - 9.9;
					}
				}

				let x = 0 + anim(amt) * 150;
				if (flip) {
					x -= 600;
					x *= -1;
					x -= 180;
				}
				const y = 220;
				image (images.rock, x, y, 180, 160);

			},
			
			p (amt, flip) {
				const anim = (a) => Math.pow(200, a - 1);

				let x = 0 + anim(amt) * 200;

				if (flip) {
					x -= 600;
					x *= -1;
					x -= 180;
				}

				const y = 220 - sin(anim(amt) * PI) * 100;
				image (images.paper, x, y, 180, 160);
			},

			s (amt, flip) {

				let x = 0 + amt * 150;

				if (flip) {
					x -= 600;
					x *= -1;
					x -= 180;
				}

				const y = 220;
				push();
				translate (x + 90, y + 80);
				rotate (PI/2);

				if (flip) rotate (PI);

				if (round(x/50)%2 === 0) {
					image (images.scisors, -90, -80, 180, 160);
				} else {
					image (images.scisorsClosed, -90, -80, 180, 160);
				}

				pop();
			},
		}

		return function (_ai, _player) {

			if (lastGameData.winner === 0 && animAmt >= 0.6) {
				colorFade = lerp (colorFade, 0, 0.1);
				background (240, min(240, 240 - 240 * colorFade), min(240, 240 - 240 * colorFade));
			} else if (lastGameData.winner === 1 && animAmt >= 0.6) {
				colorFade = lerp (colorFade, 0, 0.1);
				background (min(240, 240 - 240 * colorFade), min(240, 240 - 240 * colorFade), 240);
			} else {
				background (240);
			}

			// continue button
			let txt = "continue"
			if (mouseY > 450) txt += "?";

			fill (190);
			stroke (20);
			strokeWeight (14);

			rect (30, 457, 540, 113);

			textSize (80);
			textAlign (CENTER, CENTER);
			fill (20);
			noStroke();
			text(txt, 300, 508);

			scenes.current = "result";

			animAmt += (Date.now() - then)/1000/2.5;
			animAmt = constrain(animAmt, 0, 1);

			if (_ai) {
				aiChoice = _ai;
				playerChoice = _player;
				animAmt = 0;
				colorFade = 1;
			}

			// text format for message

			fill (20);
			textAlign(CENTER, CENTER)
			textFont('Rowdies');
			textSize(80);

			if (animAmt < 0.6) {

				let options = "ROCK.PAPER.SCISORS".split(".");
				let inds = {r:0,p:1,s:2};

				// say what the ai played
				text(`AI: ${options[inds[record[record.length-2]]]}`, 300, 150);

				// animate the rock/paper/scis attacking eachother
				animFuncs[aiChoice](animAmt * 1/0.6, true);
				animFuncs[playerChoice](animAmt * 1/0.6, false);
			} else {

				// say who won
				text(`${"AI WINS!,YOU WIN!,TIE!".split(",")[lastGameData.winner]}`, 300, 150);

				// display the different immages for different posible games

				if (aiChoice === "s" && playerChoice === "r") {
					image (images.rockSmashScisor, 165, 165, 270, 270);
				} else if (aiChoice === "r" && playerChoice === "s") {
					push ();
					translate (300, 0);
					scale (-1, 1);
					image (images.rockSmashScisor, -135, 165, 270, 270);
					pop ();
				} else if (aiChoice === "p" && playerChoice === "s") {
					image (images.scisorsCutPaper, 210, 210, 180, 180);
				} else if (aiChoice === "s" && playerChoice === "p") {
					push ();
					translate (300, 0);
					scale (-1, 1);
					image (images.scisorsCutPaper, -90, 210, 180, 180);
					pop ();
				} else if ((aiChoice === "p" && playerChoice === "r") || (aiChoice === "r" && playerChoice === "p")) {
					image (images.paperOverRock, 200, 200, 200, 200);
				} else if (aiChoice === "p" && playerChoice === "p") {
					animFuncs[aiChoice](1, true);
					animFuncs[playerChoice](1, false);
				} else if (aiChoice === "r" && playerChoice === "r") {
					animFuncs[aiChoice](1, true);
					animFuncs[playerChoice](1, false);
				} else if (aiChoice === "s" && playerChoice === "s") {
					animFuncs[aiChoice](1, true);
					animFuncs[playerChoice](1, false);
				}
				
			}

			if (animAmt >= 1 || (animAmt > 0 && mouseY > 450 && click)) scenes.transition ("main", get(), click? 5:1.5);
		}
	})(),
};

let then = Date.now();

draw = function() {
	scenes.runCur();
	then = Date.now();
	click = false;
};

function mousePressed () {
	click = true;
}
