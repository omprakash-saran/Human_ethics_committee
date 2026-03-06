import { useState, useEffect, useRef } from 'react';
import styles from './SecondaryTabs.module.css';
import FAQ from '../faq/FAQ';

const SecondaryTabsStatus = () => {
  const [flag, setFlag] = useState(0);
  const lineRef = useRef(null);
  const tabRefs = [useRef(null), useRef(null), useRef(null)];

  const updateLinePosition = (index) => {
    const tab = tabRefs[index].current;
    if (lineRef.current && tab) {
      lineRef.current.style.width = `${tab.offsetWidth}px`;
      lineRef.current.style.left = `${tab.offsetLeft}px`;
    }
  };

  useEffect(() => {
    updateLinePosition(flag);
  }, []);

  return (
    <div className={`${styles.container} shadow-xl`}>
      <div className={styles.tab_box}>
        <button ref={tabRefs[0]} className={`${styles.tab_btn} ${flag === 0 ? styles.active : ''}`} onClick={() => { setFlag(0); updateLinePosition(0); }}>Important Update</button>
        <button ref={tabRefs[1]} className={`${styles.tab_btn} ${flag === 1 ? styles.active : ''}`} onClick={() => { setFlag(1); updateLinePosition(1); }}>FAQs</button>
        <button ref={tabRefs[2]} className={`${styles.tab_btn} ${flag === 2 ? styles.active : ''}`} onClick={() => { setFlag(2); updateLinePosition(2); }}>FAQs</button>
        <div ref={lineRef} className={styles.line}></div>
      </div>
      <div className={styles.content_box}>
        <div className={`${styles.content} ${flag === 0 ? styles.show : ''}`}><p>(Currently no Updates are available!)</p></div>
        <div className={`${styles.content} ${flag === 1 ? styles.show : ''}`}><FAQ/></div>
        <div className={`${styles.content} ${flag === 2 ? styles.show : ''}`}><FAQ/></div>
      </div>
    </div>
  );
};

export default SecondaryTabsStatus;