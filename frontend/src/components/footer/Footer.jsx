import DesignContainer from '../designContainer/DesignContainer';
import Socials from '../socials/Socials';
import styles from './Footer.module.css';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const address = 'H-404, Department of Humanities and Social Sciences, Indian Institute of Technology Roorkee, Roorkee, Uttarakhand 247667';
const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const Footer = () => {
  const handleSamePageTopClick = (targetPath) => (event) => {
    if (window.location.pathname === targetPath) {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.container}>
      <DesignContainer/>

      <div className={styles.line}></div>

      <div className={styles.upperSectionContainer}>
        <div className={styles.upperSection}>
          <div className={styles.box}>
            <h4>Contact Us</h4>
            <p><MdPhone className='inline'/> +91-1332-285XXX</p>
            <p><MdEmail className='inline'/> humanethics@iitr.ac.in</p>
            <Socials/>
          </div>
          <div className={styles.box}>
            <h4>Quick Links</h4>
            <NavLink onClick={handleSamePageTopClick('/')} className={styles.quickLink} to="/">Home</NavLink>
            <NavLink onClick={handleSamePageTopClick('/about')} className={styles.quickLink} to="/about">About</NavLink>
            <NavLink onClick={handleSamePageTopClick('/resources')} className={styles.quickLink} to="/resources">Resources</NavLink>
            <NavLink onClick={handleSamePageTopClick('/committee')} className={styles.quickLink} to="/committee">Team</NavLink>
            <NavLink className={styles.quickLink} to="/committee#volunteers">Volunteers</NavLink>
          </div>
          <div className={styles.box}>
            <h4>Location</h4>
            <p><MdLocationOn className='inline'/> IIT Roorkee</p>
            <p>Uttarakhand, India</p>
            <a href={locationUrl} target="_blank" rel="noreferrer" className={styles.locationLink}>
              {address}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.line} style={{marginTop: "0"}}></div>

      <div className={styles.lowerLine}>
        © 2025 Indian Institute of Technology Roorkee
      </div>
    </footer>
  );
};

export default Footer;