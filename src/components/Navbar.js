import Link from "next/link";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link href="/taskflow">Taskflow</Link></li>
        <li><Link href="/ideate">Ideate</Link></li>
        <li className="logo">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
        </li>
        <li><Link href="/wallet">Wallet</Link></li>
        <li><Link href="/streaks">Streaks</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
