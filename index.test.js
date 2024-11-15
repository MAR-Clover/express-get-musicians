// install dependencies
const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const { db } = require('./db/connection');
const { Musician } = require('./models/index')
const app = require('./src/app');
const {seedMusician} = require("./seedData");

describe("Express-validator checks for musicians /put", () => {
  it("should return error when updating with name less than 2 characters", async () => {

    const musician = await Musician.findOne({ where: { name: "Drake" } });

    // sanity check to make sure musician exists
    if (!musician) {
      console.error(`Musician not found: Ensure ${musician} exists in the test database.`);
      return;
    }

    const musicianId = musician.id;
    const updatedMusicianValues = { name: "a", instrument: "saxophone" };
    const response = await request(app).put(`/musicians/${musicianId}`).send(updatedMusicianValues);

    expect(response.status).toBe(400); 
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Name must be between 2 and 20 characters", 
          path: "name", 
        }),
      ])
    );
  });

  it("should return error when updating with name over 20 characters", async () => {

    const musician = await Musician.findOne({ where: { name: "Drake" } });

    // sanity check to make sure musician exists
    if (!musician) {
      console.error(`Musician not found: Ensure ${musician} exists in the test database.`);
      return;
    }

    const musicianId = musician.id;
    const updatedMusicianValues = { name: "abcdefghijklmnopqrstuvwxyzabcds", instrument: "saxophone" };
    const response = await request(app).put(`/musicians/${musicianId}`).send(updatedMusicianValues);

    expect(response.status).toBe(400); 
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Name must be between 2 and 20 characters", 
          path: "name", 
        }),
      ])
    );
  });


  //Musicians instrument length test:
  it("should return error when updating with instrument less than 2 characters", async () => {

    const musician = await Musician.findOne({ where: { name: "Drake" } });

    // sanity check to make sure musician exists
    if (!musician) {
      console.error(`Musician not found: Ensure ${musician} exists in the test database.`);
      return;
    }

    const musicianId = musician.id;
    const updatedMusicianValues = { name: "21 savage", instrument: "s" };
    const response = await request(app).put(`/musicians/${musicianId}`).send(updatedMusicianValues);

    expect(response.status).toBe(400); 
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Instrument must be between 2 and 20 characters", 
          path: "instrument", 
        }),
      ])
    );
  });

  it("should return error when updating with instrument over 20 characters", async () => {

    const musician = await Musician.findOne({ where: { name: "Drake" } });

    // sanity check to make sure musician exists
    if (!musician) {
      console.error(`Musician not found: Ensure ${musician} exists in the test database.`);
      return;
    }

    const musicianId = musician.id;
    const updatedMusicianValues = { name: "21 savage", instrument: "saxophonesaxophonesaxophone" };
    const response = await request(app).put(`/musicians/${musicianId}`).send(updatedMusicianValues);

    expect(response.status).toBe(400); 
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Instrument must be between 2 and 20 characters", 
          path: "instrument", 
        }),
      ])
    );
  });
});



describe("Express-validator checks for musicians /post", () =>{
  it("should return an errors array when name isnt passed", async () => {
    const invalidMusician = { name: "", instrument: "Guitar" };
    const invalidResponse = await request(app).post("/musicians").send(invalidMusician);

    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Name cannot be empty",
          path: "name",
        }),
      ])
    );

    const invalidMusician2 = { name: "John", instrument: "" };
    const invalidResponse2 = await request(app).post("/musicians").send(invalidMusician2);

    expect(invalidResponse2.status).toBe(400);
    expect(invalidResponse2.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Instrument cannot be empty",
          path: "instrument",
        }),
      ])
    );
  })
})
describe("bands endpoint", () => {
  it("/ returns all bands", async () =>{

    const response = await request(app).get("/bands")

    const responseData = JSON.parse(response.text)
    //expects 3 items
    expect(responseData.length).toBe(3)
    //tests that each item in response has necessary properties
      responseData.forEach(item => {
        expect(item).toHaveProperty("id")
        expect(item).toHaveProperty("name")
        expect(item).toHaveProperty("genre")
    });
  })

  it("/:id returns specific band by id", async () =>{

    const response = await request(app).get("/bands/1")

    console.log(response.body)
    //expects 3 items
    expect(response.body.name).toBe("The Beatles")
  
  })
  
})


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
    
    // Seed initial musician
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
      expect(response.status).toBe(200); 
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



