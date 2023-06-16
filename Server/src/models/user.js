module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      name: {
        type: Sequelize.STRING,
      },
      //   role: {
      //     type: Sequelize.ENUM("ADMIN", "CASHIER"),
      //   },
      password: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      avatar_url: {
        type: Sequelize.STRING,
      },
      // phone: {
      //   type: Sequelize.STRING,
      // },
    },
    {
      paranoid: true,
    }
  );
  return User;
};
