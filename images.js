const images = {
	rock () {

		let g = createGraphics(600, 600);

		g.translate(50, 0);

		g.background(255);

		g.fill(128, 128, 128);
		g.stroke(0);
		g.strokeWeight(30);

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
		g.strokeWeight(26);

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
		g.strokeWeight(26);

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
		g.scale (1, 0.9);

		g.strokeCap(SQUARE);
		g.fill(227);
		g.stroke(0, 0, 0);
		g.strokeWeight(25);

		g.beginShape();
		g.vertex(36, 236);
		g.vertex(34, 423);
		g.vertex(20, 575);
		g.vertex(168, 561);
		g.vertex(280, 556);
		g.vertex(411, 560);
		g.vertex(419, 454);
		g.vertex(426, 346);
		g.endShape();

		g.fill(245);

		g.beginShape();
		g.vertex(426, 346);
		g.vertex(427, 252);
		g.vertex(422, 165);
		g.vertex(412, 99);
		g.vertex(391, 34);
		g.vertex(244, 37);
		g.vertex(130, 36);
		g.vertex(18, 32);
		g.vertex(27, 26);
		g.vertex(31, 96);
		g.vertex(36, 236);
		g.endShape();

		g.beginShape();
		g.vertex(36, 236);
		g.vertex(34, 423);
		g.endShape();

		g.strokeWeight(20);
		g.noFill();

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
		g.scale (1, 0.9);

		g.strokeCap(SQUARE);
		g.fill(255);
		g.stroke(255);
		g.strokeWeight(25);

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
		g.vertex(18, 32);
		g.endShape();

		let mask = g.get(0, 0, 600, 600);

		filling.mask(mask);

		return filling;
	},

	scisors () {
		function drawIt (mask) {

		    let g = createGraphics(600, 600, P2D);
		    
		    g.translate(-161, -288);
		    g.scale(1.5);
		    
		    g.fill(186, 186, 186);
		    g.stroke(0);
		    g.strokeWeight(14);
		    
		    if (mask) {
		        g.background (0, 0);
		        g.stroke(255);
		        g.fill(255);
		    }
		    
		    g.beginShape();
		    g.vertex(367, 209);
		    g.vertex(290, 400);
		    g.vertex(263, 441);
		    g.vertex(284, 462);
		    g.vertex(322, 421);
		    g.vertex(384, 215);
		    g.vertex(378, 207);
		    g.vertex(368, 208);
		    g.endShape();
		    
		    g.fill(219, 219, 219);
		    
		    if (mask) {
		        g.fill(255);
		    }

		    g.noStroke();
		    
		    g.beginShape();
		    g.vertex(378, 209);
		    g.vertex(302, 422);
		    g.vertex(267, 444);
		    g.vertex(262, 440);
		    g.vertex(299, 397);
		    g.vertex(368, 208);
		    g.vertex(388, 207);
		    g.endShape();

		    g.stroke(0);
		    g.strokeWeight(14);

		    g.noFill();
		    
		    if (mask) {
		        g.fill(255);
		        g.stroke(255);
		    }

		    g.beginShape();
		    g.vertex(367, 209);
		    g.vertex(290, 400);
		    g.vertex(263, 441);
		    g.vertex(284, 462);
		    g.vertex(322, 421);
		    g.vertex(384, 215);
		    g.vertex(378, 207);
		    g.vertex(368, 208);
		    g.endShape();
		    
		  
		    g.fill(186, 186, 186);
		    
		    if (mask) {
		        g.fill(255);
		    }
		    
		    g.beginShape();
		    g.vertex(300, 424);
		    g.vertex(216, 212);
		    g.vertex(220, 204);
		    g.vertex(227, 201);
		    g.vertex(236, 202);
		    g.vertex(343, 411);
		    g.vertex(370, 445);
		    g.vertex(344, 459);
		    g.vertex(300, 424);
		    g.endShape();
		    
		    g.fill(41, 41, 41);
		    
		    if (mask) {
		        g.fill(255);
		    }
		    
		    g.beginShape();
		    g.vertex(312, 387);
		    g.vertex(305, 390);
		    g.vertex(304, 398);
		    g.vertex(310, 402);
		    g.vertex(319, 399);
		    g.vertex(321, 394);
		    g.vertex(317, 388);
		    g.vertex(312, 387);
		    g.endShape();
		    
		    g.fill(242, 225, 70);
		    
		    if (mask) {
		        g.fill(255);
		    }
		    
		    g.beginShape();
		    g.vertex(258, 439);
		    g.vertex(297, 474);
		    g.vertex(283, 515);
		    g.vertex(283, 553);
		    g.vertex(241, 571);
		    g.vertex(199, 558);
		    g.vertex(193, 516);
		    g.vertex(230, 442);
		    g.vertex(258, 439);
		    g.endShape();
		    
		    g.beginShape();
		    g.vertex(371, 445);
		    g.vertex(406, 453);
		    g.vertex(430, 527);
		    g.vertex(413, 570);
		    g.vertex(373, 587);
		    g.vertex(341, 562);
		    g.vertex(347, 518);
		    g.vertex(337, 469);
		    g.vertex(344, 459);
		    g.vertex(371, 446);
		    g.endShape();
		    
		    return g.get();

		}

		let filling = drawIt();
		filling.mask(drawIt(true));

		return filling;
	},

	scisorsClosed () {
		let g = createGraphics(600, 600, P2D);
		g.background(0, 0);

		g.fill(242, 225, 70);
		g.stroke(0);
		g.strokeWeight(18);
		g.beginShape();
		g.vertex(317, 419);
		g.vertex(326, 493);
		g.vertex(314, 551);
		g.vertex(355, 596);
		g.vertex(419, 566);
		g.vertex(448, 501);
		g.vertex(425, 412);
		g.vertex(380, 387);
		g.vertex(325, 405);
		g.vertex(317, 419);
		g.endShape();

		g.beginShape();
		g.vertex(307, 417);
		g.vertex(281, 492);
		g.vertex(291, 547);
		g.vertex(245, 592);
		g.vertex(177, 566);
		g.vertex(164, 495);
		g.vertex(211, 404);
		g.vertex(261, 385);
		g.vertex(305, 409);
		g.vertex(307, 419);
		g.endShape();

		g.fill(186);

		g.beginShape();
		g.vertex(256, 386);
		g.vertex(282, 321);
		g.vertex(331, 18);
		g.vertex(344, 13);
		g.vertex(360, 17);
		g.vertex(372, 27);
		g.vertex(333, 315);
		g.vertex(303, 411);
		g.vertex(258, 387);
		g.endShape();

		g.beginShape();
		g.vertex(328, 402);
		g.vertex(280, 310);
		g.vertex(283, 20);
		g.vertex(295, 7);
		g.vertex(313, 10);
		g.vertex(322, 21);
		g.vertex(340, 301);
		g.vertex(381, 388);
		g.vertex(328, 403);
		g.endShape();

		g.beginShape();
		g.vertex(309, 311);
		g.vertex(307, 304);
		g.vertex(316, 301);
		g.vertex(312, 313);
		g.endShape();

		return g.get();
	},

	paperOverRock () {
		let g = createGraphics(600, 600);
		g.background(0, 0);
		g.image (images.rock, 0, 0, 600, 600);
		
		g.stroke(0);
		g.strokeWeight(20);
		g.fill(250);
		
		g.beginShape();
		g.vertex(100, 100);
		g.vertex(214, 48);
		g.vertex(430, 67);
		g.vertex(550, 296);
		g.vertex(514, 506);
		g.vertex(332, 474);
		g.vertex(285, 497);
		g.vertex(88, 466);
		g.vertex(52, 320);
		g.vertex(100, 100);
		g.endShape();
		
        g.fill(220);
        
        g.noStroke();
        g.beginShape();
        g.vertex(123, 153);
        g.vertex(147, 208);
        g.vertex(115, 245);
        g.vertex(165, 215);
        g.vertex(244, 205);
        g.vertex(167, 198);
        g.vertex(125, 155);
        g.endShape();
       
        g.beginShape();
        g.vertex(194, 282);
        g.vertex(178, 397);
        g.vertex(203, 454);
        g.vertex(190, 398);
        g.vertex(196, 283);
        g.endShape();
        
        g.beginShape();
        g.vertex(259, 257);
        g.vertex(317, 351);
        g.vertex(278, 445);
        g.vertex(346, 311);
        g.vertex(322, 332);
        g.vertex(258, 257);
        g.endShape();
        
        g.beginShape();
        g.vertex(205, 156);
        g.vertex(275, 112);
        g.vertex(369, 184);
        g.vertex(276, 125);
        g.vertex(204, 155);
        g.endShape();
       
        g.beginShape();
        g.vertex(337, 239);
        g.vertex(402, 265);
        g.vertex(410, 329);
        g.vertex(415, 257);
        g.vertex(450, 210);
        g.vertex(402, 250);
        g.vertex(338, 240);
        g.endShape();
        
        g.translate (50, -20)
        g.beginShape();
        g.vertex(393, 385);
        g.vertex(394, 449);
        g.vertex(377, 468);
        g.vertex(397, 456);
        g.vertex(443, 500);
        g.vertex(409, 453);
        g.vertex(431, 430);
        g.vertex(404, 440);
        g.vertex(393, 384);
        g.endShape();

		return g.get();
	},

	rockSmashScisor () {
		let g = createGraphics(600, 600, P2D);

		g.background(0, 0);

		g.image(images.rock, 0, 100, 400, 400);

		g.fill(242, 225, 70);
		g.stroke(0);
		g.strokeWeight(14);

		g.beginShape();
		g.vertex(568, 197);
		g.vertex(524, 180);
		g.vertex(453, 202);
		g.vertex(442, 229);
		g.vertex(458, 262);
		g.vertex(509, 260);
		g.vertex(553, 264);
		g.vertex(581, 236);
		g.vertex(568, 199);
		g.endShape();

		g.beginShape();
		g.vertex(470, 311);
		g.vertex(439, 347);
		g.vertex(439, 375);
		g.vertex(509, 412);
		g.vertex(552, 407);
		g.vertex(565, 373);
		g.vertex(551, 328);
		g.vertex(512, 325);
		g.vertex(471, 312);
		g.endShape();

		g.fill(186, 186, 186);

		g.beginShape();
		g.vertex(430, 339);
		g.vertex(356, 296);
		g.vertex(358, 235);
		g.vertex(307, 195);
		g.vertex(306, 157);
		g.vertex(313, 154);
		g.vertex(321, 158);
		g.vertex(325, 183);
		g.vertex(379, 209);
		g.vertex(388, 270);
		g.vertex(449, 315);
		g.vertex(430, 337);
		g.endShape();

		g.beginShape();
		g.vertex(434, 244);
		g.vertex(361, 293);
		g.vertex(364, 349);
		g.vertex(356, 406);
		g.vertex(371, 444);
		g.vertex(337, 471);
		g.vertex(334, 480);
		g.vertex(338, 491);
		g.vertex(401, 462);
		g.vertex(383, 404);
		g.vertex(402, 331);
		g.vertex(454, 270);
		g.vertex(438, 244);
		g.endShape();

		g.fill(71, 71, 71);

		g.beginShape();
		g.vertex(395, 286);
		g.vertex(382, 294);
		g.vertex(391, 300);
		g.vertex(396, 294);
		g.vertex(396, 288);
		g.endShape();

		return g.get();
	},

	scisorsCutPaper () {
		let g = createGraphics(600, 600, P2D);

		g.background(0, 0);
		g.push();
		g.translate(300, 300);
		g.rotate(PI/2);
		g.image(images.scisorsClosed, -300, -300, 600, 600);
		g.pop();


		g.fill(237, 237, 237);
		g.stroke(0);
		g.strokeWeight(18);

		g.beginShape();
		g.vertex(287, 225);
		g.vertex(400, 206);
		g.vertex(544, 227);
		g.vertex(584, 28);
		g.vertex(526, 57);
		g.vertex(423, 24);
		g.vertex(271, 41);
		g.vertex(280, 99);
		g.vertex(293, 104);
		g.vertex(283, 106);
		g.vertex(305, 174);
		g.vertex(287, 225);
		g.endShape();

		g.beginShape();
		g.vertex(228, 165);
		g.vertex(118, 121);
		g.vertex(57, 133);
		g.vertex(40, 59);
		g.vertex(130, 16);
		g.vertex(219, 22);
		g.vertex(193, 64);
		g.vertex(245, 106);
		g.vertex(227, 166);
		g.endShape();

		g.beginShape();
		g.vertex(304, 402);
		g.vertex(257, 465);
		g.vertex(272, 504);
		g.vertex(288, 509);
		g.vertex(278, 517);
		g.vertex(267, 583);
		g.vertex(469, 552);
		g.vertex(563, 591);
		g.vertex(581, 433);
		g.vertex(365, 440);
		g.vertex(306, 403);
		g.endShape();

		g.beginShape();
		g.vertex(210, 461);
		g.vertex(163, 494);
		g.vertex(98, 476);
		g.vertex(66, 507);
		g.vertex(29, 557);
		g.vertex(55, 588);
		g.vertex(221, 557);
		g.vertex(199, 519);
		g.vertex(211, 463);
		g.endShape();

		g.strokeCap(SQUARE);

		g.beginShape();
		g.vertex(322, 487);
		g.vertex(364, 471);
		g.endShape();

		g.beginShape();
		g.vertex(350, 548);
		g.vertex(431, 512);
		g.vertex(508, 484);
		g.endShape();

		g.beginShape();
		g.vertex(332, 172);
		g.vertex(339, 66);
		g.endShape();

		g.beginShape();
		g.vertex(448, 174);
		g.vertex(461, 118);
		g.vertex(439, 59);
		g.endShape();

		g.beginShape();
		g.vertex(181, 115);
		g.vertex(114, 61);
		g.endShape();

		g.beginShape();
		g.vertex(88, 554);
		g.vertex(154, 522);
		g.endShape();

		return g.get();
	},


}