module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    image: {
      type: Sequelize.STRING,
    },
    caption: {
      type: Sequelize.STRING,
    },
    // user_id
  });
  return Post;
};
