const shell = require('child_process').execSync;
const path = require('path');

module.exports = function (sails, dir) {
	const src = dir;
	const dist = path.resolve(sails.config.appPath, 'views');
	
	shell(`rsync -r --ignore-existing ${src}/ ${dist}`);
	
	console.log(`Success! Views from ${src} successfully copied to Sails App structure.`);
}