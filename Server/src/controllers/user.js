const db = require("../models");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const private_key = process.env.private_key;
const { nanoid } = require("nanoid");
const moment = require("moment");
const url = process.env.URL;
const mailer = require("../lib/mailer");
const image_url = process.env.URL_IMAGE;
const sharp = require("sharp");
const { Op } = require("sequelize");

const userController = {
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      console.log(hashPassword);

      await db.User.create({
        email,
        password: hashPassword,
        name,
      });

      return res.send({
        message: "register berhasil",
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where: {
          // [Op.or]: [{ email: emus }, { username: emus }],
          email,
        },
      });

      if (user) {
        const match = await bcrypt.compare(password, user.dataValues.password);
        if (match) {
          const payload = {
            id: user.dataValues.id,
          };

          const generateToken = nanoid();
          console.log(nanoid());
          const token = await db.Token.create({
            expired: moment().add(1, "days").format(),
            token: generateToken,
            payload: JSON.stringify(payload),
            status: "LOGIN",
          });

          console.log(token);

          return res.send({
            message: "login berhasil",
            value: user,
            token: token.dataValues.token,
          });
        } else {
          throw new Error("wrong password");
        }
      } else {
        throw new Error("user not found");
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    }
  },

  getByTokenV2: async (req, res, next) => {
    try {
      console.log(req.body);
      const token = req.headers.authorization.split(" ")[1];

      console.log(token);
      let p = await db.Token.findOne({
        where: {
          token,
          expired: {
            [db.Sequelize.Op.gte]: moment().format(),
          },
          valid: true,
        },
      });

      if (!p) {
        throw new Error("token has expired");
      }
      console.log(p.dataValues);
      user = await db.User.findOne({
        where: {
          id: JSON.parse(p.dataValues.payload).id,
        },
      });
      //id,email,nama,password,dll

      delete user.dataValues.password;

      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
    }
  },

  getUserByToken: async (req, res) => {
    // delete user.dataValues.password;
    res.send(req.user);
  },

  generateTokenByEmail: async (req, res) => {
    try {
      const { email } = req.query;

      const user = await db.User.findOne({
        where: {
          email,
        },
      });
      console.log(`user ${user}`);

      if (user.dataValues) {
        // cek apa ada token yg mengarah ke id user tsb
        await db.Token.update(
          {
            valid: false,
          },
          {
            where: {
              payload: JSON.stringify({ id: user.dataValues.id }),
              // { "id" : 1 }
              status: "FORGOT-PASSWORD",
            },
          }
        );

        const generateToken = nanoid();
        const token = await db.Token.create({
          expired: moment().add(1, "days").format(),
          token: generateToken,
          payload: JSON.stringify({ id: user.dataValues.id }),
          status: "FORGOT-PASSWORD",
        });

        mailer({
          subject: "forgot-password-link",
          to: "7iiv9xdtcf@gixenmixen.com",
          text: url + token.dataValues.token,
        });

        // return res.send({ url: url + token.dataValues.token });
        // return res.send({
        //  nav: '/forgot-password/' + token.dataValues.token
        //  // nav : "/forgot-password/abc123"
        // });

        return res.send({ message: "silahkan check email anda" });
      } else {
        throw new Error("user not found");
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const { password } = req.body.user;
      const { id } = req.user;

      console.log(password);

      const hashPassword = await bcrypt.hash(password, 10);

      await db.User.update(
        {
          password: hashPassword,
        },
        {
          where: {
            id,
          },
        }
      );

      await db.Token.update(
        {
          valid: false,
        },
        {
          where: {
            token,
          },
        }
      );

      res.send({
        message: "password berhasil diupdate",
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  uploadAvatar: async (req, res) => {
    const { filename } = req.file;

    await db.User.update(
      {
        avatar_url: image_url + filename,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    await db.User.findOne({
      where: {
        id: req.params.id,
      },
    }).then((result) => res.send(result));

    // res.send(filename);
  },
  uploadAvatar2: async (req, res) => {
    const buffer = sharp(req.file).resize(250, 250).png().toBuffer();

    let fullUrl =
      req.protocol +
      "://" +
      req.get("host") +
      "/auth/image/render/" +
      req.params.id;

    console.log(fullUrl);
    await db.User.update(
      {
        avatar_url: fullUrl,
        //avatar_url : url + 'auth/image/render/' +req.params.id
        avatar_blob: buffer,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    // await db.User.findOne({
    //   where: {
    //     id: req.params.id,
    //   },
    // }).then((result) => res.send(result));

    res.send(buffer);
  },
  renderAvatar: async (req, res) => {
    try {
      await db.User.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        res.set("Content-type", "image/png");

        res.send(result.dataValues);
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};

module.exports = userController;

// hello3 salt 1 => abc123456c=> hello3 =>
// hello3a salt 2 => abc654321 => heallo3 =>

// hoc => token localstorage => req backend get
// user by id => respond => dispatch

// http://localhost:3000/forgot-password/DIjeA2YhdvH06CbRG1Mmk
