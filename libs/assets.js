const _ = require('lodash');
const shell = require('child_process').execSync;
const path = require('path');

module.exports = function (sails, opts) {
	let defaultOptions = {
		js: false,
		styles: false,
		images: false,
		templates: false,
		dependencies: false
	}
	
	defaultOptions = {...defaultOptions, ...opts}
	defaultOptions = _.omitBy(defaultOptions, function (item) {
		return !_.isString(item)
	})
	
	_.each(defaultOptions, function (item, index) {
		let src = item;
		let dist = path.resolve(sails.config.appPath, `assets/${index}`);
		shell(`rsync -r --ignore-existing ${src}/ ${dist}`);
	})
}