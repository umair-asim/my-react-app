import { useEffect, useState } from 'react';
import { getAuthTokenHeader } from '../utils/auth';

export default function PostsPage({ posts, setPosts, user }) {
  const [loading, setLoading] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showCommentsId, setShowCommentsId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const headers = {};
    if (user) Object.assign(headers, getAuthTokenHeader());
    fetch('http://localhost:5000/api/posts', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Like/unlike handler
  const handleLike = async (postId, isLiked) => {
    if (!user) return;
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method,
        headers: getAuthTokenHeader(),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              user_liked: !isLiked,
              like_count: isLiked ? parseInt(post.like_count) - 1 : parseInt(post.like_count) + 1
            };
          }
          return post;
        }));
      }
    } catch (err) {
      
    }
  };

  // Delete post handler
  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthTokenHeader(),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setShowDeleteId(null);
      }
    } catch (err) {}
  };

  // Edit post handler
  const handleEdit = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          ...getAuthTokenHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: data.post.content } : p));
        setEditPost(null);
      }
    } catch (err) {}
  };

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    setCommentsLoading(true);
    setShowCommentsId(postId);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (err) {}
    setCommentsLoading(false);
  };

  // Add comment
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { ...getAuthTokenHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, data.comment]);
        setCommentText('');
        setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, comment_count: parseInt(post.comment_count) + 1 } : post));
      }
    } catch (err) {}
  };

  // Edit comment
  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { ...getAuthTokenHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: editCommentText }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.map(c => c.id === commentId ? { ...c, comment_text: editCommentText } : c));
        setEditCommentId(null);
        setEditCommentText('');
      }
    } catch (err) {}
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthTokenHeader(),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter(c => c.id !== commentId));
        // Find the postId for this comment
        const deletedComment = comments.find(c => c.id === commentId);
        if (deletedComment) {
          setPosts(prevPosts => prevPosts.map(post => post.id === deletedComment.post_id ? { ...post, comment_count: Math.max(0, parseInt(post.comment_count) - 1) } : post));
        }
      }
    } catch (err) {}
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0B1D26] py-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight text-center">Posts</h1>
        {loading && <div className="text-white text-center">Loading...</div>}
        {posts.length === 0 && !loading && (
          <div className="text-blue-100 text-center">No posts yet.</div>
        )}
        {posts.map(post => (
          <div key={post.id} className="bg-blue-500 shadow-2xl rounded-3xl p-8 border border-blue-700 flex flex-col items-center relative">
            {/* Edit/Delete buttons for owner */}
            {user && post.user_id === user.id && (
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                  onClick={() => setShowDeleteId(post.id)}
                  title="Delete"
                >
                  <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <rect x="5" y="6" width="14" height="14" rx="2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-2"
                  onClick={() => { setEditPost(post.id); setEditContent(post.content); }}
                  title="Edit"
                >
                  <svg width="18" height="18" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                </button>
              </div>
            )}
            {post.photo && (
              <img src={`http://localhost:5000${post.photo}`} alt="Post" className="mb-4 rounded-xl max-h-64 object-contain bg-white" />
            )}
            <div className="text-white text-lg mb-2 w-full text-center whitespace-pre-line">{post.content}</div>
            <div className="text-blue-100 text-sm mt-2">By {post.user_name || 'Unknown'} on {new Date(post.created_at).toLocaleString()}</div>
            {/* Like and comment buttons */}
            {user && (
              <div className="absolute left-6 bottom-6 flex items-center gap-4">
                {/* Like button */}
                <button
                  className="group p-1 rounded-full hover:bg-blue-600 transition-colors"
                  onClick={() => handleLike(post.id, post.user_liked)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    className="w-7 h-7 drop-shadow-lg"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      fill={post.user_liked ? '#EF4444' : 'none'}
                    />
                  </svg>
                </button>
                <span className="text-white text-xs font-semibold select-none">
                  {parseInt(post.like_count) || 0}
                </span>
                {/* Comment button */}
                <button
                  className="group p-1 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                  onClick={() => fetchComments(post.id)}
                  title="Show comments"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={parseInt(post.comment_count) > 0 ? '#22c55e' : 'none'} viewBox="0 0 24 24" stroke="#000" strokeWidth="2" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-black text-xs font-semibold select-none ml-1">
                    {parseInt(post.comment_count) || 0}
                  </span>
                </button>
              </div>
            )}
            {/* Comments modal */}
            {showCommentsId === post.id && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col gap-4 min-w-[350px] max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-lg font-bold text-blue-700">Comments</div>
                    <button className="text-gray-500 hover:text-black" onClick={() => setShowCommentsId(null)}>&times;</button>
                  </div>
                  {commentsLoading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {comments.length === 0 && <div className="text-gray-400 text-center">No comments yet.</div>}
                      {comments.map(comment => (
                        <div key={comment.id} className="bg-gray-100 rounded p-2 flex flex-col relative">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-blue-900 text-xs">{comment.user_name}</span>
                            <span className="text-gray-400 text-xs">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          {editCommentId === comment.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                className="border rounded p-1 text-sm"
                                value={editCommentText}
                                onChange={e => setEditCommentText(e.target.value)}
                              />
                              <div className="flex gap-2 justify-end">
                                <button className="px-2 py-1 rounded bg-gray-200 text-xs" onClick={() => setEditCommentId(null)}>Cancel</button>
                                <button className="px-2 py-1 rounded bg-blue-600 text-white text-xs" onClick={() => handleEditComment(comment.id)}>Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{comment.comment_text}</span>
                              {(user && (user.id === comment.user_id || user.id === post.user_id)) && (
                                <div className="flex gap-1 ml-2">
                                  {user.id === comment.user_id && (
                                    <button className="text-xs text-yellow-600 hover:underline" onClick={() => { setEditCommentId(comment.id); setEditCommentText(comment.comment_text); }}>Edit</button>
                                  )}
                                  <button className="text-xs text-red-600 hover:underline" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Add comment form */}
                  {user && (
                    <div className="flex gap-2 mt-2">
                      <input
                        className="flex-1 border rounded p-2 text-sm"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(post.id); } }}
                      />
                      <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={() => handleAddComment(post.id)}>Post</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Delete confirmation popup */}
            {showDeleteId === post.id && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col gap-4 min-w-[300px]">
                  <div className="text-lg font-bold text-red-700">Delete this post?</div>
                  <div className="flex gap-4 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowDeleteId(null)}>Cancel</button>
                    <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={() => handleDelete(post.id)}>Yes, Delete</button>
                  </div>
                </div>
              </div>
            )}
            {/* Edit post modal */}
            {editPost === post.id && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col gap-4 min-w-[300px]">
                  <div className="text-lg font-bold text-blue-700">Edit Post</div>
                  <textarea
                    className="border rounded p-2 min-h-[80px]"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-4 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setEditPost(null)}>Cancel</button>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => handleEdit(post.id)}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
