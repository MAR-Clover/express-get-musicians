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
        console.log(responseData.name)
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
    // Clear musicians table before each test to ensure a clean state
    await Musician.truncate();
    
    // Seed initial musicians to ensure the database starts with known data
    await Musician.bulkCreate([
      { name: "Musician 1", instrument: "Guitar" },
      { name: "Musician 2", instrument: "Drums" },
    ]);
  });

  // Test POST /musicians
  it("should add a new musician and return the updated list", async () => {
    const newMusician = { name: "Alice Cooper", instrument: "Vocals" };
    
    const response = await request(app).post("/musicians").send(newMusician);

    expect(response.status).toBe(201);

    expect(response.body).toHaveLength(3);
    console.log(response.body)
 
    const newMusicianInResponse = response.body[2];
    expect(newMusicianInResponse).toHaveProperty("id"); 
    expect(newMusicianInResponse.name).toBe(newMusician.name); 
    expect(newMusicianInResponse.instrument).toBe(newMusician.instrument); 

    console.log(response.body); 
  });


    // Test PUT /musician/:id
    it("should update an existing musician and return the updated list", async () => {
      const newMusician = await Musician.create({
        id:120,
        name:'The weeknd',
        instrument:"vocals"
      })
      const updatedData = { name: "John Legend", instrument: "Vocals" };

      const response = await request(app).put("/musicians/120").send(updatedData);

      console.log(response.body)
      expect(response.status).toBe(200); // Expect a 200 OK status for update
      expect(response.body).toHaveLength(3); // Ensure there are 3 musicians in the updated list
      expect(response.body[2]).toEqual(expect.objectContaining(updatedData)); // Verify the 3rd musician at 2nd index is updated musician data is in the response
  });
  
  
    // Test DELETE /musicians/:id
    it("should delete a musician", async () => {
      const response = await request(app).delete("/musicians/201");
  
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);

    });
  });



