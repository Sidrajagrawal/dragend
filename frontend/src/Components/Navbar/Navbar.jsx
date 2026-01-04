const Navbar = () => {
    return (
        <div className="h-full flex">
            <div className="left w-[40%] ml-[15%] mt-[1.5%] text-3xl font-medium">
                Dragend
            </div>
            <div className="right w-[60%]">
                <ul className="text-lg flex justify-evenly font-medium">
                    <li className="mt-7">About</li>
                    <li className="mt-7">Contact</li>
                    <li><button className="bg-white mt-6 px-4 py-2 rounded-full shadow-xl">Get Started</button></li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;