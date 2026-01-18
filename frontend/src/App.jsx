// import { useState } from 'react'
// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Components/Home/Home'
// import Contact from './Components/Contact/Contact'
// import Footer from './Components/Home/Footer';
// import Workspace from './Components/Workspace/Workspace';

// function App() {

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/workspace" element={<Workspace />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App


import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Footer from './Components/Home/Footer';
import Workspace from './Components/Workspace/Workspace';
import { Header } from './Components/layout/Header';
import { DragEndCreateFlow } from './Components/CreateProject/flow/DragendCreateFlow';
import Login from './Components/auth/LoginTest';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/new" element={<DragEndCreateFlow />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;
