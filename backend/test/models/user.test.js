const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const User = require('../../models/user.js')(dbMock, dbMock.Sequelize);

describe('User Model', () => {
  it('should create a user', async () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(mockUser);

    expect(user.username).toBe(mockUser.username);
    expect(user.email).toBe(mockUser.email);
    expect(user.password).toBe(mockUser.password);
  });

  it('should have the correct table name', () => {
    expect(User.getTableName()).toBe('users');
  });
});
