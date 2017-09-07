process.env.NODE_ENV = 'test';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../');
const should = chai.should();

chai.use(chaiHttp)
let user, movie

describe('Authentication Tests', function() {
  const newUser = {
    email: `coolguyaaron@gmail.com`,
    password: 'ASecretSoBigNoOneCanBreak'
  }
  const wrongPasswordUser = {
    email: `coolguyaaron@gmail.com`,
    password: 'password'
  }

  // this is expected to work the first time. Fail everytime thereafter
  describe('Registration', function() {
    it('Should register a new user', function(done) {
      chai.request(server).post('/register').send(newUser).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('_id');
        res.body.user.should.have.property('token');
        done();
      });
    });

    it('Should fail to register with an email already taken', function(done) {
      chai.request(server).post('/register').send(newUser).end(function (err, res) {
        assert.equal(err, undefined)
        res.should.have.status(200);
        assert.equal(res.body.success, true)
        res.body.success.should.be.a('boolean');
        assert.equal(res.body.message, "User with that email already taken.")
        res.body.should.not.have.property('user')
        done();
      });
    });
  });

  describe('Login', function() {
    it('Should login successfully', function (done) {
      chai.request(server).post('/login').send(newUser).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('_id');
        res.body.user.should.have.property('token');
        user = res.body.user
        done();
      });
    });
    it('Should send back an unauthorized error', function(done) {
      chai.request(server).post('/login').send(wrongPasswordUser).end(function (err, res) {
        res.should.have.status(401);
        done();
      });
    });
    it('Should send back a not found error', function(done) {
      chai.request(server).post('/login').send({user: 'aaron@test.com', password: 'hello123'}).end(function (err, res) {
        res.should.have.status(400);
        done();
      });
    });
  });

});

describe('Movie Tests', function() {
  const newMovie = {
    imagePoster: '',
    title: 'Testing Title',
    genre: 'Testing Genre',
    rating: '10',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2017'
  }

  describe('Create', function() {
    it('Should create a new movie with the API', function(done) {
      chai.request(server).post('/movie').set('Authorization', user.token).send(newMovie).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
  });

  // this is expected to work the first time. Fail everytime thereafter
  describe('Read', function() {
    it('Should send back a list of all movies', function(done) {
      chai.request(server).get('/movies').end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.movies.should.be.a('array');
        assert.equal(res.body.movies.length, 1)
        done();
      });
    });
  });

  // The following left blank on purpose. They must be implemented.
  describe('Update', function() {
    it('Should update a movie', function(done)
       const updatedMovie = {
    imagePoster: '',
    title: 'Testing Title 1',
    genre: 'Testing Genre 1',
    rating: '8',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2018'
  }
       {
      chai.request(server).post('/movie/${movie._id}').set('Authorization', user.token).send(updatedMovie).end(function (err, res) {
        assert.equal(err, undefined)
        assert.eqaul(res.body.sucess, true)
        res.should.have.status(200);
        res.body.movie.should.have.property('movie');
        done();
    });
  });

  describe('Delete', function() {
    it('Should remove the created user', function(done) {
      chai.request(server).delete('/movie/${movie._id}').set('Authorization', user.token).send()
         assert.eqaul(res.body.sucess, true)
         res.should.have.status(200);
         done();
    });
  });

});
