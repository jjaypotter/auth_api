/**
 This API function used to validate client registeration process
 custom validation modules in custom_modules folder
 deployment env: AWS lambda
 */

// const redis = require('redis');
const Validator = require('./custom_modules/validate-input');

exports.handler = async (event, context) => {
    let validator = new Validator();
    let valid_request = false;
    let resp_code = 400;
    let message = "sorry, request failed"
    
    let data = event.data;
    let request_username = data.username;
    let request_passwd = data.password;

    let user_exist = await validator.validate_user_exist(request_username);
    if (user_exist) {
        console.log("Received register request, but username already exist in redis");
        message = "sorry, username already exist"
    } else {
        // check password complexity, if passed, submit password info
        meet_complexity = await validator.validate_complexity(request_username,request_passwd)
        if (meet_complexity) {
            valid_request = true;
            resp_code = 200;
            message = "user created successful"
        } else {
            console.log("Received register request, but username or password not meeting requirements");
            message = "sorry, username or password not meeting requirements"
        }
    }

    let response = {
        message: message
    }

    return {
        statusCode: resp_code,
        body: JSON.stringify(response)
    }

}