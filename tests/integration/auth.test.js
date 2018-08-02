const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

let server;
let token;

const exec = () => {
    return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });
};

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });
    
    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
     
    });

    it('should return 400 if invalid token is provided', async () => {
        token = 'sadasadasdsd';
        const res = await exec();
        expect(res.status).toBe(400);
     
    });

    it('should return 200 if valid token is provided', async () => {
        token = new User().generateAuthToken();
        const res = await exec();
        expect(res.status).toBe(200);
    
    });
});