

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {

  const videoRef = useRef(null);
  const [showBtn, setShowBtn] = useState(false);
  const navigate = useNavigate();

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    // Show button 2 seconds before video ends
    if (!showBtn && video.duration - video.currentTime <= 6) {
      setShowBtn(true);
    }
  };

  return (
    <div className="error-page">

      <video
        ref={videoRef}
        className="video-bg"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
      >
        <source src="/bg404.mp4" type="video/mp4" />
      </video>

      <div className="ui-panel">

        {showBtn && (
          <button
            className="neon-btn"
            onClick={() => navigate("/")}
          >
            ← BACK TO HOME
          </button>
        )}

      </div>

    </div>
  );
};

export default Error404;