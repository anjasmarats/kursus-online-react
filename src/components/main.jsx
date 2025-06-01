import { createRoot } from 'react-dom/client'
import App from './Home/App.jsx'
import '../styles/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register.jsx'
import Logout from './Logout.jsx'
import PostCourse from './CourseInfo/PostCourse.jsx'
import DetailCourse from './CourseInfo/DetailCourse.jsx'
import { Provider } from 'react-redux'
import { store,persistor } from '../app/store.js'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Register loginPage={true}/>} />
          <Route path="logout" element={<Logout />} />
          <Route path="post/course" element={<PostCourse />} />
          <Route path="detail/course/:id" element={<DetailCourse />} />
        </Routes>
      </PersistGate>
    </Provider>
  </Router>,
)
