const express = require("express");
const router = express.Router();
const { Joi, validate } = require("express-validation");

const helper = require('../utils/helper');
const parkingLotHelper = require('../utils/parkingLotHelper');
const apiValidator = require("../utils/apiValidator");

router.post('/createParkingLot', validate({
    body: Joi.object({
        totalSlots: Joi.number().required()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const totalSlots = req.body.totalSlots;
        const result = await parkingLotHelper.createParkingLot(totalSlots);
        res.status(201).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.patch('/updateParkingLot', validate({
    body: Joi.object({
        parkingLotID: Joi.string().required(),
        increaseBy: Joi.number().required()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const increaseBy = req.body.increaseBy;
        const parkingLotID = req.body.parkingLotID;
        const result = await parkingLotHelper.updateParkingLot(parkingLotID, increaseBy);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.post('/parkCar', validate({
    body: Joi.object({
        carData: Joi.object({
            carNo: Joi.string().required(),
            color: Joi.string().required(),
            manufacturer: Joi.string().required(),
            model: Joi.string().required()
        }).required(),
        parkingLotID: Joi.string().required()
    })
}), apiValidator.customerAccessCheck, async (req, res) => {
    try {
        const carData = req.body.carData;
        const parkingLotID = req.body.parkingLotID;
        const userEmail = req.body.userEmail;
        const result = await parkingLotHelper.parkCar(carData, parkingLotID, userEmail);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.delete('/leaveCar', validate({
    query: Joi.object({
        parkingLotID: Joi.string().required(),
        carID: Joi.string().required()
    })
}), apiValidator.customerAccessCheck, async (req, res) => {
    try {
        const parkingLotID = req.query.parkingLotID;
        const carID = req.query.carID;
        const result = await parkingLotHelper.leaveCar(parkingLotID, carID);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.get('/getParkingStatus', validate({
    query: Joi.object({
        parkingLotID: Joi.string().required()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const parkingLotID = req.query.parkingLotID;
        const result = await parkingLotHelper.getParkingStatus(parkingLotID);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.get('/getCarNosWithSameColor', validate({
    query: Joi.object({
        parkingLotID: Joi.string().required(),
        color: Joi.string().required()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const parkingLotID = req.query.parkingLotID;
        const color = req.query.color;
        const result = await parkingLotHelper.getCarNosWithSameColor(parkingLotID, color);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.get('/getSlotsWithSameColorCar', validate({
    query: Joi.object({
        parkingLotID: Joi.string().required(),
        color: Joi.string().required()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const parkingLotID = req.query.parkingLotID;
        const color = req.query.color;
        const result = await parkingLotHelper.getSlotsWithSameColorCar(parkingLotID, color);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.get('/getSlotByCarNumber', validate({
    query: Joi.object({
        parkingLotID: Joi.string().required(),
        carNo: Joi.string().required()
    })
}), apiValidator.rootAdminAccessCheck, async (req, res) => {
    try {
        const parkingLotID = req.query.parkingLotID;
        const carNo = req.query.carNo;
        const result = await parkingLotHelper.getSlotByCarNumber(parkingLotID, carNo);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

router.get('/getListOfCarsParked', validate({
    query: Joi.object({
        parkingLotID: Joi.string().required()
    })
}), apiValidator.customerAccessCheck, async (req, res) => {
    try {
        const userEmail = req.body.userEmail;
        const parkingLotID = req.query.parkingLotID;
        const result = await parkingLotHelper.getListOfCarsParked(parkingLotID, userEmail);
        res.status(200).json(helper.createResponseObject('result', result));
    } catch (error) {
        const errStatusCode = error.statusCode ? error.statusCode : 500;
        const errMessage = error.message ? error.message : error;
        res.status(errStatusCode).json(helper.createResponseObject('error', errMessage));
    }
});

module.exports = router;