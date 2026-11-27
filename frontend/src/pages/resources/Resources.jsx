import BgImage from '../../components/bgImage/BgImage';
import TemplateComponent from '../../components/faq/TemplateComponent';
import styles from './Resources.module.css';

const internalResources = [
  {
    fileName: "Standard Operating Procedure (SOP) for IHEC",
    fileUrl: "/docs/IHEC_SOP.pdf",
    description: "SOP for the Institutional Human Ethics Committee, IIT Roorkee (Version 02).",
  },
  {
    fileName: "IHEC Registration Permission",
    fileUrl: "/docs/Permission.pdf",
    description: "Grant of registration (Form CT-03) issued by the Department of Health Research.",
  },
];

const Resources = () => {
  return (
    <div className={styles.container}>
      <BgImage text='Resources' />

      <div className={`${styles.subcontainer}`}>

        <div className={`${styles.bioSafety}`} id='bioSafety'>
          <div className={`${styles.title}`}>BioSafety</div>
          <a
            className={styles.link}
            href="https://iitr.ac.in/Departments/Biosciences%20and%20Bioengineering%20Department/Miscellaneous/IBSC%20.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bio safety members and protocols
          </a>
        </div>

        <div className={`${styles.internalResources}`} id='internalResources'>
          <div className={`${styles.title}`}>Internal Resources</div>
          <TemplateComponent documents={internalResources} />
        </div>

        <div className={`${styles.externalResources}`} id='externalResources'>
          <div className={`${styles.title}`}>External Resources</div>
        </div>

      </div>
    </div>
  );
};

export default Resources;