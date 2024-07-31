const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(() => 'hashedpassword'),
  compareSync: jest.fn((password, hash) => password === 'password123' && hash === 'hashedpassword')
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocktoken')
}));

jest.mock('../../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  // Define User mock
  const UserMock = dbMock.define('users', {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword'
  });

  // Mock User.create method
  UserMock.create = jest.fn().mockImplementation((data) => {
    const instance = UserMock.build(data);
    instance.setRoles = jest.fn().mockResolvedValue(true);
    return Promise.resolve(instance);
  });

  // Define Role mock
  const RoleMock = dbMock.define('roles', {
    id: 1,
    name: 'user'
  });

  RoleMock.findAll = jest.fn().mockResolvedValue([RoleMock.build()]);

  // Mock Sequelize operators
  const Sequelize = require('sequelize');
  const Op = Sequelize.Op;

  return {
    user: UserMock,
    role: RoleMock,
    Sequelize: { Op }
  };
});

const app = express();
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

const authController = require('../../controllers/AuthController');
app.post('/signup', authController.signup);
app.post('/signin', authController.signin);
app.post('/signout', authController.signout);
app.put('/updateProfile', authController.updateProfile);
app.delete('/deleteaccount', authController.deleteaccount);

describe('Auth Controller', () => {
  beforeEach(() => {
    const { user } = require('../../models');

    // Prepare the user instance and mock getRoles
    const mockUserInstance = user.build({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    // Mock getRoles method
    mockUserInstance.getRoles = jest.fn().mockResolvedValue([
      { id: 1, name: 'user' }  // or use RoleMock.build()
    ]);

    // Mock findOne to return the user instance
    user.findOne = jest.fn().mockResolvedValue(mockUserInstance);

    // Queue the result for other test cases
    user.$queueResult(mockUserInstance);
  });

  test('signup creates a user and assigns roles', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roles: ['user']
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User registered successfully!');
    expect(bcrypt.hashSync).toHaveBeenCalled();
  });

  test('signin authenticates a user and returns a token', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('testuser');
    //expect(res.body.token).toBe('mocktoken');
    expect(jwt.sign).toHaveBeenCalled();
  });

  test('signout clears the session', async () => {
    const res = await request(app)
      .post('/signout');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("You've been signed out!");
  });

  test('updateProfile updates user details', async () => {
    const res = await request(app)
      .put('/updateProfile')
      .send({
        username: 'testuser',
        email: 'new@example.com'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully. Log Out to update changes');
  });

  test('updateProfile does not update user details because there is no change', async () => {
    const res = await request(app)
      .put('/updateProfile')
      .send({
        username: 'testuser',
        email: 'test@example.com'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully. Log Out to update changes');
  });

  test('deleteAccount deletes a user account', async () => {
    const res = await request(app)
      .delete('/deleteaccount')
      .send({
        username: 'testuser'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Account deleted successfully.');
  });
});
