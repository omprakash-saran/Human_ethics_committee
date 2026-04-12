import BgImage from '../../components/bgImage/BgImage';
import styles from './HumanEthics.module.css';

const HumanEthics = () => {
  return (
    <div className={styles.container}>
       <BgImage text="Human Ethics" />

      <div className={`${styles.subcontainer}`}>
        
        <div className={`${styles.clinicalTrials}`} id='clinicalTrials'>
          <div className={`${styles.title}`}>Clinical Trials</div>
        </div>

        <div className={`${styles.researchIntegrity}`} id='researchIntegrity'>
          <div className={`${styles.title}`}>Research Integrity</div>
        </div>

        <div className={`${styles.researchRisks}`} id='researchRisks'>
          <div className={`${styles.title}`}>Research risks</div>
        </div>

        <div className={`${styles.researchDataManagement}`} id='researchDataManagement'>
          <div className={`${styles.title}`}>Research Data Management</div>
        </div>
      </div>
    </div>
  );
};

export default HumanEthics;