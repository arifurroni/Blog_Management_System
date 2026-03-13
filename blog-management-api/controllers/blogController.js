

const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  const { title, content, authorName, tags, blogImage } = req.body;

  const blog = await Blog.create({
    title,
    content,
    authorName,
    tags,
    blogImage,
    user: req.user._id,
  });

  res.status(201).json(blog);
};

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find().populate("user", "name email");

  res.json(blogs);
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;

  const updatedBlog = await blog.save();

  res.json(updatedBlog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  await blog.deleteOne();

  res.json({
    message: "Blog deleted",
  });
};


