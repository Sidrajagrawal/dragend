
import ExploreAll from "./Components/ExploreProjects/ExploreAll";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Workspace from './Components/Workspace/Workspace';
import { DragEndCreateFlow } from './Components/CreateProject/flow/DragendCreateFlow';
import Error404 from "./Components/ErrorPage/Error404";
import WhitePaper from "./Components/WhitePaper/WhitePaper";
function App() {

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreAll />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/new" element={<DragEndCreateFlow />} />
       <Route path="/whitepaper" element={<WhitePaper />} />
        {/* 404 FALLBACK */}
        <Route path="*" element={<Error404 />} />

      </Routes>
    </Router>
  )
}

export default App