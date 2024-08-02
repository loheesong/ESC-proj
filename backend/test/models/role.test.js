const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const Role = require('../../models/role.js')(dbMock, dbMock.Sequelize);

describe('Role Model', () => {
  it('should create a role', async () => {
    const mockRole = {
      id: 1,
      name: 'admin'
    };

    const role = await Role.create(mockRole);

    expect(role.id).toBe(mockRole.id);
    expect(role.name).toBe(mockRole.name);
  });

  it('should have the correct table name', () => {
    expect(Role.getTableName()).toBe('roles');
  });
});
