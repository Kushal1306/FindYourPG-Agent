

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import NotFoundPage from './pages/NotFound'
import PGIndexForm from './pages/pgIndex'
import ChatUI from './pages/Chat'



function App() {
  return (
    // <PageTracker>
    <GoogleOAuthProvider clientId='951522285736-dge67ps62hcv421d7qcbqdv64vp9gusl.apps.googleusercontent.com'>
      <Router>
        <Routes>
          <Route path="/" element={<ChatUI />} />
          <Route path="/chat" element={<ChatUI />} />
          <Route path="/pg/index" element={<PGIndexForm />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
    // </PageTracker>
  )
}

export default App