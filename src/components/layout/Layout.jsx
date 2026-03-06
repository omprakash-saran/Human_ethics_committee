import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import Navbar from '../navbar/Navbar';
import styles from './Layout.module.css';

const Layout = () => {
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