const connString = require('custom_modules/connString');
const { promisify } = require("util");
const redis = require('redis');
const client = redis.createClient({'host':connString.host, 'database': connString.database});

// node redis natually not supporting promise, so need to create async rapper
const HGETALL_ASYNC = promisify(client.hgetall).bind(client);
const EXIST_ASYNC = promisify(client.exists).bind(client);

// password need capital, lower case, number, special charactor and more than eight in length
let re = new RegExp('^(?=.*[A-Z])(?=.*[!@#$%&*])(?=.*[0-9])(?=.*[a-z]).{8}$');

class Validate {
    constructor(name){
        this.name = name;
    }

    //this function check a default account in redis to verify connectivity
    async check_connection(){
        let value = await HGETALL_ASYNC("jin123");
        return value;
    }

    // check if user already exist, log error if exist
    validate_user_exist(username){
        let user_exist = EXIST_ASYNC(username, function(err, response){
                if (err) {
                    console.error(err);
                }
            });
        return user_exist;
    }

    // check user length and password complexity, return bool
    validate_complexity(username, password){
        let meeting_complexity = (username.length >= 5 && re.test(password));
        return meeting_complexity;
    }
    
}


module.exports = Validate;
