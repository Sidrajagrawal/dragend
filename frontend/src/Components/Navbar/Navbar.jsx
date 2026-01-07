import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="text-2xl sm:text-3xl font-medium text-black cursor-pointer" >
          Dragend
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

          <li onClick={() =>  navigate('/contact')} className="cursor-pointer text-black hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all duration-300 ">
            Contact
          </li>

          <li>
            <button
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