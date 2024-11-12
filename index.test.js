// install dependencies
const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const { db } = require('./db/connection');
const { Musician } = require('./models/index')
const app = require('./src/app');
const {seedMusician} = require("./seedData");


describe('./musicians endpoint', () => {
    // Write your tests here

    it("endpoint is functional", async () =>{
        const response = await request(app).get('/musicians')
        expect(response.statusCode).toBe(200)
    })

    it("endpoint returns correct info", async () =>{
        const response = await request(app).get('/musicians')

        const responseData = JSON.parse(response.text)

        //make sure array is not empty
        expect(responseData.length).toBeGreaterThan(0);
        
        //check that each property has necessary fields:

        responseData.forEach(item => {
            expect(item).toHaveProperty("id")
            expect(item).toHaveProperty("name")
            expect(item).toHaveProperty("instrument")
            expect(item).toHaveProperty("createdAt")
            expect(item).toHaveProperty("updatedAt")
        });
        
        //first name in array should be mick jagger
        expect(responseData[0].name).toBe("Mick Jagger")

    })

    test("musicians/:id endpoint retrieves musician correctly", async () =>{
        const response = await request(app).get('/musicians/1')

        const responseData = JSON.parse(response.text)

        expect(responseData.name).toBe("Mick Jagger")
    })
    
})

describe('./bands endpoint', () => {

    test("band endpoint is functional", async () => {
        const response = await request(app).get('/bands')
        expect(response.statusCode).toBe(200)
    })
})



