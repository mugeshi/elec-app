import React, { useState } from "react";

import AppleProduct from "./assets/videos/AppleProduct.mp4";
import Plain17 from "./assets/videos/17plain.mp4";

const videos = [AppleProduct, Plain17];

function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <section className="hero">
      <video
        key={currentVideo}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="hero-video"
      >
        <source src={videos[currentVideo]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}

export default HeroSection;