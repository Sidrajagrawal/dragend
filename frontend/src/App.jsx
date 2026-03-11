import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
//import Footer from './Components/Home/Footer';
import Workspace from './Components/Workspace/Workspace';
//import { Header } from './Components/layout/Header';
import { DragEndCreateFlow } from './Components/CreateProject/flow/DragendCreateFlow';
import Auth from './Components/Auth/Auth';
import UserGuide from './Components/Workspace/UserGuide'
import LivePreview from './Components/Workspace/LivePreview/LivePreview'
//
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:projectId/workflow" element={<Workspace />} />
        <Route path="/new" element={<DragEndCreateFlow />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/live-preview" element={<LivePreview />} />
      </Routes>
    </Router>
  )
}

export default App;
