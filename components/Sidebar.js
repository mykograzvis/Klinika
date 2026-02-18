"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setIsOpen(false); // uždarom sidebar pasikeitus route
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const commonItems = [
    { href: "/rezervacija", label: "Rezervacija" },
    { href: "/istorija", label: "Istorija" },
    { href: "/profilis", label: "Profilis" },
  ];

  const doctorAdminItems = [
    { href: "/gydytojas/vizitai", label: "Vizitų valdymas" },
    { href: "/gydytojas/grafikas", label: "Darbo grafikas" },
  ];

  const adminOnlyItems = [
    { href: "/vartotojai", label: "Vartotojų valdymas" },
    { href: "/statistika", label: "Statistika" },
  ];

  const renderLink = (item) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={`${styles.navItem} ${
            isActive ? styles.navItemActive : ""
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobilus „Meniu“ mygtukas */}
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Uždaryti" : "Meniu"}
      </button>

      {/* Overlay mobiliajame */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : ""
        } sidebar-nav`}
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.logoMark}>G</span>
          <span className={styles.logoText}>Gelmidenta</span>
        </div>

        <ul className={styles.nav}>
          {commonItems.map(renderLink)}

          {(role === "Adminas" || role === "Gydytojas") && (
            <>
              <hr className={styles.sectionDivider} />
              {doctorAdminItems.map(renderLink)}
            </>
          )}

          {role === "Adminas" && (
            <>
              <hr className={styles.sectionDivider} />
              {adminOnlyItems.map(renderLink)}
            </>
          )}
        </ul>

        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Atsijungti
        </button>

        {/* Sticky elgesys >=768px kaip ir anksčiau */}
        <style jsx>{`
          @media (min-width: 768px) {
            .sidebar-nav {
              left: 0 !important;
              position: sticky !important;
              height: 100vh;
            }
          }
        `}</style>
      </nav>
    </>
  );
}
