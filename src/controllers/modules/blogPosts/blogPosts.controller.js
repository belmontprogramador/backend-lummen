const service = require("./blogPosts.service");
const sanitizeHtml = require("sanitize-html");
const slugify = require("slugify");

module.exports = {
  async create(req, res) {
    try {
      const cover = req.files?.cover?.[0]?.filename;
      const banner = req.files?.banner?.[0]?.filename;

      const sanitizedContent = sanitizeHtml(req.body.content);

      const data = {
        title: req.body.title,
        subtitle: req.body.subtitle || null,
        content: sanitizedContent,
        slug: slugify(req.body.title, { lower: true }),
        authorId: req.user.id,
        categoryId: req.body.categoryId || null,
        coverImage: cover ? `/uploads/blog/${cover}` : null,
        bannerImage: banner ? `/uploads/blog/${banner}` : null,
      };

      const post = await service.create(data);
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const posts = await service.list(page, limit);
      res.json(posts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listMine(req, res) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const posts = await service.listByAuthor(
        req.user.id,
        page,
        limit
      );

      res.json(posts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const post = await service.getOne(req.params.id);
      res.json(post);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const cover = req.files?.cover?.[0]?.filename;
      const banner = req.files?.banner?.[0]?.filename;

      await service.verifyOwnership(req.params.id, req.user);

      const data = {
        title: req.body.title,
        subtitle: req.body.subtitle || null,
        content: req.body.content
          ? sanitizeHtml(req.body.content)
          : undefined,
        categoryId: req.body.categoryId || null,
        ...(cover && { coverImage: `/uploads/blog/${cover}` }),
        ...(banner && { bannerImage: `/uploads/blog/${banner}` }),
      };

      const post = await service.update(req.params.id, data);
      res.json(post);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  },

  async listByCategory(req, res) {
  try {
    const { value } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const posts = await service.listByCategory(value, page, limit);
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
},

  async remove(req, res) {
    try {
      await service.verifyOwnership(req.params.id, req.user);
      await service.remove(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  },
};
