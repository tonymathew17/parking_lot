const { v4: uuidv4 } = require('uuid');
const parkingLotDBModel = require('../models/parkingLot');

/**
 * @description: This method will create a new parkingLot and returns the parking Lot ID
 * @param {*} slots - Number of slots to be created
 * @returns - parking lot ID
 * 
 */
const createParkingLot = async totalSlots => {
    try {
        const parkingLotID = uuidv4();
        const parkingLotDoc = new parkingLotDBModel({
            parkingLotID,
            totalSlots,
            availableSlots: totalSlots,
            slots: new Array(totalSlots).fill(null)
        })
        await parkingLotDoc.save();
        return { parkingLotID }
    } catch (error) {
        console.log(`There was an error inside createParkingLot(): ${error.message}`);
        throw new Error(error);
    }
}

/**
 * @description - This function increases the parking slots count
 * @param {*} increaseBy - Number by which parking slots should be increased
 */
const updateParkingLot = async (parkingLotID, increaseBy) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        await parkingLotDBModel.findOneAndUpdate({ parkingLotID }, { $inc: { totalSlots: increaseBy, availableSlots: increaseBy } });
        return "Updated";
    } catch (error) {
        console.log(`There was an error inside updateParkingLot(): ${error.message}`);
        throw new Error(error);
    }
}

/**
 * @description - This function saves carData in DB and returns the parking slot
 * @param {*} carData 
 * @param {*} parkingLotID 
 */
const parkCar = async (carData, parkingLotID, userEmail) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        const availableSlots = parkingLotData.availableSlots;
        let carID;
        let carSlot;
        if (availableSlots > 0) {
            carID = uuidv4();
            carData.carID = carID;
            carData.userEmail = userEmail;
            parkingLotData.availableSlots -= 1;
            let slots = parkingLotData.slots;
            for (let i = 0; i <= slots.length; i++) {
                if (slots[i] == null) {
                    slots.splice(i, 1, carData);
                    if (!parkingLotData['carMap']) parkingLotData['carMap'] = {};
                    parkingLotData.carMap[carID] = i;
                    carSlot = i;
                    carData.slot = i;
                    break;
                }
            }
            parkingLotData.slots = slots;
            await parkingLotDBModel.findOneAndUpdate({ parkingLotID }, parkingLotData);
            return { carID, slot: carSlot };
        } else {
            throw new Error("Parking Lot full!");
        }
    } catch (error) {
        console.log(`There was an error inside parkCar(): ${error.message}`);
        throw new Error(error);
    }
}

/**
 * @description - This function wipes carData from DB when unparked
 * @param {*} parkingLotID 
 * @param {*} carID 
 */
const leaveCar = async (parkingLotID, carID) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        const availableSlots = parkingLotData.availableSlots;
        if (availableSlots > 0) {
            parkingLotData.availableSlots += 1;
            let carMap = parkingLotData.carMap;
            const carIndex = carMap[carID];
            let slots = parkingLotData.slots;
            slots.splice(carIndex, 1, null);
            parkingLotData.slots = slots;
            delete carMap[carID];
            await parkingLotDBModel.findOneAndUpdate({ parkingLotID }, parkingLotData);
            return {
                message: 'car data wiped from db'
            };
        } else {
            throw new Error("Parking Lot already empty!");
        }
    } catch (error) {
        console.log(`There was an error inside leaveCar(): ${error.message}`);
        throw new Error(error);
    }
}

/**
 * @description - This function returns parking status of a particular parkingLot
 * @param {*} parkingLotID 
 */
const getParkingStatus = async parkingLotID => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        return {
            availableSlots: parkingLotData.availableSlots,
            slotsState: parkingLotData.slots
        }
    } catch (error) {
        console.log(`There was an error inside leaveCar(): ${error.message}`);
        throw new Error(error);
    }

}

/**
 * @description - This function gets the registration numbers of all cars of a particular colour.
 * @param {*} parkingLotID 
 * @param {*} color 
 */
const getCarNosWithSameColor = async (parkingLotID, color) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        let parkingData = parkingLotData.slots;
        let registrationNumbers = [];
        for (let i = 0; i < parkingData.length; i++) {
            if (parkingData[i]) {
                if (parkingData[i].color === color) {
                    registrationNumbers.push(parkingData[i].carNo)
                }
            }
        }
        return registrationNumbers;
    } catch (error) {
        console.log(`There was an error inside getCarNosWithSameColor(): ${error.message}`);
        throw new Error(error);
    }
}

/**
 * @description - This function gets the slot numbers of all slots where a car of a particular colour is parked.
 * @param {*} parkingLotID 
 * @param {*} color 
 */
const getSlotsWithSameColorCar = async (parkingLotID, color) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        let parkingData = parkingLotData.slots;
        let slotNumbers = [];
        for (let i = 0; i < parkingData.length; i++) {
            if (parkingData[i]) {
                if (parkingData[i].color === color) {
                    slotNumbers.push(parkingData[i].slot)
                }
            }
        }
        return slotNumbers;
    } catch (error) {
        console.log(`There was an error inside getSlotsWithSameColorCar(): ${error.message}`);
        throw new Error(error);
    }
}

/**
 * @description - This function gets the slot number in which a car with a given registration number is parked.
 * @param {*} parkingLotID 
 * @param {*} carNo 
 */
const getSlotByCarNumber = async (parkingLotID, carNo) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        let parkingData = parkingLotData.slots;
        let carData = parkingData.find(item => { if (item) return item.carNo === carNo });
        if (!carData) throw new Error("No car found with the given car number!");
        return carData.slot;
    } catch (error) {
        console.log(`There was an error inside getSlotByCarNumber(): ${error.message}`);
        throw new Error(error);
    }
}

const getListOfCarsParked = async (parkingLotID, userEmail) => {
    try {
        let parkingLotData = (await parkingLotDBModel.find({ parkingLotID }).lean())[0];
        if (!parkingLotData) {
            throw new Error("Invalid parkingLot ID");
        }
        let parkingData = parkingLotData.slots;
        let carData = parkingData.filter(item => { if (item) return item.userEmail === userEmail });
        if (!carData) throw new Error("No car found with the given user ID!");
        return carData;
    } catch (error) {
        console.log(`There was an error inside getListOfCarsParked(): ${error.message}`);
        throw new Error(error);
    }
}

module.exports = {
    createParkingLot,
    updateParkingLot,
    parkCar,
    leaveCar,
    getParkingStatus,
    getCarNosWithSameColor,
    getSlotsWithSameColorCar,
    getSlotByCarNumber,
    getListOfCarsParked
}