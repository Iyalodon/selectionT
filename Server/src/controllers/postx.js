const db = require("../models");
const post_url = process.env.POST_URL;

const postController = {
  getAllPost: async (req, res) => {
    try {
      const { page, limit, search, category_id } = req.query;
      const currentPage = page || 1;
      const itemsPerPage = limit || 10;
      const offset = (currentPage - 1) * itemsPerPage;

      const { count, rows } = category_id
        ? await db.Post.findAndCountAll({
            include: db.Category,
            limit: parseInt(itemsPerPage),
            offset,
            where: {
              name: {
                [db.Sequelize.Op.like]: `%${search ? search : ""}%`,
              },
              category_id: category_id ? category_id : null,
            },
          })
        : await db.Product.findAndCountAll({
            include: db.Category,
            limit: parseInt(itemsPerPage),
            offset,
            where: {
              name: {
                [db.Sequelize.Op.like]: `%${search ? search : ""}%`,
              },
            },
          });

      const totalPages = Math.ceil(count / itemsPerPage);
      const { count: all } = await db.Product.findAndCountAll();
      const { count: pizza } = await db.Product.findAndCountAll({
        where: {
          category_id: 1,
        },
      });
      const { count: pasta } = await db.Product.findAndCountAll({
        where: {
          category_id: 2,
        },
      });

      return res.send({
        products: rows,
        totalPages,
        all,
        pizza,
        pasta,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getPostById: async (req, res) => {
    try {
      await db.Post.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  createNewPost: async (req, res) => {
    try {
      const { caption, userId } = req.body;
      const { filename } = req.file;

      await db.Post.create({
        image: post_url + filename,
        caption,
        userId,
      }).then(() => {
        res.send({
          message: "Post success",
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  editPost: async (req, res) => {
    try {
      const { name, price, description, category_id } = req.body;
      const { filename } = req.file;
      await db.Post.update(
        {
          name,
          price,
          description,
          category_id,
          product_url: productImage + filename,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      ).then((result) => res.send(result));
      // return res.send({ message: "edit berhasil" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    }
  },
  deletePost: async (req, res) => {
    await db.Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.send({ message: "success deleted" });
  },
};

module.exports = postController;
