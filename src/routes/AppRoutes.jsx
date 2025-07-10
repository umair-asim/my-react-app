import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostsPage from '../pages/PostsPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

export default function AppRoutes({ user, logout, handleSignIn, handleSignUp }) {
  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<PostsPage user={user} />} />
        <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
      </Routes>
    </>
  );
}
