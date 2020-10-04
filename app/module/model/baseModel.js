const constant   = require(__basePath + 'app/config/constants');
const underscore = require('underscore');
const database   = require(constant.path.app + 'core/mysql_conn');
const exceptions = require(constant.path.app + 'core/exception');


class BaseModel {

    constructor() {
        this.databaseObj = database.getInstance();
    }

    get CONNECTIONNAME() {
        return {
            READSLAVE: 'READSLAVE',
            MASTER   : 'MASTER'
        };
    }

    mysqlSelect(table, conditions = {}, params = {}, callback) {
        let queryValues = [];

        params.fields = params.fields || '*';

        let sql = `
            SELECT 
                ${params.fields}
            FROM 
                ${table} `;

        if (params.join) {
            underscore.each(params.join, function (value) {
                value.type = value.type || 'FULL';

                sql += `
                    ${value.type} JOIN 
                        ${value.table} 
                    ON 
                        ${value.conditions}
                    `;
            });
        }

        sql += ` WHERE 1`;

        if (false === underscore.isEmpty(conditions)) {
            underscore.each(conditions, function (value, index) {
                if (underscore.isArray(value)) {
                    sql += ` AND ${index} IN (?) `;
                    queryValues.push(value);
                } else if (underscore.isObject(value)) {
                    sql += ` AND ${index} ${value.sign} ? `;
                    queryValues.push(value.value);
                } else {
                    sql += ` AND ${index} = ? `;
                    queryValues.push(value);
                }
            });
        }
        //Adding  Group By if exist
        sql += params.groupBy ? ` GROUP BY ${params.groupBy} ` : '';

        //Adding  Order By if exist
        sql += params.orderBy ? ` ORDER BY ${params.orderBy} ` : '';

        //Adding Limit
        sql += params.limit ? ` LIMIT ${params.limit}` : '';
        return this.databaseObj.query(this.CONNECTIONNAME.READSLAVE, {
            sql   : sql,
            values: queryValues
        }, callback);
    };

    mysqlInsert(table, data = {}, callback) {
        let sql = `
            INSERT INTO
                ${table}
            SET ?
        `;

        return this.databaseObj.query(this.CONNECTIONNAME.MASTER, {
            sql   : sql,
            values: data
        }, callback);
    }

    mysqlUpdate(table, data = {}, conditions = {}, callback) {
        if (underscore.isEmpty(conditions)) {
            return callback(new exceptions.UpdateConditionsNotFoundException);
        }

        let sql = `
            UPDATE
                ${table}
            SET 
                ?
            WHERE
                ?
        `;

        return this.databaseObj.query(this.CONNECTIONNAME.MASTER, {
            sql   : sql,
            values: [
                data, conditions
            ]
        }, callback);
    }

}

module.exports = BaseModel;
