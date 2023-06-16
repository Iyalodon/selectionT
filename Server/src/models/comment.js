module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    comment: {
      type: Sequelize.STRING,
    },
    // user_id
    // post_id
  });
  return Comment;
};
