const express = require("express");
const router = express.Router();
const { validate, Joi } = require("express-validation");

const authHelper = require("../utils/authenticationHelper");
const helper = require('../utils/helper');
const apiValidator = require("../utils/apiValidator");

router.post('/register', validate({
    body: Joi.object({
        userName: Joi.string().required(),
        userEmail: Joi.string().required().email(),
        password: Joi.string().required(),
        userType: Joi.string().valid('root', 'admin', 'customer').required(),
        isDisabled: Joi.boolean().required()
    })
}), async (req, res) => {
    try {
        const userDetails = req.body;
        const result = await authHelper.registerUser(userDetails);
        res.status(201).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.post('/login', validate({
    body: Joi.object({
        userEmail: Joi.string().required().email(),
        password: Joi.string().required()
    })
}), async (req, res) => {
    try {
        const userDetails = req.body;
        const token = await authHelper.loginUser(userDetails);
        res.header('accessToken', token).status(200).json(helper.createResponseObject('result', 'Login Successful!'));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.patch('/disableAdminUser', validate({
    body: Joi.object({
        userEmail: Joi.string().required().email()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const userEmail = req.body.userEmail;
        const result = await authHelper.disableAdminUser(userEmail);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

module.exports = router;