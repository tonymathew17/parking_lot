const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

/**
 * @description - This middleware function validates if the incoming request is coming from a root or admin user
 * @param {*} req - Request object
 * @param {*} res - Response object
 * @param {*} next - next() is used to call the next middleware function
 */
const rootAdminAccessCheck = async (req, res, next) => {
    const token = req.header('accessToken');
    if (!token) return res.status(401).send('Add accessToken in header');

    // Verifying token
    try {
        const requestData = jwt.verify(token, process.env.SECRET_KEY);

        // Checking if the incoming request is either from root/admin user, if the user is not disabled, and if its a valid user
        const user = await userModel.findOne({ userEmail: requestData.userEmail }).lean();
        if (user && ["root", "admin"].includes(requestData.userType) && !requestData.isDisabled) {
            next();
        } else {
            return res.status(401).send('Access Denied!');
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") return res.status(401).send('Token has expired');
        console.log(`There was an error inside getParkingStatusAPIValidator(): ${error.message}`);
        return res.status(401).send('Some Error happened, please try again later!');
    }
}

/**
 * @description - This middleware function checks if the incoming request is from a valid customer
 * @param {*} req - Request object
 * @param {*} res - Response object
 * @param {*} next - next() is used to call the next middleware function
 */
const customerAccessCheck = (req, res, next) => {
    const token = req.header('accessToken');
    if (!token) return res.status(401).send('Add accessToken in header');

    // Verifying token
    try {
        const requestData = jwt.verify(token, process.env.SECRET_KEY);
        if (requestData.userType === "customer") {
            req.body.userEmail = requestData.userEmail;
            next();
        } else {
            return res.status(401).send('Access Denied!');
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") return res.status(401).send('Token has expired');
        console.log(`There was an error inside parkCarAPIValidator(): ${error.message}`);
        return res.status(401).send('Some Error happened, please try again later!');
    }
}

module.exports = {
    rootAdminAccessCheck,
    customerAccessCheck
}
