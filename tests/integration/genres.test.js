const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {

    beforeEach(() => {
        server = require('../../index');
    });

    afterEach( async () => {
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id)
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404);
        });

        it('should return 404 if valid id cannot be found', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        // define happy path helper func:
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name, });
        };

        beforeEach(() => {
            // happy path values
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 4 characters', async () => {
            name = '123';
            const res =  await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 20 characters', async () => {
            name = new Array(22).join('a');
            const res =  await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is found', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /', () => {

        let id;
        let token = '';
        let name;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name, });
        };

        it('should return a 401 if client is not logged in', async () => {
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return a 400 if client sends a bad request', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            token = new User().generateAuthToken();
            id = genre._id;
            name = 2; //bad request since genre cannot be a number
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if it cannot find the genre to update', async() => {
            token = new User().generateAuthToken();
            id = mongoose.Types.ObjectId(); // valid but not existing ID
            name = 'validGenre';
            const res = await exec();
            expect(res.status).toBe(404);
        })
    });
});