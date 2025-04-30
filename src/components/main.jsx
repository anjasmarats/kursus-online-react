import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../styles/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register.jsx'
import Logout from './Logout.jsx'
import PostCourse from './PostCourse.jsx'
import EditCourse from './EditCourse.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Register loginPage={true}/>} />
      <Route path="logout" element={<Logout />} />
      <Route path="post/course" element={<PostCourse />} />
      <Route path="edit/course/:id" element={<EditCourse />} />
    </Routes>
  </Router>,
)
