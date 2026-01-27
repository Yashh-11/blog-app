import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import MyBlogs from './pages/MyBlogs';
import './main.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/add-blog" 
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-blog/:id" 
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-blogs" 
          element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
