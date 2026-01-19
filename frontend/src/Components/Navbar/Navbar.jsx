import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../media/logo.png';
import best_logo from '../../media/best_logo.png';
import Logo_gif from '../../media/Logo_gif.webm'
import Dragend from '../../media/Dragend.svg'

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  
  const handleGetStarted = () => {
    const userIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (userIsLoggedIn) {
      navigate('/new');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 ">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => navigate('/')} className=" flex text-2xl sm:text-3xl font-medium text-black cursor-pointer" >
          {/* <img src={Main_logo} alt="" width={'200px'} /> */}
          {/* <img src={logo} alt="" width={'80px'} className="mt-2" /> */}
          {/* <img src={best_logo} alt="" width={'200px'} className=""/> */}
          {/* <video className="w-50" src={Logo_gif} autoPlay loop muted playsInline /> */}
          {/* <div className="mt-[10%]">Dragend</div> */}
          {/* <img src={Dragend} alt="" width={'150px'} className="mt-4" /> */}
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10 text-lg font-medium">
          <li
            className="
            cursor-pointer text-black
            hover:bg-linear-to-r hover:from-purple-800 hover:to-pink-900
            hover:bg-clip-text hover:text-transparent
            transition-all duration-300
          "
          >
            About
          </li>

          <li onClick={() => navigate('/contact')} className="cursor-pointer text-black hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all duration-300 ">
            Contact
          </li>

          <li>
            <button
              onClick={handleGetStarted}
              className="
                px-6 py-3 rounded-2xl
                bg-white text-black
                hover:bg-linear-to-r hover:from-purple-700 hover:to-pink-600
                hover:text-white
                transition-all duration-500
                cursor-pointer
              "
            >
              Get Started
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl text-black"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="
            md:hidden
            backdrop-blur-xl
            bg-white/5
            border-t border-white/5
            shadow-lg
          "
        >
          <ul className="flex flex-col items-center gap-6 py-8 text-lg font-medium">
            <li
              className="
                cursor-pointer text-black
                hover:bg-linear-to-r hover:from-purple-800 hover:to-pink-900
                hover:bg-clip-text hover:text-transparent
                transition-all duration-300
              "
            >
              About
            </li>

            <li
              className="
                cursor-pointer text-black
                hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500
                hover:bg-clip-text hover:text-transparent
                transition-all duration-300
              "
            >
              Contact
            </li>

            <button
              onClick={() => {
                handleGetStarted(); // Use the logic function
                setOpen(false); // Close menu after clicking
              }}
              className="
                mt-4 px-8 py-3 rounded-2xl
                bg-black/90 text-white
                hover:bg-linear-to-r hover:from-purple-700 hover:to-pink-600
                transition-all duration-500
              "
            >
              Get Started
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;