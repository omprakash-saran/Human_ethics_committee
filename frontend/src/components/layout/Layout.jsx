import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../footer/Footer';
import Navbar from '../navbar/Navbar';
import styles from './Layout.module.css';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = decodeURIComponent(location.hash.slice(1));
      const targetElement = document.getElementById(elementId);

      if (targetElement) {
        requestAnimationFrame(() => {
          targetElement.scrollIntoView({ block: 'start', behavior: 'auto' });
        });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [location.pathname, location.hash]);

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;