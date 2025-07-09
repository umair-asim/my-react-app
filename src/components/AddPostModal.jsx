import { useRef, useState } from 'react';

export default function AddPostModal({ open, onClose, onSubmit, loading }) {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const fileInput = useRef();

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !photo) return;
    onSubmit({ content, photo });
    setContent('');
    setPhoto(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <textarea
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-lg resize-none"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleFileChange}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Add Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
