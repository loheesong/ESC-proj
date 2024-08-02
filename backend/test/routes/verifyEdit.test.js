const { checkDuplicateUsername } = require('../../middleware/verifyEdit');
const db = require('../../models');
const User = db.user;

jest.mock('../../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const UserMock = dbMock.define('users', {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  });

  const SecondUserMock = dbMock.define('users', {
    id: 2,
    username: 'seconduser',
    email: 'second@example.com'
  });

  return {
    user: UserMock,
    secondUser: SecondUserMock
  };
});

describe('verifyEdit Test', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        oldname: 'testuser',
        username: 'newuser',
        email: 'new@example.com'
      }
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn()
    };
    next = jest.fn();
  });

  test('no changes made - no action taken', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      username: 'testuser',
      email: 'test@example.com'
    }).mockResolvedValueOnce({
      username: 'testuser',
      email: 'test@example.com'
    });

    await checkDuplicateUsername(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "No changes made" });
    expect(next).not.toHaveBeenCalled();
  });

  test('changing to an existing username', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      username: 'testuser',
      email: 'test@example.com'
    }).mockResolvedValueOnce({
      username: 'seconduser',
      email: 'second@example.com'
    });

    await checkDuplicateUsername(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "Failed. Username is already in use." });
    expect(next).not.toHaveBeenCalled();
  });

  test('changing to existing email', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      username: 'testuser',
      email: 'test@example.com'
    }).mockResolvedValueOnce(null).mockResolvedValueOnce({
      username: 'seconduser',
      email: 'second@example.com'
    });

    await checkDuplicateUsername(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "Failed. Email is already in use." });
    expect(next).not.toHaveBeenCalled();
  });
});
