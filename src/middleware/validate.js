const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;

    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }

    if (!author) {
        errors.push('Author is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = validatePost;