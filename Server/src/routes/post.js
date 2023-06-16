const express = require("express");
const { fileUploader } = require("../middleware/multer");
const router = express.Router();
const postController = require("../controllers").postController;

//get all product
router.get("/", postController.getAllPost);
//
router.get("/v1", postController.getPostById);

//edit product
router.patch(
  "/:id",
  fileUploader({
    destinationFolder: "post",
  }).single("post"),
  postController.editPost
);

//new post
router.post(
  "/",
  fileUploader({ destinationFolder: "postess" }).single("image"),
  postController.createNewPost
);

//delete product
router.delete("/:id", postController.deletePost);

//detail product
// router.get("/:id", productController.getProductById);

module.exports = router;
