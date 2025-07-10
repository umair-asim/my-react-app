import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PostsPage from './pages/PostsPage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Navbar from './components/Navbar';
import AddPostModal from './components/AddPostModal';
import { getAuthTokenHeader } from './utils/auth';

export default function AppRoutes({ user, setUser, logout }) {
  const navigate = useNavigate();
  const [showAddPost, setShowAddPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleSignInSuccess = ({ user, token }) => {
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };
  const handleSignUpSuccess = ({ user, token }) => {
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const handleAddPost = async ({ content, photo }) => {
    setLoadingPost(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (photo) formData.append('photo', photo);
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
        headers: getAuthTokenHeader(),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts([data.post, ...posts]);
        setShowAddPost(false);
      }
    } catch (err) {
      console.error('Post error:', err);
      alert('Failed to create post.');
    }
    setLoadingPost(false);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} onAddPost={() => setShowAddPost(true)} />
      <AddPostModal open={showAddPost} onClose={() => setShowAddPost(false)} onSubmit={handleAddPost} loading={loadingPost} />
      <Routes>
        <Route path="/" element={<PostsPage posts={posts} setPosts={setPosts} user={user} />} />
        <Route path="/signin" element={<SignIn onSignIn={handleSignInSuccess} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUpSuccess} />} />
      </Routes>
    </>
  );
}
