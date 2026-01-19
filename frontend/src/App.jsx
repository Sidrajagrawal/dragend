<<<<<<< HEAD
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return <AppRoutes />;
}
=======
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
import Workspace from './Components/Workspace/Workspace'
import Auth from './Components/Auth/Auth'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/workspace" element={<Workspace />} />

        {/* Auth routes */}
        <Route path="/auth" element={<Auth />} />
        <Route
         path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App;
>>>>>>> 86ff5ba9dc7aea54d1f5f8dc0c6da515d6d18148
