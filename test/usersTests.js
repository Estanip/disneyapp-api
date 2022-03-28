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