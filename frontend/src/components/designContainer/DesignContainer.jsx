import styles from './DesignContainer.module.css';

const DesignContainer = () => {
  const values = [
    {
      title: 'सत्य',
      description: 'Truthful data and honest reporting.',
      tone: 'accent'
    },
    {
      title: 'ईमानदारी',
      description: 'Integrity in methods and citations.',
      tone: 'primary'
    },
    {
      title: 'कर्तव्य',
      description: 'Duty of care to every participant.',
      tone: 'accent'
    },
    {
      title: 'नैतिकता',
      description: 'Ethical choices at every step.',
      tone: 'primary'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>Core Values</div>
      <div className={styles.container}>
        {values.map((value) => (
          <div
            key={value.title}
            className={`${styles.card} ${value.tone === 'accent' ? styles.cardAccent : styles.cardPrimary}`}
          >
            <h3 className={styles.title}>{value.title}</h3>
            <p className={styles.description}>{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DesignContainer;