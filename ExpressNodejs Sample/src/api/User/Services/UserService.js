const model = require("../../../Database/dbconfig");

exports.create = async (data) => {
  return await model.User.create(data);
};

exports.getAll = async () => {
  return await model.User.findAll();
};

exports.get = async (email) => {
  return await model.User.findOne({
    where: {
      email: email,
    },
    include: [
      {
        model: model.Request,
      },
      {
        model: model.Organization,
        where: {
          id: { [model.Sequelize.Op.col]: "user.organization_id" },
        },
        required: false,
      },
    ],
  });
};

exports.update = async (User_id, data) => {
  return await model.User.update(data, {
    returning: true,
    plain: true,
    where: { id: User_id },
  });
};

exports.delete = async (User_id) => {
  return await model.User.destroy({
    where: {
      id: User_id,
    },
  });
};
