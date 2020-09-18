const expect = require("chai").expect;
const sinon = require("sinon");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");
const parkingLotHelper = require("../../server/utils/parkingLotHelper");

describe("Unit test for /createParkingLot API", () => {

    before(() => {
        sinon.stub(parkingLotHelper, "createParkingLot").resolves({
            "result": {
                "parkingLotID": "c0ac32ba-1851-4409-b994-d8e9e059648b"
            }
        });
    })

    after(() => {
        parkingLotHelper.createParkingLot.restore();
    })

    it("should create a parking Lot", done => {
        request(app).post("/parkingLot/createParkingLot")
            .send({
                totalSlots: 100
            })
            .then(res => {
                const body = res.body;
                expect(body).to.contain.property("result");
                done();
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                done();
            })
    });
})