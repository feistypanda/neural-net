const utils = {
	copyObj (obj) {
		return JSON.parse(JSON.stringify(obj));
	},

	getRandArrElls (arr, numElls) {
		let res = [];
		let copy = copyObj(arr);
		for (let i = 0; i < numElls; i ++) {
			let ind = Math.floor(Math.random() * (copy.length - 0.01))
			res.push(copy[ind]);
			copy.splice(ind, 1);
		}
		return res;
	},

	anim1 (x) {
		return 4 * Math.pow(x - 0.5, 3) + 0.5;
	}
};

// shortcuts
const copyObj = utils.copyObj
const stringify = JSON.stringify;