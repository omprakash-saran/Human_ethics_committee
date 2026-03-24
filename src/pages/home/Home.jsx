import styles from './Home.module.css';
import { SiGmail } from "react-icons/si";
import { MdPhone } from "react-icons/md";
import SecondaryTabs from '../../components/secondaryTabs/SecondaryTabs';

const Home = () => {
  return (
    <div className={styles.container}>
        <img src="/iitr-main-building.png" alt="welcome to iit roorkee human ethics pages" draggable="false" style={{width: "100%"}}/>
        <div className={styles.block1}>
            <div className={styles.backimg}></div>
            <div className={styles.head}>Human Research Ethics and Integrity </div>
            <div className={styles.para}>
              <span className={styles.highlight}>Human research</span> involves studies that engage directly with individuals, their biological materials, or personal data. This encompasses a wide spectrum of research activities across disciplines. Before initiating any project involving people, their information, or tissue samples, it is essential to obtain <span className={styles.highlight}>prior approval</span> from the <span className={styles.highlight}>Human Research Ethics Committee (HREC)</span> at IIT Roorkee. If you're unsure whether your research requires ethics clearance, or if you have any related queries, please reach out to the <span className={styles.highlight}>Ethics, Integrity, and Biosafety</span> team for guidance and support.
            </div>
        </div>
        <div className={styles.contactblock}>
              <div className={styles.head2}>Contact Us</div>
              <ul className={styles.contactList}>
                <li>
                  <a href="mailto:humanethics@iitr.ac.in" className={styles.contactItem}>
                    <SiGmail className='inline' style={{ color: "#D44638", marginRight: "8px" }} />
                    humanethics@iitr.ac.in
                  </a>
                </li>
                <li>
                  <a href="tel:+911234567890" className={styles.contactItem}>
                    <MdPhone className="inline" style={{ color: "#75baff", marginRight: "8px" }} />
                    +91-1332-285XXX
                  </a>
                </li>
                <li>
                  Join the monthly Ethics Drop-In Session (held once a month or every five months, as advised),
                  every Monday (except public holidays) from 12pm - 1pm for general ethics queries and from 1pm - 2pm 
                  for advice on preparing your application. <span className={styles.link}>[link]</span>
                </li>
                <li>
                  Schedule a personalised session for help with your ethics queries, if required.
                </li>
              </ul>
            </div>
        <SecondaryTabs/>
    </div>
  );
};

export default Home;