from typing import List, Dict

# Sample user data
user_data = {
    "interests": ["technology", "music", "gaming"],
    "biases": {"political": "liberal", "cultural": "open"},
    "personality_type": "ENTP",  # Myers-Briggs type
    "engagement_history": {"likes": ["post1", "post2"], "shares": ["post1"]}
}

# Sample content data
content_data = [
    {"id": "post1", "tags": ["technology", "innovation"], "likes": 100, "shares": 50, "novelty": 0.8},
    {"id": "post2", "tags": ["music", "pop culture"], "likes": 200, "shares": 30, "novelty": 0.5},
    {"id": "post3", "tags": ["gaming", "esports"], "likes": 150, "shares": 20, "novelty": 0.9}
]

def calculate_content_relevance(content_tags: List[str], user_interests: List[str]) -> float:
    """Calculate relevance based on overlapping tags and interests."""
    overlap = len(set(content_tags).intersection(set(user_interests)))
    return overlap / len(user_interests) if user_interests else 0

def calculate_social_proof(likes: int, shares: int) -> float:
    """Calculate social proof based on likes and shares."""
    return (likes + shares) / 1000  # Normalize to a score between 0 and 1

def calculate_bias_alignment(content_bias: str, user_bias: Dict[str, str]) -> float:
    """Calculate bias alignment based on user and content biases."""
    if content_bias == user_bias.get("political", ""):
        return 1.0
    return 0.5  # Neutral score if no match

def calculate_personality_match(content_personality: str, user_personality: str) -> float:
    """Calculate personality match based on Myers-Briggs types."""
    # Simplified: Exact match = 1, partial match = 0.5, no match = 0
    return 1.0 if content_personality == user_personality else 0.5

def calculate_novelty(novelty_score: float) -> float:
    """Return the novelty score as-is."""
    return novelty_score

def calculate_engagement_score(content: Dict, user_data: Dict) -> float:
    """Calculate the total engagement score for a piece of content."""
    relevance = calculate_content_relevance(content["tags"], user_data["interests"])
    social_proof = calculate_social_proof(content["likes"], content["shares"])
    bias_alignment = calculate_bias_alignment("liberal", user_data["biases"])  # Example bias
    personality_match = calculate_personality_match("ENTP", user_data["personality_type"])
    novelty = calculate_novelty(content["novelty"])

    # Weighted sum of scores
    engagement_score = (
        0.4 * relevance +
        0.3 * social_proof +
        0.1 * bias_alignment +
        0.1 * personality_match +
        0.1 * novelty
    )
    return engagement_score

def recommend_content(content_data: List[Dict], user_data: Dict) -> List[Dict]:
    """Recommend content based on engagement scores."""
    for content in content_data:
        content["engagement_score"] = calculate_engagement_score(content, user_data)
    return sorted(content_data, key=lambda x: x["engagement_score"], reverse=True)

# Example usage
recommended_content = recommend_content(content_data, user_data)
for content in recommended_content:
    print(f"Content ID: {content['id']}, Engagement Score: {content['engagement_score']}")
