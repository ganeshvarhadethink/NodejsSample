module.exports = (sequelize, Sequelize) => {
  let User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.BIGINT,
        field: "id",
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        field: "first_name",
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        field: "last_name",
        allowNull: false,
      },
      mobile_number: {
        type: Sequelize.STRING,
        field: "mobile_number",
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        field: "email",
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        field: "password",
        allowNull: false,
      },
      mfa_enabled: {
        type: Sequelize.BOOLEAN,
        field: "mfa_enabled",
        allowNull: false,
        defaultValue: false,
      },
      last_login: {
        type: Sequelize.STRING,
        field: "last_login",
        allowNull: true,
      },
      temprory_otp: {
        type: Sequelize.STRING,
        field: "temprory_otp",
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING,
        field: "ip_address",
        allowNull: true,
      },
      user_role: {
        type: Sequelize.STRING,
        field: "user_role",
        allowNull: false,
        defaultValue: "user",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  User.associate = function (model) {
    User.belongsTo(model.Organization, {
      foreignKey: "organization_id",
    });
    User.hasMany(model.Log, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    User.hasMany(model.Request, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return User;
};
