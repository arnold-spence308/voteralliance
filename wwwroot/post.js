const savePost = async () => {
    const response = await fetch('http://127.0.0.1:5000/savePost', { // Flask URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'Arnold', content: 'Hello, Raven!' })
    });

    const data = await response.json();
    console.log(data);
};

const likePost = async () => {
    const response = await fetch('http://127.0.0.1:5000/likePost', { // Flask URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: 1 })
    });

    const data = await response.json();
    console.log(data);
};

savePost();
likePost();