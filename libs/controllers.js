/**
 * Load controllers from a directory into a Sails app
 */

var async = require('async');
var _ = require('lodash');
var buildDictionary = require('sails-build-dictionary');
var utils = require(__dirname + '/utils');

module.exports = function (sails, dir, cb) {
    async.waterfall([// Load controllers from the given directory
        function loadModulesFromDirectory(next) {
            buildDictionary.optional({
                dirname: dir,
                filter: /(.+)Controller\.(js|coffee|litcoffee)$/,
                flattenDirectories: true,
                keepDirectoryPath: true,
                replaceExpr: /Controller/
            }, next);
        },

        // Bind all controllers methods to sails
        function bindControllersToSails(modules, next) {
            utils._bindToSails(sails, modules, next);
        },

        // Register controllers on the main "controllers" hook
        function registerControllers(modules, next) {
            // Extends sails.controllers with new ones
            sails.controllers = _.merge(modules || {}, sails.controllers || {});

            // Loop through each controllers and register them
            _.each(modules, function (controller, controllerId) {
                // If controller does not exists yet, create empty object
				
                // Register this controller's actions
                _.each(controller, function (action, actionId) {
                    // actionid is always lowercase
                    actionId = actionId.toLowerCase();

                    // If the action is set to `false`, explicitly disable (remove) it
                    if (action === false) {
                        // delete sails.controllers[controllerId][actionId];
                        return;
                    }
                    
                    if(actionId === "sails"){
                    	return;
                    }

                    // Do not register string or boolean actions
                    if (_.isString(action) || _.isBoolean(action)) {
                        return;
                    }

                    // Register controller's action on the main "controllers" hook
                    // Action named by rule CONTROLLERNAME_ACTIONNAME because CONTROLLERNAME.ACTIONNAME
                    // is conflicting with Sails Application controllers and our actions are revoked
	                console.log("Registering action: " + controllerId + "controller" + "_" + actionId)
	                sails.registerAction(action, controllerId + "controller" + "_" + actionId)
                });
            });
			
            return next();
        }], function (err) {
        cb(err);
    });
};
