/**
 by Jin, Sept 2020 v 0.1
 This API function used to authenticate user request
 custom validation modules in custom_modules folder
 deployment env: AWS lambda
 */

// const redis = require('redis');
const ul = require('./custom_modules/userLogin');

exports.handler = async (event, context, callback) => {
    let respCode = 400;
    let message = "Sorry, login failed";
    
    let [requestUsername, requestPasswd] = [event.username, event.password];
    // console.log(request_username, ": want password ",request_passwd);    // active if want to record request info

    // this is intentionally here to ensure health check of the redis connection
    // result will be log into CloudWatch
    // let healthCheck = await ul.checkConnection();
    // console.log(healthCheck);
    
    let loginResponse = await ul.userLogin(requestUsername, requestPasswd);
    if (loginResponse){
        respCode = 200;
        message = "Success";
    } else {
        console.log("user authentication for %s failed.", requestUsername);
    }
    
    // define response of the call
    let response = {
        statusCode: respCode,
        body: message
    };
    
    // format response according to status code
    if (respCode == 200){
        return response;
    } else {
        callback(JSON.stringify(response));
    }

};