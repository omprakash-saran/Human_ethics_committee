import styles from './About.module.css';
import { NavLink } from 'react-router-dom';
import { SiGmail } from 'react-icons/si';
import { MdPhone } from 'react-icons/md';
import BgImage from '../../components/bgImage/BgImage'

const About = () => {
  return (
    <div className={styles.container}>
     
     <BgImage text="About"/>

     <div className={`${styles.subcontainer}`}>

          <div className={styles.block1}>
            <div className={styles.head}>Human Research Ethics and Integrity</div>
            <div className={styles.para}>
              Welcome to the official portal for{' '}
              <span className={styles.highlight}>Human Research Ethics</span> at{' '}
              <strong>IIT Roorkee</strong> — a space where academic curiosity meets ethical responsibility.
              <br /><br />
              We aim to foster research that not only pushes boundaries but also respects and protects the rights, dignity,
              and welfare of participants.
              <br /><br />
              If your work involves people, biological samples, or identifiable personal data, it's essential to obtain{' '}
              <span className={styles.highlight}>prior approval</span> from the{' '}
              <span className={styles.highlight}>Human Research Ethics Committee (HREC)</span>.
              <br /><br />
              Not sure if your project needs ethics clearance? Our{' '}
              <NavLink to="/human-ethics" className={styles.link}>
                Human Ethics
              </NavLink>{' '}
              section provides clarity on which research types fall under review.
            </div>
          </div>

          <div className={styles.block2}>
            <div className={styles.head2}>What We Offer</div>
            <ul className={styles.list}>
              <li>
                Guidance and resources for ethically conducting human research – explore them in our{' '}
                <NavLink to="/resources" className={styles.link}>Resources</NavLink> section.
              </li>
              <li>
                Pre-approved templates to streamline your submission – available on the{' '}
                <NavLink to="/downloads" className={styles.link}>Downloads</NavLink> page.
              </li>
              <li>
                Submit and manage your ethics applications online through the{' '}
                <NavLink to="/applications" className={styles.link}>Applications</NavLink> page.
              </li>
              <li>
                Stay up-to-date with our ongoing seminars and awareness sessions listed in{' '}
                <NavLink to="/events" className={styles.link}>Events</NavLink>.
              </li>
              <li>
                Meet our dedicated experts who ensure every proposal is reviewed with diligence — check out the{' '}
                <NavLink to="/committee" className={styles.link}>Committee</NavLink>.
              </li>
            </ul>
          </div>

          <div className={styles.block3}>
            <div className={styles.head2}>Why Ethics Matter</div>
            <div className={styles.para}>
              Ethical approval is more than a formality — it ensures that your research upholds the highest standards
              of respect, transparency, and care. It's a commitment to the people who make your research possible.
            </div>
          </div>

          <div className={styles.contactblock}>
            <div className={styles.head2}>Contact Us</div>
            <ul className={styles.contactList}>
              <li>
                <a href="mailto:humanethics@iitr.ac.in" className={styles.contactItem}>
                  <SiGmail className="inline" style={{ color: "#D44638", marginRight: "8px" }} />
                  humanethics@iitr.ac.in
                </a>
              </li>
              <li>
                <a href="tel:+911332285XXX" className={styles.contactItem}>
                  <MdPhone className="inline" style={{ color: "#75baff", marginRight: "8px" }} />
                  +91-1332-285XXX
                </a>
              </li>
              <li>
                Join our <strong>Ethics Drop-In Sessions</strong> every Monday from 12pm - 2pm.
                <br />
                General queries: 12pm – 1pm | Application guidance: 1pm – 2pm<br />
                <span className={styles.link}>[Insert calendar/registration link]</span>
              </li>
              <li>
                You can also <strong>schedule a personalized session</strong> with a committee member.
              </li>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default About;