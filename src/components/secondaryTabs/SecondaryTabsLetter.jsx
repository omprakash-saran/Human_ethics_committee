import { useState, useEffect, useRef } from 'react';
import styles from './SecondaryTabs.module.css';

const SecondaryTabsLetter = () => {
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
    <div className={`${styles.container}  ${styles.margin}`}>
      <div className={styles.tab_box}>
        <button ref={tabRefs[0]} className={`${styles.tab_btn} ${flag === 0 ? styles.active : ''}`} onClick={() => { setFlag(0); updateLinePosition(0); }}><div className={`${styles.al}`}><p>Current Committee Member</p><div className={`${styles.date}`}>1 Mar 2025 - 28 Feb 2027</div></div></button>
        <button ref={tabRefs[1]} className={`${styles.tab_btn} ${flag === 1 ? styles.active : ''}`} onClick={() => { setFlag(1); updateLinePosition(1); }}><div className={`${styles.al}`}><p>Past Committee Member</p><div className={`${styles.date}`}>1 Mar 2021 - 28 Feb 2023</div></div></button>
        <div ref={lineRef} className={`${styles.line} ${styles.line2}`}></div>
      </div>
      <div className={`${styles.content_box}`}>
        <div className={`${styles.content} ${flag === 0 ? styles.show : ''}`}> 
          <object class={styles.pdf} 
            data="/docs/CurrentCommitteeMembers.pdf"
            height="800">
          </object>
        </div>
        <div className={`${styles.content} ${flag === 1 ? styles.show : ''}`}> 
          <object class={styles.pdf} 
            data="/docs/PastCommitteeMembers.pdf"
            height="800">
          </object>
        </div>
      </div>
    </div>
  );
};

export default SecondaryTabsLetter;