import styles from './DesignContainer.module.css';

const DesignContainer = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.box} ${styles.accent}`}>सत्य</div>
      <div className={`${styles.box} ${styles.primary}`}>ईमानदारी</div>
      <div className={`${styles.box} ${styles.accent}`}>कर्तव्य</div>
      <div className={`${styles.box} ${styles.primary}`}>नैतिकता</div>
    </div>
  );
};

export default DesignContainer;