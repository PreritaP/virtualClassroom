/**
 * Class Controller for class management
 * 
 * @author Prerita
 */
const constants 	= require(__basePath + '/app/config/constants');
const response 		= require(constants.path.app + 'util/response');
const classModel    = require(constants.path.app + 'module/model/classModel');
const underscore    = require('underscore');

exports.addVisitor = function (req, res, next) {
    try {
        const classModelObj = new classModel();
        classModelObj.addVisitor(req.body, function (error, results){
            var result = {};
    		if (error) {
                console.log("ERROR OCUURED", error);
            }
            console.log(results);
            result.visitorId = results.id; 
            if(results.access == false){
                return res.status(200).json(response.build('FAILURE',results));
            }
            return res.status(200).json(response.build('SUCCESS',result));
    	});
    } catch (error) {
        console.log(error);
    }
}

exports.classAction = function (req, res, next) {
    try {
        const classModelObj = new classModel();
        classModelObj.classAction(req.body, function (error, results){
            if(underscore.isEmpty(results) == true){
                return res.status(200).json(response.build('FAILURE','You can not perform this action.'));
            }
            return res.status(200).json(response.build('SUCCESS','Class action recorded succesfully'));
    	});
    } catch (error) {
        console.log(error);
    }
}

exports.showClass = function (req, res, next) {
    try {
        const classModelObj = new classModel();
        classModelObj.showClass(req.params.classRoom, function (error, results){
            if(underscore.isEmpty(results) == true){
                return res.status(204).json(response.build('ERROR_NO_DATA',results));
            }
            return res.status(200).json(response.build('SUCCESS',results));
    	});
    } catch (error) {
        console.log(error);
    }
}

exports.leaveClass = function (req, res, next) {
    try {
        const classModelObj = new classModel();
        classModelObj.leaveClass(req.params.id, function (error, results){
            return res.status(200).json(response.build('SUCCESS','Successfully left the class'));
    	});
    } catch (error) {
        console.log(error);
    }
}

exports.showClassHistory = function(req, res, next) {
    try {
        const classModelObj = new classModel();
        classModelObj.classHistory(req.params.classRoom, function (error, results){
            return res.status(200).json(response.build('SUCCESS',results));
        });
    } catch (error) {
        console.log(error);
    }
}