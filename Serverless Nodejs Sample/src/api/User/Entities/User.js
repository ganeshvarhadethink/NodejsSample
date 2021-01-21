module.exports = (sequelize, Sequelize) => {
  let User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
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
        allowNull: true,
      },
      email_id: {
        type: Sequelize.STRING,
        field: "email_id",
        allowNull: false,
        unique: true,
      },
      user_name: {
        type: Sequelize.STRING,
        field: "user_name",
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        field: "password",
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        field: "status",
        allowNull: true,
      },
      s3imageurl: {
        type: Sequelize.STRING,
        field: "s3imageurl",
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        field: "role",
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "creation_date",
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "last_update_date",
        allowNull: true,
      },
    },
    {
      freezeTableName: true, // Model tableName will be the same as the model name
    }
  );

  User.associate = function (model) {
    User.belongsTo(model.Organization, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
      hooks: true,
    });
  };

  return User;
};
