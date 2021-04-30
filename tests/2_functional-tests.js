const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, 769235418851496372432178956174569283395842761628713549283657194516924837947381625);
        done();
      });
  });
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send()
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });
  test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: '0.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  })
  test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: '.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
        done();
      });
  });
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: '.99..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });
  test('Check a puzzle placement with all fields: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a2',
        value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['column'] });
        done();
      });
  });
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a2',
        value: '2'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['column', 'region'] });
        done();
      });
  });
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '5'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
        done();
      });
  });
  test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        coordinate: 'a2',
        value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });
  test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '0.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a2',
        value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });
  test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a2',
        value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
        done();
      });
  });
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'k2',
        value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {error: "Invalid coordinate"});
        done();
      });
  });
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a2',
        value: '0'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });

});

