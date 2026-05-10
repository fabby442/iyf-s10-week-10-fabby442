const store = require('../data/store');

// GET all posts
const getAllPosts = (req, res) => {
    res.json(store.posts);
};

// GET single post
const getPostById = (req, res) => {
    const post = store.posts.find(
        p => p.id === parseInt(req.params.id)
    );

    if (!post) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    res.json(post);
};

// CREATE post
const createPost = (req, res) => {
    const { title, content, author } = req.body;

    const newPost = {
        id: store.nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };

    store.posts.push(newPost);

    res.status(201).json(newPost);
};

// UPDATE post
const updatePost = (req, res) => {
    const post = store.posts.find(
        p => p.id === parseInt(req.params.id)
    );

    if (!post) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date().toISOString();

    res.json(post);
};

// DELETE post
const deletePost = (req, res) => {
    const index = store.posts.findIndex(
        p => p.id === parseInt(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    store.posts.splice(index, 1);

    res.status(204).send();
};

// LIKE post
const likePost = (req, res) => {
    const post = store.posts.find(
        p => p.id === parseInt(req.params.id)
    );

    if (!post) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    post.likes++;

    res.json(post);
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost
};