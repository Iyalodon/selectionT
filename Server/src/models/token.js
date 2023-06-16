module.exports = (sequelize, Sequelize) => {
  const Token = sequelize.define(
    "tokens",
    {
      token: {
        type: Sequelize.STRING,
      },
      expired: {
        type: Sequelize.DATE,
      },
      payload: {
        type: Sequelize.STRING,
      },
      valid: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: Sequelize.ENUM("LOGIN", "FORGOT-PASSWORD"),
      },
    },
    { paranoid: true }
  );
  return Token;
};
