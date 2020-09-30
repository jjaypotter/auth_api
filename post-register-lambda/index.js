/**
 by Jin, Sept 2020 v 0.1
 This API function used to validate client registeration process
 custom validation modules in custom_modules folder
 deployment env: AWS lambda
 */

// const redis = require('redis');
const Validator = require('./custom_modules/validate');
const ug = require('./custom_modules/userRegis');

exports.handler = async (event, context, callback) => {
    let validator = new Validator();
    let respCode = 400;
    let message = "Sorry, request failed";
    
    let [requestUsername, requestPasswd] = [event.username, event.password];
    // console.log(request_username, ": want password ",request_passwd);    // active if want to record request info

    // this is intentionally here to ensure health check of the redis connection
    // result will be log into CloudWatch
    let healthCheck = await validator.check_connection();
    console.log(healthCheck)
    
    // check if requested user is already exist in redis
    let userStatus = await validator.validate_user_exist(requestUsername);
    
    // if user already exist, redis response with answer 1, no longer process with further registration
    if ( userStatus == 1 ) {
        console.log("registration request received, but %s already exist", requestUsername);
    } else {
        let complexityMatch = await validator.validate_complexity(requestUsername, requestPasswd);
        if (complexityMatch) {
            let regis_successful = await ug.userRegis(requestUsername, requestPasswd);
            if (regis_successful == "OK"){
                respCode = 200;
                message = "Success";
            }
            // console.log(regis_successful);
        }
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