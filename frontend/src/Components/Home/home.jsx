import bgVideo from "../../media/bg_video.mp4";
import Navbar from "../Navbar/Navbar";

const Home = () => {
    return (
        <div className="grid h-screen w-full overflow-hidden">
            <video className="col-start-1 row-start-1 h-full w-full object-cover" src={bgVideo} autoPlay loop muted playsInline />
        <div className="col-start-1 row-start-1 z-10 h-[12vh] text-black">
                <Navbar />
            </div>

        </div>
    );
};

export default Home;
