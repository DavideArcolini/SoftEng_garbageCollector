const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('get user', () => {

    /*newUser(201, 'mmz', 'Maurizio', "Morisio", "admin");
    newUser(422);*/
    let usr = {
        username: "test@ezwh.com",
        name: "Test",
        surname: "To Test",
        password: "testpassword",
        type: "clerk"
    }
    beforeEach(async() => {
        await agent.post('/api/newUser')
        .send(usr)
        .then(function (res) {
            res.should.have.status(201);
        })
    });
    getUser('getting user data from the system', 200, {
        username: "test@ezwh.com",
        name: "Test",
        password: "testpassword"
    });
    //  422
    getUser('bad username format', 422, {
        username: "tes",
        name: "Test",
        password: "testpassword"
    });

    getUser('bad password format', 422, {
        username: "tes",
        name: "Test",
        password: "test"
    });

    //  401
    getUser('not found: wrong username', 401, {
        username: "tes@ezwh.com",
        name: "Test",
        password: "testpassword"
    }, 401)

    getUser('not found: wrong password', 401, {
        username: "test@ezwh.com",
        name: "Test",
        password: "tespassword"
    })


    afterEach(async() => {
        await agent.delete(`/api/users/${usr.username}/${usr.type}`);
    })
});
/*
newUser(201, {
    username: "test@ezwh.com",
    name: "Test",
    surname: "To Test",
    password: "testpassword",
    type: "clerk"
})
*/
async function newUser(name, expectedHTTPStatus, usr) {
    it(name, function (done) {
        if (usr !== undefined) {
            agent.post('/api/newUser')
                .send(usr)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/newUser') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function getUser(name, expectedHTTPStatus, usr) {
    it(name, function (done) {
        if(expectedHTTPStatus===200){
        agent.post('/api/clerkSessions')
            .send({username: usr.username, password: usr.password})
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.name.should.equal(usr.name);
                r.body.username.should.equal(usr.username);
                done();
            });
        }
        else {
            agent.post('/api/clerkSessions')
            .send({username: usr.username, password: usr.password})
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    })
}



