function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Premium Apple & Samsung Devices</h1>
        <p>
          Shop genuine smartphones, tablets, smartwatches, and accessories.
          Enjoy competitive prices, warranty coverage, and trusted customer support.
        </p>

        <div className="buttons">
          <button className="shop-btn apple-btn">Shop Apple</button>
          <button className="shop-btn samsung-btn">Shop Samsung</button>
        </div>
      </div>

      <div className="categories">
        <div className="category-card">
          <h2>🍎 Apple</h2>
          <ul>
            <li>iPhone</li>
            <li>iPad</li>
            <li>Apple Watch</li>
            <li>AirPods</li>
            <li>MacBook</li>
          </ul>
        </div>

        <div className="category-card">
          <h2>📱 Samsung</h2>
          <ul>
            <li>Galaxy S Series</li>
            <li>Galaxy Z Fold & Flip</li>
            <li>Galaxy A Series</li>
            <li>Galaxy Watch</li>
            <li>Galaxy Buds</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;