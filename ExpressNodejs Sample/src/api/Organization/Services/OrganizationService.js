const model = require("../../../Database/dbconfig");

exports.create = async (data) => {
  return await model.Organization.create(data);
};

exports.getAll = async (filter) => {
  return await model.Organization.findAll({
    where: {
      [model.Sequelize.Op.or]: [
        {
          company_name: {
            [model.Sequelize.Op.iLike]: "%" + filter,
          },
        },
        {
          company_name: {
            [model.Sequelize.Op.startsWith]: filter,
          },
        },
        {
          company_name: {
            [model.Sequelize.Op.endsWith]: filter,
          },
        },
        {
          company_name: {
            [model.Sequelize.Op.substring]: filter,
          },
        },
      ],
    },
  });
};

exports.get = async (organization_id) => {
  return await model.Organization.findOne({
    where: {
      id: organization_id,
    },
  });
};

exports.update = async (organization_id, data) => {
  return await model.Organization.update(data, {
    returning: true,
    plain: true,
    where: { id: organization_id },
  });
};

exports.delete = async (organization_id) => {
  return await model.Organization.destroy({
    where: {
      id: organization_id,
    },
  });
};
