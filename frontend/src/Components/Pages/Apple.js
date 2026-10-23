
import { useState } from "react";
import iphones from "../data/iphone";
import "./Apple.css";

function Apple() {
  const [selectedColor, setSelectedColor] = useState(0);

  const phone = iphones[0];
  const color = phone.colors[selectedColor];

  return (
    <main className="apple-page">
      <section className="apple-heading">
        <p className="eyebrow">NIVO TRONICS</p>
        <h1>Apple iPhones</h1>
        <p>Find your perfect iPhone.</p>
      </section>

      <section className="iphone-grid">
        <article className="iphone-card">
          <div className="iphone-image">
            <img
              src={color.image}
              alt={`${phone.name} ${color.name}`}
            />
          </div>

          <div className="iphone-details">
            <h2>{phone.name}</h2>

            <p>{phone.storage}</p>

            <h3>
              KSh {phone.price.toLocaleString("en-KE")}
            </h3>

            <p>
              Colour: <strong>{color.name}</strong>
            </p>

            <div className="color-options">
              {phone.colors.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={`color-circle ${
                    selectedColor === index ? "selected" : ""
                  }`}
                  style={{ backgroundColor: item.hex }}
                  onClick={() => setSelectedColor(index)}
                  aria-label={`Select ${item.name}`}
                  aria-pressed={selectedColor === index}
                  title={item.name}
                />
              ))}
            </div>

            <a
              className="iphone-button"
              href={`https://wa.me/254113072550?text=${encodeURIComponent(
                `Hello Nivo Tronics, I am interested in the ${phone.name} ${phone.storage} in ${color.name}. Is it available at KSh ${phone.price.toLocaleString("en-KE")}?`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Inquire on WhatsApp
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Apple;
