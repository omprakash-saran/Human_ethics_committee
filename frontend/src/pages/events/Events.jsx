import BgImage from '../../components/bgImage/BgImage';
import styles from './Events.module.css';

const Events = () => {
  return (
    <div className={styles.container}>
      <BgImage text="Events" />

      <div className={`${styles.subcontainer}`}>
        <div className={`${styles.ethicsCommitteeMeetings}`} id='ethicsCommitteeMeetings'>
          <div className={`${styles.title}`}>Ethics Committee Meeings</div>
        </div>
        <div className={`${styles.workshops}`} id='workshops'>
          <div className={`${styles.title}`}>Workshops</div>
        </div>
      </div>
    </div>
  );
};

export default Events;