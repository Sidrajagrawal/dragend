import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Footer from './Components/Home/Footer';
import Workspace from './Components/Workspace/Workspace';
import { Header } from './Components/layout/Header';
import { DragEndCreateFlow } from './Components/CreateProject/flow/DragendCreateFlow';
import Auth from './Components/Auth/Auth';
import ProjectDetails from './Components/BusinessUI/ProjectDetails';


function App() {
  return (
    <Router>
      <Header />   {/* optional */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* ✅ FIXED: Project Details route is INSIDE Routes */}
        <Route path="/projects/:id" element={<ProjectDetails />} />

        <Route path="/:projectId/workflow" element={<Workspace />} />
        <Route path="/new" element={<DragEndCreateFlow />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>

      <Footer />   {/* optional */}
    </Router>
  )
}

export default App;
