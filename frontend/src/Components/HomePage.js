import React, { useEffect, useState } from "react";

import AppleProduct from "./assets/videos/AppleProduct.mp4";
import Plain17 from "./assets/videos/17plain.mp4";

const videos = [AppleProduct, Plain17];

function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000); // Change video every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <video
        key={currentVideo}
        autoPlay
        muted
        loop={false}
        playsInline
        className="hero-video"
      >
        <source src={videos[currentVideo]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-content">
        <h1>Nivo Tronics</h1>
        <p>Premium iPhones & Samsung Devices</p>
        <button>Shop Now</button>
      </div>
    </section>
  );
}

export default HeroSection;