import BgImage from '../../components/bgImage/BgImage';
import TemplateComponent from '../../components/faq/TemplateComponent';
import styles from './Downloads.module.css';

const Downloads = () => {
  return (
    <div className={styles.container}>
      <BgImage text="Downloads"/>

      <div className={styles.subcontainer}>
        <div className={`${styles.title}`} id='templates'>Templates</div>
        <TemplateComponent/>
      </div>
    </div>
  );
};

export default Downloads;