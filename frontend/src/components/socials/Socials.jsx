import styles from './Socials.module.css';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Socials = () => {
  return (
    <div className={styles.container}>
      <a href="https://www.facebook.com/IITRoorkee.ICC" target="_blank" rel="noopener noreferrer"><FaFacebook className={styles.icon} style={{ color: '#1877F2' }} /></a>
      <a href="https://www.youtube.com/@IITRoorkeeOfficialChannel" target="_blank" rel="noopener noreferrer"><FaYoutube className={styles.icon} style={{ color: '#FF0000' }} /></a>
      <a href="https://www.instagram.com/iitroorkee" target="_blank" rel="noopener noreferrer"><FaInstagram className={styles.icon} style={{ color: '#E4405F' }} /></a>
      <a href="https://www.linkedin.com/school/indian-institute-of-technology-roorkee" target="_blank" rel="noopener noreferrer"><FaLinkedin className={styles.icon} style={{ color: '#0077B5' }} /></a>
      <a href="https://www.twitter.com/iitroorkee" target="_blank" rel="noopener noreferrer"><FaXTwitter className={styles.icon} style={{ color: '#000000' }} /></a>
    </div>
  );
};

export default Socials;