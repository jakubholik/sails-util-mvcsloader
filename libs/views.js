const shell = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

module.exports = function (sails, dir) {
	const src = dir;
	const dist = path.resolve(sails.config.appPath, 'views');
	
	let firstItemToCopy = fs.readdirSync(dir)[0] || "";
	let existingItemInDist = path.resolve(dist, firstItemToCopy);
	
	
	if (!fs.existsSync(existingItemInDist)) {
		shell(`mkdir -p ${dist}`);
		shell(`cp -r ${src}/* ${dist}`);
		
		console.log(`Success! Views from ${src} successfully copied to Sails App structure.`);
	} else {
		console.log(`Warning! Views in ${src} are already present in Sails App structure.`);
	}
}