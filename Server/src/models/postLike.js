module.exports = (sequelize, Sequelize) => {
  const PostLike = sequelize.define("postlikes", {});
  return PostLike;
};
