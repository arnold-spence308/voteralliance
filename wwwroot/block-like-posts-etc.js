// Database configuration
const dbConfig = {
    host: 'localhost',
    database: 'RavenSM',
    user: 'postgres',
    password: '1@Chinchin234',
    port: 5432
};

// Current user state
let currentUser = {
    id: 1,
    username: 'current_user',
    name: 'Current User',
    followers: 42,
    following: 37
};

// Sample data - in a real app, this would come from the database
let users = [
    { id: 1, username: 'current_user', name: 'Current User', followers: 42, following: 37 },
    { id: 2, username: 'wise_raven', name: 'Wise Raven', followers: 1024, following: 56 },
    { id: 3, username: 'knowledge_seeker', name: 'Knowledge Seeker', followers: 237, following: 312 },
    { id: 4, username: 'philosopher', name: 'The Philosopher', followers: 876, following: 123 }
];

let posts = [
    { id: 1, userId: 2, content: "Wisdom begins in wonder. What are you wondering about today?", likes: 24, comments: 5, timestamp: '2023-05-15T10:30:00' },
    { id: 2, userId: 3, content: "Just discovered this amazing platform for sharing knowledge and ideas!", likes: 12, comments: 3, timestamp: '2023-05-14T15:45:00' },
    { id: 3, userId: 4, content: "The unexamined life is not worth living. Take time to reflect today.", likes: 56, comments: 8, timestamp: '2023-05-13T08:20:00' }
];

let userRelationships = [
    { userId: 1, follows: [2, 3], blocked: [] },
    { userId: 2, follows: [1, 4], blocked: [] },
    { userId: 3, follows: [1, 2], blocked: [] },
    { userId: 4, follows: [2], blocked: [] }
];

// DOM Elements
const postFeed = document.getElementById('post-feed');
const postContent = document.getElementById('post-content');
const createPostBtn = document.getElementById('create-post-btn');
const postDialog = document.getElementById('post-dialog');
const dialogPostContent = document.getElementById('dialog-post-content');
const confirmPostBtn = document.getElementById('confirm-post-btn');
const closeBtns = document.querySelectorAll('.close-btn');
const profileDialog = document.getElementById('user-profile-dialog');
const followBtn = document.getElementById('follow-btn');
const blockBtn = document.getElementById('block-btn');
const usernameDisplay = document.getElementById('username-display');
const followerCount = document.getElementById('follower-count');
const followingCount = document.getElementById('following-count');

// Initialize the app
function init() {
    // Set current user info
    usernameDisplay.textContent = `Welcome, ${currentUser.name}`;
    followerCount.textContent = currentUser.followers;
    followingCount.textContent = currentUser.following;
    
    // Load posts
    loadPosts();
    
    // Load suggested users
    loadSuggestedUsers();
    
    // Event listeners
    createPostBtn.addEventListener('click', createPost);
    confirmPostBtn.addEventListener('click', confirmPost);
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Simulate database connection
    connectToDatabase();
}

