import DesignContainer from '../designContainer/DesignContainer';
import Socials from '../socials/Socials';
import styles from './Footer.module.css';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
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
            <p><MdLocationOn className='inline'/> H-404, Department of Humanities and Social Sciences, Indian Institute of Technology Roorkee, Roorkee, Uttarakhand 247667</p>
            <Socials/>
          </div>
          <div className={styles.box}>
            <h4>Quick Links</h4>
            <p>About</p>
            <p>Resources</p>
            <p>Team</p>
          </div>
          <div className={styles.box}>
            <h4>Location</h4>
            <p>IIT Roorkee</p>
            <p>Uttarakhand, India</p>
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