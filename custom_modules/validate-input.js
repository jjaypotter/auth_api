const connection_string = require('./connection-string');
const redis_pool = require('redis-connection-pool')('my_redis_pool', {
    host: connection_string.host, port: 6379, max_clients: 30, perform_checks: false, database: connection_string.database, 
    options: { auth_pass: connection_string.password }
});

// password need capital, lower case, number, special charactor and more than eight in length
let re = new RegExp('^(?=.*[A-Z])(?=.*[!@#$%&*])(?=.*[0-9])(?=.*[a-z]).{8}$')

class Validate {
    constructor(name){
        this.name = name;
    }

    validate_user_exist(username){
        let user_exist = false;
        redis_pool.exists(username, function(err, response){
            if (err) {
                console.error(err);
            } else {
                if (response == 1){
                    user_exist = true;
                }
            }
        });
        return user_exist;
    }

    validate_complexity(username, password){
        let meeting_complexity = false;
        if (length(username) < 5 || !re.test(password)){
            console.log("register username password not meeting requirement");
        } else {
            meeting_complexity = true;
            redis_pool.hset(username, 'passwd', password, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(username + " register successful");
                }
            })
        }
        return meeting_complexity;
    }

}


module.exports = Validate;