// Connect to PostgreSQL database
async function connectToDatabase() {
    try {
        // In a real app, you would use something like:
        // const { Client } = require('pg');
        // const client = new Client(dbConfig);
        // await client.connect();
        console.log('Connected to PostgreSQL database RavenSM');
        
        // For this demo, we'll just use the sample data
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

// Load posts into the feed
function loadPosts() {
    postFeed.innerHTML = '';
    
    // Sort posts by timestamp (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedPosts.forEach(post => {
        const user = users.find(u => u.id === post.userId);
        if (!user) return;
        
        const isFollowing = userRelationships.find(r => r.userId === currentUser.id)?.follows.includes(user.id);
        const isBlocked = userRelationships.find(r => r.userId === currentUser.id)?.blocked.includes(user.id);
        
        if (isBlocked) return;
        
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <a href="#" class="post-user" data-user-id="${user.id}">
                    <img src="default-avatar.jpg" alt="${user.name}" class="small-profile-pic">
                    <span>${user.name}</span>
                </a>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <div class="post-action ${isFollowing ? 'liked' : ''}" data-post-id="${post.id}">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="post-action">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments}</span>
                </div>
                <div class="post-action">
                    <i class="fas fa-share"></i>
                </div>
            </div>
        `;
        
        postFeed.appendChild(postElement);
    });
    
    // Add event listeners to user links
    document.querySelectorAll('.post-user').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const userId = parseInt(this.getAttribute('data-user-id'));
            showUserProfile(userId);
        });
    });
    
    // Add event listeners to like buttons
    document.querySelectorAll('.post-action').forEach(action => {
        action.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-post-id'));
            if (!isNaN(postId)) {
                toggleLike(postId);
            }
        });
    });
}

// Load suggested users
function loadSuggestedUsers() {
    const suggestionsContainer = document.querySelector('.user-suggestions');
    suggestionsContainer.innerHTML = '';
    
    // Get users not already followed by current user
    const currentUserRelationships = userRelationships.find(r => r.userId === currentUser.id);
    const suggestedUsers = users.filter(user => 
        user.id !== currentUser.id && 
        !currentUserRelationships.follows.includes(user.id) &&
        !currentUserRelationships.blocked.includes(user.id);
    
    // Sort by follower count (descending)
    suggestedUsers.sort((a, b) => b.followers - a.followers);
    
    // Take top 5
    const topSuggested = suggestedUsers.slice(0, 5);
    
    topSuggested.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'suggested-user';
        userElement.innerHTML = `
            <div class="user-info">
                <img src="default-avatar.jpg" alt="${user.name}" class="small-profile-pic">
                <div>
                    <div class="username">${user.name}</div>
                    <div class="followers">${user.followers} followers</div>
                </div>
            </div>
            <button class="follow-btn" data-user-id="${user.id}">Follow</button>
        `;
        
        suggestionsContainer.appendChild(userElement);
    });
    
    // Add event listeners to follow buttons
    document.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            followUser(userId);
        });
    });
}

// Create a new post
function createPost() {
    dialogPostContent.value = postContent.value || '';
    postDialog.style.display = 'block';
}

// Confirm and post the content
function confirmPost() {
    const content = dialogPostContent.value.trim();
    if (content) {
        // In a real app, this would be saved to the database
        const newPost = {
            id: posts.length + 1,
            userId: currentUser.id,
            content: content,
            likes: 0,
            comments: 0,
            timestamp: new Date().toISOString()
        };
        
        posts.unshift(newPost);
        loadPosts();
        
        // Clear the input
        postContent.value = '';
        dialogPostContent.value = '';
        closeModal();
        
        // Run engagement algorithm
        runEngagementAlgorithm(newPost);
    }
}

// Toggle like on a post
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        // In a real app, this would update the database
        post.likes += 1;
        loadPosts();
        
        // Run recommendation algorithm
        runRecommendationAlgorithm(post.userId);
    }
}

// Follow a user
function followUser(userId) {
    const relationship = userRelationships.find(r => r.userId === currentUser.id);
    if (relationship && !relationship.follows.includes(userId)) {
        relationship.follows.push(userId);
        currentUser.following += 1;
        followingCount.textContent = currentUser.following;
        
        // Update the followed user's follower count
        const followedUser = users.find(u => u.id === userId);
        if (followedUser) {
            followedUser.followers += 1;
        }
        
        loadSuggestedUsers();
        loadPosts();
    }
}

// Block a user
function blockUser(userId) {
    const relationship = userRelationships.find(r => r.userId === currentUser.id);
    if (relationship && !relationship.blocked.includes(userId)) {
        // If following, unfollow first
        const followIndex = relationship.follows.indexOf(userId);
        if (followIndex > -1) {
            relationship.follows.splice(followIndex, 1);
            currentUser.following -= 1;
            followingCount.textContent = currentUser.following;
        }
        
        relationship.blocked.push(userId);
        loadPosts();
        loadSuggestedUsers();
    }
}

// Show user profile
function showUserProfile(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const relationship = userRelationships.find(r => r.userId === currentUser.id);
    const isFollowing = relationship?.follows.includes(userId);
    const isBlocked = relationship?.blocked.includes(userId);
    
    // Update dialog content
    document.getElementById('dialog-username').textContent = user.name;
    document.getElementById('dialog-follower-count').textContent = user.followers;
    document.getElementById('dialog-following-count').textContent = user.following;
    
    // Count user's posts
    const postCount = posts.filter(p => p.userId === userId).length;
    document.getElementById('dialog-post-count').textContent = postCount;
    
    // Update follow button
    followBtn.textContent = isFollowing ? 'Following' : 'Follow';
    followBtn.disabled = isFollowing;
    
    // Update block button
    blockBtn.textContent = isBlocked ? 'Unblock User' : 'Block User';
    
    // Load user's posts
    const userPostsContainer = document.querySelector('.user-posts');
    userPostsContainer.innerHTML = '';
    
    const userPosts = posts.filter(p => p.userId === userId)
                          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-meta">
                ${new Date(post.timestamp).toLocaleString()} • ${post.likes} likes
            </div>
        `;
        userPostsContainer.appendChild(postElement);
    });
    
    // Update event listeners
    followBtn.onclick = () => {
        followUser(userId);
        profileDialog.style.display = 'none';
    };
    
    blockBtn.onclick = () => {
        blockUser(userId);
        profileDialog.style.display = 'none';
    };
    
    // Show dialog
    profileDialog.style.display = 'block';
}

