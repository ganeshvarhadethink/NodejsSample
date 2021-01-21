module.exports = (sequelize, Sequelize) => {
  let Organization = sequelize.define(
    "organization",
    {
      id: {
        type: Sequelize.BIGINT,
        field: "id",
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      business_name: {
        type: Sequelize.STRING,
        field: "business_name",
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        field: "phone_number",
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        field: "website",
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        field: "status",
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        field: "city",
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        field: "state",
        allowNull: true,
      },
      org_type: {
        type: Sequelize.STRING,
        field: "org_type",
        allowNull: true,
      },
      parent_id: {
        type: Sequelize.BIGINT,
        field: "parent_id",
        allowNull: true,
      },
      s3imageurl: {
        type: Sequelize.STRING,
        field: "s3imageurl",
        allowNull: true,
      },
      time_interval: {
        type: Sequelize.INTEGER,
        field: "time_interval",
        defaultValue: 10,
        allowNull: false,
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
      freezeTableName: true, // Model tableName will be the same as the model name
    }
  );

  Organization.associate = function (model) {
    Organization.belongsTo(model.Address, {
      foreignKey: "address_id",
      onDelete: "CASCADE",
      hooks: true,
    });

    Organization.hasOne(model.User, {
      foreignKey: "organization_id",
      as: "users",
      onDelete: "CASCADE",
      hooks: true,
    });

    Organization.hasOne(model.DevicePolicy, {
      foreignKey: "organization_id",
      as: "devicepolicies",
      onDelete: "CASCADE",
      hooks: true,
    });

    Organization.hasOne(model.DeviceLocation, {
      foreignKey: "organization_id",
      as: "devicelocations",
      onDelete: "CASCADE",
      hooks: true,
    });

    Organization.hasOne(model.Device, {
      foreignKey: "organization_id",
      as: "devices",
      onDelete: "CASCADE",
      hooks: true,
    });
    Organization.hasOne(model.Endpoint, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
      hooks: true,
    });

    Organization.hasOne(model.IperfData, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
      hooks: true,
    });
    Organization.hasOne(model.TraceRoute, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
      hooks: true,
    });
  };
  return Organization;
};
