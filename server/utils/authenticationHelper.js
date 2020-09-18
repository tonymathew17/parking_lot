const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/configuration.json");

/**
 * @description - This function connects to db and saves user data while registering
 * @param {*} userDetails 
 */
const registerUser = async userDetails => {
    try {
        // Checking if Email already exists
        const emailExist = await userModel.findOne({ userEmail: userDetails.userEmail });
        if (emailExist) throw new Error("Email already exists");

        // Hashing password
        const hashedPwd = await bcrypt.hash(userDetails.password, 10);
        userDetails.password = hashedPwd;

        // Saving new user details to DB
        const user = new userModel(userDetails);
        await user.save();
        return "User Details saved successfully!";
    } catch (error) {
        console.log(`There was an error inside registerUser(): ${error.message}`);
        throw new Error(error);
    }
};

/**
 * @description - This function validates the incoming login request
 * @param {*} userDetails 
 */
const loginUser = async userDetails => {
    try {
        // Checking if Email exists
        const user = await userModel.findOne({ userEmail: userDetails.userEmail }).lean();
        if (!user) throw new Error("Email or password is not correct");

        // Validating password
        const isPwdValid = await bcrypt.compare(userDetails.password, user.password);
        if (!isPwdValid) throw new Error("Email or password is not correct");

        const { userEmail, userType, isDisabled } = user;
        // Generating token
        return await jwt.sign({ userEmail, userType, isDisabled }, process.env.SECRET_KEY, { expiresIn: config.tokenExpiry });
    } catch (error) {
        console.log(`There was an error inside loginUser(): ${error.message}`);
        throw new Error(error);
    }
};

const disableAdminUser = async userEmail => {
    try {
        // Checking if we are trying to update root admin user
        const rootUser = await userModel.findOne({ userType: "root" });
        if (userEmail === rootUser.userEmail) throw new Error("Root Admin user cannot be disabled!");

        // Updating
        await userModel.updateOne({ userEmail }, { $set: { isDisabled: true } });
        return "Updated";
    } catch (error) {
        console.log(`There was an error inside getSlotByCarNumber(): ${error.message}`);
        throw new Error(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    disableAdminUser
}