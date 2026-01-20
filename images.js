const images = {
	rock () {

		let g = createGraphics(600, 600);

		g.translate(50, 0);

		g.background(255);

		g.fill(128, 128, 128);
		g.stroke(0);
		g.strokeWeight(15);

		g.beginShape();
		g.vertex(12, 318);
		g.vertex(46, 138);
		g.vertex(161, 59);
		g.vertex(348, 74);
		g.vertex(489, 288);
		g.vertex(466, 467);
		g.vertex(360, 557);
		g.vertex(158, 579);
		g.vertex(55, 478);
		g.vertex(12, 318);
		g.endShape();

		g.noStroke();
		g.fill(148, 148, 148);

		g.beginShape();
		g.vertex(21, 315);
		g.vertex(54, 143);
		g.vertex(163, 74);
		g.vertex(324, 102);
		g.vertex(257, 108);
		g.vertex(162, 99);
		g.vertex(90, 148);
		g.vertex(50, 228);
		g.vertex(21, 316);
		g.endShape();

		g.fill(92, 92, 92);

		g.beginShape();
		g.vertex(117, 539);
		g.vertex(74, 431);
		g.vertex(118, 329);
		g.vertex(235, 299);
		g.vertex(335, 236);
		g.vertex(396, 147);
		g.vertex(490, 291);
		g.vertex(465, 464);
		g.vertex(362, 556);
		g.vertex(160, 579);
		g.vertex(117, 541);
		g.endShape();

		g.fill(71, 71, 71);

		g.beginShape();
		g.vertex(162, 581);
		g.vertex(142, 563);
		g.vertex(143, 469);
		g.vertex(192, 403);
		g.vertex(306, 383);
		g.vertex(347, 359);
		g.vertex(389, 326);
		g.vertex(443, 313);
		g.vertex(490, 289);
		g.vertex(466, 466);
		g.vertex(364, 558);
		g.vertex(259, 573);
		g.vertex(162, 581);
		g.endShape();

		g.noFill();
		g.stroke(0);
		g.strokeWeight(40);

		g.beginShape();
		g.vertex(12, 318);
		g.vertex(46, 138);
		g.vertex(161, 59);
		g.vertex(348, 74);
		g.vertex(489, 288);
		g.vertex(466, 467);
		g.vertex(360, 557);
		g.vertex(158, 579);
		g.vertex(55, 478);
		g.vertex(12, 318);
		g.endShape();

		let filling = g.get();

		g = createGraphics(600, 600);

		g.background(0, 0);
		g.stroke(255);
		g.fill(255);
		g.strokeWeight(20);

		g.translate(50, 0);

		g.beginShape();
		g.vertex(12, 318);
		g.vertex(46, 138);
		g.vertex(161, 59);
		g.vertex(348, 74);
		g.vertex(489, 288);
		g.vertex(466, 467);
		g.vertex(360, 557);
		g.vertex(158, 579);
		g.vertex(55, 478);
		g.vertex(12, 318);
		g.endShape();

		let mask = g.get();

		filling.mask(mask);

		return filling;
	},

	paper () {
		let g = createGraphics(600, 600, P2D);

		g.translate(80, 0);

		g.background(255);

		g.strokeCap(SQUARE);
		g.fill(245, 245, 245);
		g.stroke(0, 0, 0);
		g.strokeWeight(30);

		g.beginShape();
		g.vertex(24, 26);
		g.vertex(31, 96);
		g.vertex(36, 236);
		g.vertex(34, 423);
		g.vertex(20, 575);
		g.vertex(168, 561);
		g.vertex(280, 556);
		g.vertex(411, 560);
		g.vertex(419, 454);
		g.vertex(426, 346);
		g.vertex(427, 252);
		g.vertex(422, 165);
		g.vertex(412, 99);
		g.vertex(391, 34);
		g.vertex(244, 37);
		g.vertex(130, 36);
		g.vertex(21, 32);
		g.endShape();

		g.strokeWeight(27);

		g.beginShape();
		g.vertex(66, 88);
		g.vertex(198, 94);
		g.vertex(316, 87);
		g.vertex(355, 81);
		g.endShape();

		g.beginShape();
		g.vertex(78, 150);
		g.vertex(202, 158);
		g.vertex(270, 158);
		g.vertex(314, 156);
		g.vertex(358, 151);
		g.endShape();

		g.beginShape();
		g.vertex(86, 232);
		g.vertex(185, 241);
		g.vertex(279, 243);
		g.vertex(355, 236);
		g.endShape();

		g.beginShape();
		g.vertex(92, 324);
		g.vertex(204, 327);
		g.vertex(304, 326);
		g.vertex(350, 326);
		g.endShape();

		g.beginShape();
		g.vertex(90, 393);
		g.vertex(198, 390);
		g.vertex(320, 393);
		g.vertex(353, 395);
		g.endShape();

		g.beginShape();
		g.vertex(89, 472);
		g.vertex(204, 470);
		g.vertex(289, 475);
		g.vertex(350, 479);
		g.endShape();

		let filling = g.get(0, 0, 600, 600);

		g = createGraphics(600, 600, P2D);

		g.background(0, 0);
		g.translate(80, 0);

		g.strokeCap(SQUARE);
		g.fill(255);
		g.stroke(255);
		g.strokeWeight(30);

		g.beginShape();
		g.vertex(24, 26);
		g.vertex(31, 96);
		g.vertex(36, 236);
		g.vertex(34, 423);
		g.vertex(20, 575);
		g.vertex(168, 561);
		g.vertex(280, 556);
		g.vertex(411, 560);
		g.vertex(419, 454);
		g.vertex(426, 346);
		g.vertex(427, 252);
		g.vertex(422, 165);
		g.vertex(412, 99);
		g.vertex(391, 34);
		g.vertex(244, 37);
		g.vertex(130, 36);
		g.vertex(21, 32);
		g.endShape();

		let mask = g.get(0, 0, 600, 600);

		filling.mask(mask);

		return filling;
	},
}