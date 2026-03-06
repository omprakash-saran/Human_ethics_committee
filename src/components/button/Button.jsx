import styles from './Button.module.css';

const Button = ({title="Button", handleSubmit = ()=>{}}) => {
  return (
    <div className={styles.container}>
      <button onClick={handleSubmit} className={styles.btn}>{title}</button>
    </div>
  );
};

export default Button;