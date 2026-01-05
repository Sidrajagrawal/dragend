import logo from '../../media/logo.png'
const Navbar = () => {
  return (
    <div className="h-full flex mt-7">
      <div className="left w-[30%] ml-[15%] text-3xl font-medium flex">
        <img src={logo} alt="" width={'80px'}/>
        <div className='mt-[5%]'>Dragend</div>
      </div>
      <div className="right w-[40%]">
        <ul className="text-lg flex justify-evenly font-medium cursor-pointer ">
          <li className="mt-7 cursor-pointer
  text-black
  hover:bg-linear-to-r hover:from-purple-800 hover:to-pink-900
  hover:bg-clip-text hover:text-transparent
  transition-all duration-300">About</li>
          <li className="mt-7 cursor-pointer
  text-black
  hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500
  hover:bg-clip-text hover:text-transparent
  transition-all duration-300">Contact</li>
          <li>
            <button
              className="
    mt-4 ml-27 px-6 py-3 rounded-2xl cursor-pointer
    bg-white text-black
    hover:bg-linear-to-r hover:from-purple-700 hover:to-pink-600
    hover:text-white
    transition-all duration-500 
  "
            >
              Get Started
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
