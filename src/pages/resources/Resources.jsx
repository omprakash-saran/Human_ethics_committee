import BgImage from '../../components/bgImage/BgImage';
import styles from './Resources.module.css';

const Resources = () => {
  return (
    <div className={styles.container}>
      <BgImage text='Resources'/>

      <div className={`${styles.subcontainer}`}>

        <div className={`${styles.bioSafety}`} id='bioSafety'>
          <div className={`${styles.title}`}>BioSafety</div>
        </div>

        <div className={`${styles.internalResources}`} id='internalResources'>
          <div className={`${styles.title}`}>Internal Resources</div>
        </div>

        <div className={`${styles.externalResources}`} id='externalResources'>
          <div className={`${styles.title}`}>External Resources</div>
        </div>

      </div>
    </div>
  );
};

export default Resources;