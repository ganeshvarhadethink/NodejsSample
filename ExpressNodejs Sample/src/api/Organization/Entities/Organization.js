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
      company_name: {
        type: Sequelize.STRING,
        field: "company_name",
        allowNull: false,
        unique: true,
      },
      addressLineOne: {
        type: Sequelize.STRING,
        field: "addressLineOne",
        allowNull: false,
      },
      addressLineTwo: {
        type: Sequelize.STRING,
        field: "addressLineTwo",
        allowNull: false,
      },
      country: {
        type: Sequelize.JSON,
        field: "country",
        allowNull: true,
      },
      state: {
        type: Sequelize.JSON,
        field: "state",
        allowNull: true,
      },
      city: {
        type: Sequelize.JSON,
        field: "city",
        allowNull: true,
      },
      zipCode: {
        type: Sequelize.STRING,
        field: "zipCode",
        allowNull: true,
      },
      billing_contact: {
        type: Sequelize.JSON,
        field: "billing_contact",
        allowNull: true,
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

  Organization.associate = function (model) {
    Organization.hasMany(model.User, {
      foreignKey: "organization_id",
      as: "organizations",
      hooks: true,
    });
    Organization.hasMany(model.Request, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
    });
    Organization.hasMany(model.Appliance, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
    });
    Organization.hasMany(model.Site, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
    });
    Organization.hasMany(model.Host, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
    });
    Organization.hasMany(model.Dongle, {
      foreignKey: "organization_id",
      onDelete: "CASCADE",
    });
  };
  return Organization;
};
