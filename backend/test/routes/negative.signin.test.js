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

  const SecondUserMock = dbMock.define('users', {
    id: 2,
    username: 'seconduser',
    email: 'second@example.com',
    password: 'secondhashedpassword'
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
    secondUser: SecondUserMock,
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

describe('Negative Auth Controller', () => {
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

  test('signin with wrong password', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid Password!");
  });

  test('signin with non-existing username', async () => {
    const { user } = require('../../models');

    // Mock findOne to return null for this specific test case
    user.findOne = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .post('/signin')
      .send({
        username: 'notarealuser',
        password: 'testing123'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User Not found.");
  });
});
