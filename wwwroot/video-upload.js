const videoUpload = document.getElementById('video-upload');
const addVideoBtn = document.getElementById('add-video-btn');
const videoPreview = document.getElementById('video-preview');
const uploadedVideo = document.getElementById('uploaded-video');
const removeVideoBtn = document.getElementById('remove-video-btn');
const videoInfo = document.getElementById('video-info');
const createPostBtn = document.getElementById('create-post-btn');

let selectedVideoFile = null;

// Trigger file input when button is clicked
addVideoBtn.addEventListener('click', function () {
    videoUpload.click();
});

// Handle video selection
videoUpload.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];

        // Check if file is a video
        if (!file.type.startsWith('video/')) {
            alert('Please select a valid video file.');
            return;
        }

        // Create video element to check duration
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);

            // Check if video is longer than 1 minute
            if (video.duration > 60) {
                alert('Video must be 1 minute or shorter.');
                return;
            }

            // Video is valid, proceed with preview
            selectedVideoFile = file;
            uploadedVideo.src = URL.createObjectURL(file);
            videoPreview.style.display = 'block';
            videoInfo.textContent = `${file.name} (${formatDuration(video.duration)})`;
            videoInfo.style.display = 'inline';
        };

        video.src = URL.createObjectURL(file);
    }
});

// Remove video
removeVideoBtn.addEventListener('click', function () {
    selectedVideoFile = null;
    uploadedVideo.src = '';
    videoPreview.style.display = 'none';
    videoInfo.style.display = 'none';
    videoUpload.value = '';
});

// Format duration as MM:SS
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Modify post creation to handle video upload
createPostBtn.addEventListener('click', async function () {
    const postContent = document.getElementById('post-content').value;

    if (!postContent && !selectedVideoFile) {
        alert('Please add some content or a video to your post.');
        return;
    }

    const formData = new FormData();
    formData.append('content', postContent);
    if (selectedVideoFile) {
        formData.append('video', selectedVideoFile);
    }

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header when using FormData
            // The browser will set it automatically with the correct boundary
        });

        if (response.ok) {
            const newPost = await response.json();
            addPostToFeed(newPost);
            // Reset form
            document.getElementById('post-content').value = '';
            if (selectedVideoFile) {
                removeVideoBtn.click(); // Trigger removal
            }
        } else {
            throw new Error('Failed to create post');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post. Please try again.');
    }
});

// Function to add post to feed (modify to handle video posts)
function addPostToFeed(post) {
    const feed = document.getElementById('post-feed');
    const postElement = document.createElement('div');
    postElement.className = 'post';

    let videoHtml = '';
    if (post.videoUrl) {
        videoHtml = `
                <div class="post-video">
                    <video controls style="max-width: 100%;">
                        <source src="${post.videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
    }// JavaScript source code
