import { useNavigate } from "react-router-dom";
import log_gif from "../../media/logo_gif.mp4"

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-[999] flex items-center px-6 py-4 pointer-events-auto">
      <video
        src={log_gif}
        autoPlay
        loop
        muted
        playsInline
        onClick={() => navigate("/")}
        className="h-12 cursor-pointer"
      />
    </header>
  );
};
