let posts = [
    {
        id: 1,
        title: "Getting Started with Node.js",
        content: "Node.js is a JavaScript runtime...",
        author: "John Doe",
        createdAt: "2026-01-15T10:00:00Z",
        likes: 10
    },
    {
        id: 2,
        title: "Express.js Fundamentals",
        content: "Express is a web framework...",
        author: "Jane Smith",
        createdAt: "2026-01-16T14:30:00Z",
        likes: 15
    }
];

let nextId = 3;

module.exports = {
    posts,
    nextId
};