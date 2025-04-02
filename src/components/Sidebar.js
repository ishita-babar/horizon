import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./sidebar.css";

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { path: "/taskflow", icon: "📋", label: "Taskflow" },
    { path: "/wallet", icon: "💰", label: "Wallet" },
    { path: "/streaks", icon: "🔥", label: "Streaks" },
    { path: "/ideate", icon: "💡", label: "Ideate" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="nav-links">
          <ul>
            {navItems.map((item) => (
              <li 
                key={item.path} 
                className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              >
                <Link href={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="logo-container">
          <Link href="/">
            <div className="logo-wrapper">
              <Image 
                src="/logo.png" 
                alt="App Logo" 
                width={120} 
                height={120}
                className="logo-image"
              />
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;