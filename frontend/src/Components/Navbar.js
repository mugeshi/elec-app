import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Nivo <span>Tronics</span>
      </div>

      <ul className="nav-links">
        <li><a href="/">Home</a></li>

        <li className="dropdown">
          <a href="/phones">Phones</a>
          <ul className="dropdown-menu">
            <li><a href="/phones/apple">Apple</a></li>
            <li><a href="/phones/samsung">Samsung</a></li>
            <li><a href="/phones/google">Google Pixel</a></li>
            <li><a href="/phones/nothing">Nothing Phone</a></li>
            <li><a href="/phones/oneplus">OnePlus</a></li>
            <li><a href="/phones/xiaomi">Xiaomi</a></li>
            <li><a href="/phones/oppo">Oppo</a></li>
            <li><a href="/phones/vivo">Vivo</a></li>
            <li><a href="/phones/huawei">Huawei</a></li>
          </ul>
        </li>

        <li><a href="/laptops">Laptops</a></li>

        <li><a href="/accessories">Accessories</a></li>

        <li><a href="/sell-phone">Sell Your Device</a></li>

        <li><a href="/about">About</a></li>

        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;