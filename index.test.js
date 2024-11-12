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

    //testing musicians/:id endpoint
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

describe("Musician API", () => {
    beforeEach(async () => {
        await Musician.sync({ force: true }); // Reset the table
        await Musician.bulkCreate([
          { id: 1, name: "John Doe", instrument: "Guitar" },
          { id: 2, name: "Jane Smith", instrument: "Piano" },
        ]);
      });

    // Test POST /musician
    it("should add a new musician and return the updated list", async () => {
      const newMusician = { name: "Alice Cooper", instrument: "Vocals" };
      const response = await request(app).post("/musician").send(newMusician);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[2]).toEqual(expect.objectContaining(newMusician));
    });
  
    // Test PUT /musician/:id
    it("should update an existing musician and return the updated list", async () => {
      const updatedData = { name: "John Lennon", instrument: "Vocals" };
      const response = await request(app).put("/musician/1").send(updatedData);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual(expect.objectContaining(updatedData));
    });
  
    // Test DELETE /musicians/:id
    it("should delete a musician", async () => {
      const response = await request(app).delete("/musicians/2");
  
      expect(response.status).toBe(200);
    });
  });



