const assert = require('chai').assert;
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3008';


describe('Insert username, email and password: ', () => {
    it('should insert a username, email and password', (done) => {
        chai.request(url)
            .post('/auth/register')
            .send({ username: "Carlos", email: 'carlos@carlos.com', password: 'carlospass' })
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Get all characters details: ', () => {
    it('create a character', (done) => {
        chai.request(url)
            .post('/characters/create')
            .send({ id: "7ee02c9a-7e17-45af-97a8-36be74bbd3a7", image: "test-img", name: "Test", age: 33, weight: 56, history: "Test history", movies: [] })
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            })
    });
});

describe('Get all characters details: ', () => {
    it('should return an object with id, name, age, weight, history and movies', (done) => {
        chai.request(url)
            .get(`/characters/details/7ee02c9a-7e17-45af-97a8-36be74bbd3a7`)
            .end(function (err, res) {
                console.log(res.body)
                expect(res.body).to.deep.nested.property('character.id');
                assert.isString(res.body.character.id, 'id must be a string');
                expect(res.body).to.deep.nested.property('character.image');
                assert.isString(res.body.character.image, 'image must be a string');
                expect(res.body).to.deep.nested.property('character.name');
                assert.isString(res.body.character.name, 'name must be a string');
                expect(res.body).to.deep.nested.property('character.age');
                assert.isNumber(res.body.character.age, 'age must be a number');
                expect(res.body).to.deep.nested.property('character.weight');
                assert.isNumber(res.body.character.weight, 'weight must be a number');
                expect(res.body).to.deep.nested.property('character.history');
                assert.isString(res.body.character.history, 'history must be a number');
                expect(res.body).to.deep.nested.property('character.movies');
                assert.isArray(res.body.character.movies, 'movies is an Array?');
                expect(res).to.have.status(200);
                done();
            })
    })
});

