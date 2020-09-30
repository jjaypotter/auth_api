const connString = require('custom_modules/connString');
const { promisify } = require("util");
const redis = require('redis');
const client = redis.createClient({'host':connString.host, 'database': connString.database});

// node redis natually not supporting promise, so need to create async rapper
const HGET_ASYNC = promisify(client.hget).bind(client);

let userLogin = async function (username, password){
    let matchingPassword = false;
    let currentPassword = await HGET_ASYNC(username, 'password');
    if (currentPassword == password) {
        matchingPassword = true;
    }
    return matchingPassword;
};

let checkConnection = async function(){
    let value = await HGET_ASYNC("jin123");
    return value;
};
    
exports.checkConnection = checkConnection;
exports.userLogin = userLogin;
