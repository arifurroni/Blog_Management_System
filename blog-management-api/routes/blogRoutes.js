

const express = require("express");

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBlog);

router.get("/", protect, getBlogs);

router.get("/:id", protect, getBlogById);

router.put("/:id", protect, updateBlog);

router.delete("/:id", protect, deleteBlog);

module.exports = router;


