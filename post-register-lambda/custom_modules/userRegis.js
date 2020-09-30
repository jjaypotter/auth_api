const connString = require('custom_modules/connString');
const { promisify } = require("util");
const redis = require('redis');
const client = redis.createClient({'host':connString.host, 'database': connString.database});

// node redis natually not supporting promise, so need to create async rapper
const HMSET_ASYNC = promisify(client.hmset).bind(client);

let userRegis = function (username, password){
    let regisSuccess = HMSET_ASYNC(username, 'password', password);
    // function(err, response){
    //     if (err){
    //         console.log(err);
    //     }
    // });
    return regisSuccess;
};

exports.userRegis = userRegis;
