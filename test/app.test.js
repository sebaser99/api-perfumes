const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe("Endpoints de app Perfumes", ()=> {
    test("Debería obtener una lista de perfumes", async()=> {
        const res = await request(app).get("/perfumes");

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    })

    test("Debería crear un libro", async()=> {
        const res = await request(app).post("/perfumes").send({nombre: "Le male", marca: "Jean Paul Gaultiere"})
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.nombre).toEqual("Le male");
        expect(res.body.data.marca).toEqual("Jean Paul Gaultiere");
    })

    afterAll(async ()=> {
        await mongoose.connection.close();
    })
})