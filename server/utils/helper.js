/**
 * @description - This function returns a JSON object
 * @param {*} type - Key
 * @param {*} data - Value
 */
const createResponseObject = (type, data) => {
    return {
        [type]: data
    };
}

module.exports = {
    createResponseObject
}