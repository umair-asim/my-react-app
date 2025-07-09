import { useEffect, useState } from 'react';

export default function PostsPage({ posts, setPosts }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0B1D26] py-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight text-center">Posts</h1>
        {loading && <div className="text-white text-center">Loading...</div>}
        {posts.length === 0 && !loading && (
          <div className="text-blue-100 text-center">No posts yet.</div>
        )}
        {posts.map(post => (
          <div key={post.id} className="bg-blue-500 shadow-2xl rounded-3xl p-8 border border-blue-700 flex flex-col items-center">
            {post.photo && (
              <img src={`http://localhost:5000${post.photo}`} alt="Post" className="mb-4 rounded-xl max-h-64 object-contain bg-white" />
            )}
            <div className="text-white text-lg mb-2 w-full text-center whitespace-pre-line">{post.content}</div>
            <div className="text-blue-100 text-sm mt-2">By {post.user_name || 'Unknown'} on {new Date(post.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
