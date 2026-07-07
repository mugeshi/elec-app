import { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        Nivo <span>Tronics</span>
      </Link>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>

        <li className="dropdown">
          <Link to="/phones" onClick={() => setMenuOpen(false)}>Phones</Link>

          <ul className="dropdown-menu">
            <li><Link to="/phones/apple">Apple</Link></li>
            <li><Link to="/phones/samsung">Samsung</Link></li>
            <li><Link to="/phones/google">Google Pixel</Link></li>
            <li><Link to="/phones/nothing">Nothing Phone</Link></li>
            <li><Link to="/phones/oneplus">OnePlus</Link></li>
            <li><Link to="/phones/xiaomi">Xiaomi</Link></li>
            <li><Link to="/phones/oppo">Oppo</Link></li>
            <li><Link to="/phones/vivo">Vivo</Link></li>
            <li><Link to="/phones/huawei">Huawei</Link></li>
          </ul>
        </li>

        <li>
          <Link to="/laptops" onClick={() => setMenuOpen(false)}>Laptops</Link>
        </li>

        <li>
          <Link to="/accessories" onClick={() => setMenuOpen(false)}>Accessories</Link>
        </li>

        <li>
          <Link to="/sell-phone" onClick={() => setMenuOpen(false)}>Sell Device</Link>
        </li>

        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </li>
      </ul>

      {/* Right Side */}
      <div className="nav-icons">
        {/* Search */}
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Wishlist */}
        <Link to="/wishlist" className="icon-wrapper" aria-label="Wishlist">
          <FaHeart className="icon" />
          <span className="badge">{wishlistCount}</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="icon-wrapper" aria-label="Cart">
          <FaShoppingCart className="icon" />
          <span className="badge">{cartCount}</span>
        </Link>

        {/* User */}
        <Link to="/login" aria-label="Account">
          <FaUser className="icon" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes className="menu-icon" /> : <FaBars className="menu-icon" />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;