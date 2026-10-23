import black from "../assets/videos/images/iphone11-black.jpeg";
import green from "../assets/videos/images/iphone11-green.jpeg";
import yellow from "../assets/videos/images/iphone11-yellow.jpeg";
import white from "../assets/videos/images/iphone11-white.jpeg";

const iphones = [
  {
    id: 1,
    name: "iPhone 11",
    storage: "128GB",
    price: 30000,
    colors: [
      { name: "Black", image: black, hex: "#222222" },
      { name: "Green", image: green, hex: "#9CAF88" },
      { name: "Yellow", image: yellow, hex: "#F4D35E" },
      { name: "White", image: white, hex: "#F5F5F5" },
    ],
  },
];

export default iphones;