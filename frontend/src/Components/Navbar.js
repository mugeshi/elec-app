import "./Navbar.css";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
} from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        Nivo <span>Tronics</span>
      </Link>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li className="dropdown">
          <Link to="/phones">Phones</Link>

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
          <Link to="/laptops">Laptops</Link>
        </li>

        <li>
          <Link to="/accessories">Accessories</Link>
        </li>

        <li>
          <Link to="/sell-phone">Sell Device</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      {/* Right Side */}
      <div className="nav-icons">

        {/* Search */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
          />
        </div>

        {/* Wishlist */}
        <Link to="/wishlist" className="icon-wrapper">
          <FaHeart className="icon" />
          <span className="badge">0</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="icon-wrapper">
          <FaShoppingCart className="icon" />
          <span className="badge">0</span>
        </Link>

        {/* User */}
        <Link to="/login">
          <FaUser className="icon" />
        </Link>

        {/* Mobile Menu */}
        <FaBars className="menu-icon" />
      </div>
    </nav>
  );
}

export default Navbar;