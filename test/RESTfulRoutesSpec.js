/**
 * Test dependencies
 */

var cwd = process.cwd()
  , path = require('path')
  , chai = require('chai')
  , expect = chai.expect
  , request = require('supertest')
  ;


/**
 * Should style assertions
 */

chai.should();


/**
 * Test application
 */

var express = require('express')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , Model = require('modinha')
  , app = express()
  ;


var Resource = Model.extend(null, {
  schema: {
    name: { type: 'string', required: true },
    desc: { type: 'string' }
  }
});


app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());  
  app.use(app.router);
  app.use(function (err, req, res, next) {
    console.log(err)
    res.send(err.statusCode || 500, err);
  });
});

passport.use('basic', new BasicStrategy(function (username, password, done) {
  if (username !== 'foo' || password !== 'bar') {
    done(null, false);
  } else {
    next(null, {});
  }
}));

require('../index')(app);

app.resource('/resources', Resource);
app.resource('/private', Resource, passport.authenticate('basic', { session: false }))


/**
 * Spec
 */

describe('RESTful Resource', function () {

  var res;


  before(function (done) {
    Resource.create({ name: 'Whatever' }, function (error, instance) {
      resource = instance;
      done();
    });
  });


  describe('GET /resources', function () {

  });


  describe('GET /resources/:id', function () {

    before(function (done) {
      request(app)
        .get('/resources/' + resource._id)
        .end(function (error, response) {
          err = error;
          res = response;
          done();
        });
    });

    it('should respond 200', function () {
      res.statusCode.should.equal(200);
    });

    it('should respond with JSON', function () {
      res.headers['content-type'].should.contain('application/json');
    });

    it('should respond with a resource', function () {
      res.body.name.should.equal('Whatever');
    });

  });


  describe('POST /resources', function () {

    before(function (done) {
      Resource.backend.reset();
      request(app)
        .post('/resources')
        .send({ name: 'New' })
        .end(function (error, response) {
          err = error;
          res = response;
          done();
        });
    });

    it('should respond 201', function () {
      res.statusCode.should.equal(201);
    });

    it('should respond with JSON', function () {
      res.headers['content-type'].should.contain('application/json');
    });

    it('should create a new resource', function () {
      Resource.backend.documents[0].name.should.equal('New');
    });

  });


  describe('PUT /resources/:id', function () {

    before(function (done) {
      Resource.backend.reset();
      Resource.create({ name: 'initial' }, function (err, instance) {
        request(app)
          .put('/resources/' + instance._id)
          .send({ name: 'changed' })
          .end(function (error, response) {
            err = error;
            res = response;
            done();
          });
      });
    });

    it('should respond 200', function () {
      res.statusCode.should.equal(200);
    });

    it('should respond with JSON', function () {
      res.headers['content-type'].should.contain('application/json');
    });

    it('should create a new resource', function () {
      Resource.backend.documents[0].name.should.equal('changed');
    });

  });


  describe('DELETE /resources/:id', function () {

    before(function (done) {
      Resource.backend.reset();
      Resource.backend.documents.length.should.equal(0);

      Resource.create({ name: 'to be deleted' }, function (err, instance) {
        request(app)
          .del('/resources/' + instance._id)
          .end(function (error, response) {
            err = error;
            res = response;
            done();
          });
      });
    });

    it('should respond 204', function () {
      res.statusCode.should.equal(204);
    });

    it('should destroy the resource resource', function () {
      Resource.backend.documents.length.should.equal(0);
    });

  });


  describe('with middleware', function () {

    before(function (done) {
      Resource.backend.reset();
      request(app)
        .post('/private')
        .send({ name: 'New' })
        .end(function (error, response) {
          err = error;
          res = response;
          done();
        });
    });

    it('should respond 401', function () {
      res.statusCode.should.equal(401);
    });

    it('should respond "Unauthorized"', function () {
      res.text.should.equal('Unauthorized');
    });

  });

});