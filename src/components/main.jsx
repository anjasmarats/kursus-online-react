import { createRoot } from 'react-dom/client'
import App from './Home/App.jsx'
import '../styles/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register.jsx'
import Logout from './Logout.jsx'
import PostCourse from './PostCourse.jsx'
import DetailCourse from './CourseInfo/DetailCourse.jsx'
import { Provider } from 'react-redux'
import { store } from '../app/store.js'

createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Register loginPage={true}/>} />
        <Route path="logout" element={<Logout />} />
        <Route path="post/course" element={<PostCourse />} />
        <Route path="edit/course/:id" element={<DetailCourse />} />
      </Routes>
    </Provider>
  </Router>,
)
