const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
//  User to test
let usr = {
    username: "test@ezwh.com",
    name: "Test",
    surname: "To Test",
    password: "testpassword",
    type: "clerk"
}

let users = [
    {
        username: "test@ezwh.com",
        name: "Test",
        surname: "To Test",
        password: "testpassword",
        type: "clerk"
    },
    {
        username: "supplier1@ezwh.com",
        name: "Rosario",
        surname: "Sorbello",
        password: "testpassword",
        type: "supplier"
    }];
let return_users = JSON.stringify([
    {
        email: "test@clerk.ezwh.com",
        id: 2,
        name: "Test",
        surname: "To Test",
        type: "clerk"
    },
    {
        email: "supplier1@supplier.ezwh.com",
        id: 3,
        name: "Rosario",
        surname: "Sorbello",
        type: "supplier"
    }
])

describe('get user', () => {
    
    before(async() => {
        await agent.post('/api/newUser')
        .send(usr)
        .then(function (res) {
            res.should.have.status(201);
        })
    });
    getUser('getting user data from the system', 200, {
        id: 2,
        username: "test@ezwh.com",
        name: "Test",
        password: "testpassword"
    });
    //  422
    getUser('empty body', 422, {})

    getUser('bad username format', 422, {
        id: 2,
        username: "tes",
        name: "Test",
        password: "testpassword"
    });

    getUser('bad password format', 422, {
        id:2,
        username: "tes",
        name: "Test",
        password: "test"
    });

    //  401
    getUser('not found: wrong username', 401, {
        id:2,
        username: "tes@ezwh.com",
        name: "Test",
        password: "testpassword"
    }, 401)

    getUser('not found: wrong password', 401, {
        id:2,
        username: "test@ezwh.com",
        name: "Test",
        password: "tespassword"
    })


    after(async() => {
        await agent.delete(`/api/users/${usr.username}/${usr.type}`);
    })
});

describe('new user', () => {
    //  201
    newUser('user created', 201, usr);

    //  422
    newUser('empty body', 422, {});
    newUser('wrong username format', 422, {
        username: "test",
        name: usr.name,
        surname: usr.surname,
        type: usr.type,
        password: usr.password
    })

    newUser('password too short', 422, {
        username: usr.username,
        name: usr.name,
        surname: usr.surname,
        type: usr.type,
        password: "test"
    })

    newUser('Types administrator/manager cannot be registered', 422, {
        username: usr.username,
        name: usr.name,
        surname: usr.surname,
        type: "manager",
        password: usr.password
    })

    //  409
    newUser('user already exists', 409, usr);

    after(async() => {await agent.delete(`/api/users/${usr.username}/${usr.type}`);})
})

/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
describe('modify permissions', () =>{
    before(async() => {
        await agent.post('/api/newUser')
        .send(usr)
        .then(function (res) {
            res.should.have.status(201);
        })
    });

    editUser("edited", 200, {oldType: "clerk", newType: "supplier"}, usr.username);

    //  422
    editUser("empty body", 422, {}, usr.username);
    editUser("cannot modify manager rights", 422, {oldType: "manager", newType: "supplier"}, "manager1@ezwh.com");
    editUser("cannot upgrade to manager", 422, {oldType: "clerk", newType: "manager"}, usr.username);
    editUser("is not email", 422, {oldType: "clerk", newType: "supplier"}, "manager")

    //  404
    editUser("user not found", 404, {oldType: "clerk", newType: "supplier"}, "pincopallino@ezwh.com");

    after(async() => {await agent.delete(`/api/users/${usr.username}/supplier`);})
    
})

describe('delete user', () => {
    before(async() => {
        await agent.post('/api/newUser')
        .send(usr)
        .then(function (res) {
            res.should.have.status(201);
        })
    });

    deleteUser("wrong user", 422, {username: "pippo", type: "clerk"});
    deleteUser("trying to delete a manager", 422, {username:"manager1@ezwh.com", type: "manager"});
    deleteUser("empty params", 422, {})
    deleteUser("deleted", 204, {username: usr.username, type: usr.type})

})

function newUser(name, expectedHTTPStatus, usr) {
    it(name, function (done) {
        if (usr !== undefined) {
            agent.post('/api/newUser')
                .send(usr)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    if(expectedHTTPStatus===409) {res.body.message.should.equal("User already exists")}
                    else if (expectedHTTPStatus===201) {res.body.message.should.equal("ok")}
                    else{}
                    done();
                }).catch(done);
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
                r.body.id.should.equal(2);
                r.body.name.should.equal(usr.name);
                r.body.username.should.equal(usr.username);
                done();
            }).catch(done);
        }
        else {
            agent.post('/api/clerkSessions')
            .send({username: usr.username, password: usr.password})
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus === 422) {r.body.error.should.equal('Unprocessable Entity')}
                else if(expectedHTTPStatus === 401) {r.body.message.should.equal("Wrong username and/or password")}
                else {r.body.message.should.equal("error")}
                done();
            }).catch(done);
        }
    })
}

function editUser(name, expectedHTTPStatus, body_req, param_req){
    it(name, function (done) {
        if(body_req){
            agent.put('/api/users/' + param_req)
                .send(body_req)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    if(expectedHTTPStatus === 200) {r.body.message.should.equal("ok")}
                    else if(expectedHTTPStatus === 422) {r.body.error.should.equal('Unprocessable Entity')}
                    else if(expectedHTTPStatus === 404) {r.body.error.should.equal("Not Found")}
                    else {r.body.error.should.equal("Service Unavailable")}
                    done();
                }).catch(done);
        }
        else {
            agent.put('/api/users/' + param_req)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.error.should.equal('Unprocessable Entity');
            })
        }
    })
}

function deleteUser(name, expectedHTTPStatus, param_req){
    it(name, function (done) {
        agent.delete(`/api/users/${param_req.username}/${param_req.type}`)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus === 204) {/* r.body.message.should.equal("success") */}
                else if(expectedHTTPStatus === 422) {r.body.error.should.equal('Unprocessable Entity')}
                else {r.body.error.should.equal("Service Unavailable")}
                done();
            }).catch(done);
    })
}