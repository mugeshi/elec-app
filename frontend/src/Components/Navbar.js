import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Nivo <span>Tronics</span>
      </div>

      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#iphone">iPhone</a></li>
        <li><a href="#samsung">Samsung</a></li>
        <li><a href="#accessories">Accessories</a></li>
        <li><a href="#sell">Sell Phone</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;