// Close modal dialog
function closeModal() {
    postDialog.style.display = 'none';
    profileDialog.style.display = 'none';
}

// Engagement algorithm
function runEngagementAlgorithm(post) {
    // This is a simplified version - in a real app, this would be more sophisticated
    console.log(`Running engagement algorithm for post ${post.id}`);
    
    // Analyze content for keywords
    const keywords = extractKeywords(post.content);
    console.log('Detected keywords:', keywords);
    
    // Find users who might be interested based on keywords
    const interestedUsers = findInterestedUsers(keywords);
    console.log('Potential interested users:', interestedUsers.map(u => u.username));
    
    // In a real app, you might:
    // 1. Send notifications to interested users
    // 2. Boost the post in their feeds
    // 3. Suggest the post to similar users
}

// Recommendation algorithm
function runRecommendationAlgorithm(userId) {
    // This recommends similar users based on engagement patterns
    console.log(`Running recommendation algorithm based on interaction with user ${userId}`);
    
    // Find users with similar engagement patterns
    const similarUsers = findSimilarUsers(userId);
    console.log('Recommended similar users:', similarUsers.map(u => u.username));
    
    // In a real app, you might:
    // 1. Update the suggested users list
    // 2. Send notifications about similar users
    // 3. Adjust the user's feed algorithm
}

// Helper function to extract keywords from text
function extractKeywords(text) {
    // Simple implementation - in a real app you'd use NLP techniques
    const commonWords = new Set(['the', 'and', 'you', 'that', 'this', 'for', 'are', 'with']);
    const words = text.toLowerCase().split(/\W+/);
    const keywords = [];
    
    for (const word of words) {
        if (word.length > 3 && !commonWords.has(word)) {
            keywords.push(word);
        }
    }
    
    return [...new Set(keywords)]; // Remove duplicates
}

// Helper function to find interested users
function findInterestedUsers(keywords) {
    // Simple implementation - in a real app you'd use more sophisticated matching
    return users.filter(user => {
        // Check if user's name or username contains any keywords
        return keywords.some(keyword => 
            user.name.toLowerCase().includes(keyword) || 
            user.username.toLowerCase().includes(keyword)
        );
    });
}

// Helper function to find similar users
function findSimilarUsers(userId) {
    // Simple implementation - in a real app you'd use collaborative filtering
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return [];
    
    return users.filter(user => {
        return user.id !== userId && 
               user.id !== currentUser.id &&
               Math.abs(user.followers - targetUser.followers) < 200;
    }).slice(0, 3);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);