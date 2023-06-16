const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
const routes = require("./routes");
const db = require("./models/");
// db.sequelize.sync({ alter: true });

app.get("/", (req, res) => res.send("sequelize"));

app.use("/users", routes.userRoutes);
app.use("/posts", routes.postRoutes);
app.use("/postess", express.static(`${__dirname}/public/postess`));

// app.use('/attendance', routes.programRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
