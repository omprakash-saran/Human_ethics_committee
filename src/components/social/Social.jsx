import {
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaUniversity,
  } from 'react-icons/fa';

import {
    FaGoogleScholar,
    FaResearchgate,
  } from 'react-icons/fa6';
  import styles from './Social.module.css';
import { useTheme } from '../../context/ThemeProvider';
  
  const Social = ({ socials = {} }) => {

    const { darkMode } = useTheme();

    const icons = {
      iitr: {
        icon: <FaUniversity />,
        link: socials.iitr,
      },
      linkedin: {
        icon: <FaLinkedin />,
        link: socials.linkedin,
      },
      twitter: {
        icon: <FaTwitter />,
        link: socials.twitter,
      },
      insta: {
        icon: <FaInstagram />,
        link: socials.insta,
      },
      scholar: {
        icon: <FaGoogleScholar />,
        link: socials.scholar,
      },
      researchGate: {
        icon: <FaResearchgate />,
        link: socials.researchGate,
      },
    };
  
    return (
      <div className={`flex gap-2 mt-2 justify-center ${styles.socialContainer}`}>
        {Object.entries(icons).map(([key, value]) => {
          if (!value.link) return null;
          return (
            <a
              key={key}
              href={value.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.icon}`}
              style={{ color: darkMode ? "black" : "white" }}
            >
              {value.icon}
            </a>
          );
        })}
      </div>
    );
  };
  
  export default Social;