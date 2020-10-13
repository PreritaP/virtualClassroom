const constant   = require(__basePath + 'app/config/constants');
const database   = require(constant.path.app + 'core/mysql_conn');
const BaseModel  = require(constant.path.app + 'module/model/baseModel');
const underscore = require('underscore');

class classModel extends BaseModel {
    constructor () {
        super();
        this.databaseObj = database.getInstance();
    };

    /**
     * @description get connection database
     */
    static get DB() {
        return {
            READSLAVE           : 'READSLAVE',
            MASTER              : 'MASTER'
        };
    }

    insertVisitor(payload, callback) {
        let query = `
        INSERT INTO 
            visitor (visitorName, visitorRole, visitorClass)
        VALUES 
            (:visitorName, :visitorRole, :visitorClass) 
        `;

        let params = {
            visitorName 	: payload.visitorName,
            visitorRole 	: payload.visitorRole,
            visitorClass    : payload.visitorClass
        };

        this.databaseObj.query(classModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }

    isClassStarted(classId, callback){
        return this.mysqlSelect('class', {'classRoom' : classId}, {'fields' : 'classStartTime, classEndTime'}, callback)
    }

    addVisitor (data, callback) {
        var _this = this;
        if (data.role == 0) {
            var results = {};
            results.access = false;
            let visitorParams = {
                "visitorName"  : data.name,
                "visitorRole"  : data.role,
                "visitorClass" : data.class
            }
            this.mysqlSelect('visitor', {'visitorStatus' : 1, 'visitorRole' : 0}, {'fields' : 'visitorName'}, function(error, res){
                if (error) {
                    console.log(error);
                    return callback(error); 
                }
                else {
                    console.log(underscore.isEmpty(res));
                    if(underscore.isEmpty(res) == true){
                        _this.insertVisitor(visitorParams, function(error, res){
                            if (error) {
                                return callback(error);
                            }
                            else {
                                results.access = true;
                                results.id = res.insertId;
                                return callback(null, results);
                            }
                        });
                    } else {
                        results.message = "A teacher is already there in the class. Please login as student.";
                        return callback(null, results);
                    }
                }
            });

        } else if (data.role == 1) {
            _this.isClassStarted(data.class, function(error, isEligible) {
                let date_ob = new Date();
                const results = {};
                results.access = false;
                if(underscore.isEmpty(isEligible) == false) {
                    if(isEligible[isEligible.length-1].classEndTime == null) {
                        if(isEligible[0].classStartTime < date_ob){
                            results.access = true;
                            let visitorParams = {
                                "visitorName"  : data.name,
                                "visitorRole"  : data.role,
                                "visitorClass" : data.class
                            }
                            _this.insertVisitor(visitorParams, function(error, res){
                                if (error) {
                                    return callback(error);
                                }
                                results.id = res.insertId;
                                return callback(null, results);
                            });
                        }
                    } else {
                        results.message = "You can not enter the class, since the class has not started yet."
                        return callback(results, results);
                    }
                } else {
                    results.message = "Access Denied";
                    return callback(results, results);
                }
                
            });
        }
    }

    startClass(payload, callback) {
        let query = `
        INSERT INTO 
            class (classTeacherId, classTeacher, classRoom)
        VALUES 
            (:classTeacherId, :classTeacher, :classRoom) 
        `;

        let params = {
            classTeacherId  : payload.classTeacherId,
            classTeacher 	: payload.classTeacher,
            classRoom 	    : payload.classRoom
        };
        this.databaseObj.query(classModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }

    classAction (data, callback) {
        var _this = this;
        if (data.isStart == 1) {
            let classParams = {
                "classTeacherId" : data.classTeacherId,
                "classTeacher"   : data.classTeacher,
                "classRoom"      : data.classRoom
            }
            _this.startClass(classParams, function(error, results){
                if (error) {
                    console.log(error);
                    return callback(error); 
                }else {
                    console.log(results);
                    return callback(null , results);
                }
            });
        } else if (data.isStart == 0) {
            let date_ob = new Date();
            this.mysqlUpdate('visitor', {'visitorStatus' : 0},{'visitorClass' : data.classRoom},function (error, res){
                if (error) {
                    return callback(error); 
                }else {
                    return _this.mysqlUpdate('class', {'classEndTime' : date_ob}, {'classRoom' : data.classRoom}, callback);
                }
            })
        }
    }

    getClass (classRoom, role, callback){
        return this.mysqlSelect('visitor', {'visitorClass' : classRoom, 'visitorStatus' : 1, 'visitorRole' : role}, {'fields' : 'visitorName'}, callback)
    }

    showClass (data, callback) {
        var _this = this;
        var teachers = [];
        var students = [];
        var result = {};
        _this.getClass(data, 0, function(error, res){
            res.forEach(element => {
                teachers.push(element.visitorName);
            });
            result["teacherList"] = teachers;
            _this.getClass(data, 1, function(error, res){
                res.forEach(element => {
                    students.push(element.visitorName);
                });
                result["studentList"] = students;
                return callback(null , result);
            });
        });
    }

    leaveClass (id, callback) {
        return this.mysqlUpdate('visitor', {'visitorStatus' : 0}, {'visitorId':id}, callback);
    }

    classHistory(classRoom, callback) {
        return this.mysqlSelect('class', {'classRoom' : classRoom}, {'fields' : 'classTeacher as Teacher, classStartTime, visitorName as Student ,visitorVisitedTime as student_join, visitorUpdatedTime as student_leave,classEndTime' , 'join' : [{ 'type' : 'INNER' , 'table' : 'visitor' , 'conditions' : 'visitorClass=classRoom'}]}, callback)

    }
}
module.exports = classModel;
