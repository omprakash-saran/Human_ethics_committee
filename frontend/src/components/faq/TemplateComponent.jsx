import { useState } from 'react';
import styles from './FAQ.module.css';
import { MdFileDownload } from "react-icons/md";

export default function TemplateComponent({ documents: documentsProp }) {
  const defaultDocuments = [
    {
      fileName: "Cover Letter Template",
      fileUrl: "/templates/pdfs/Cover_Letter_Template.pdf",
      description: "Use this to draft your formal cover letter.",
    },
    {
      fileName: "Demographics Form Template",
      fileUrl: "/templates/pdfs/Demographics_Form_Template.pdf",
      description: "Fill this form with participant demographic information.",
    },
    {
      fileName: "IHEC Ethics Form Template",
      fileUrl: "/templates/pdfs/IHEC_Ethics_Form_Template.pdf",
      description: "This is the ethics approval form required for review.",
    },
    {
      fileName: "Informed Consent Form Template",
      fileUrl: "/templates/pdfs/Informed_Consent_Form_Template.pdf",
      description: "Participants must fill and sign this consent form.",
    },
    {
      fileName: "Positive and Negative Affect Schedule Questionnaire",
      fileUrl: "/templates/pdfs/Positive and Negative Affect Schedule_Questionnaire.pdf",
      description: "Self-report measure of positive and negative emotions.",
    },
    {
      fileName: "STAI Questionnaire",
      fileUrl: "/templates/pdfs/STAI_Questionnaire.pdf",
      description: "State-Trait Anxiety Inventory for anxiety assessment.",
    },
    {
      fileName: "Application format to IHEC-IITR Proposals",
      fileUrl: "/templates/pdfs/Application_format_to_IHEC-IITR.pdf",
      description: "Format to follow when applying to IHEC-IITR for proposal review.",
    },
    {
      fileName: "IHEC Proposal Requirements",
      fileUrl: "/templates/pdfs/IHEC_Project_Proposal_requirements.pdf",
      description: "Checklist of documents required with an IHEC project proposal.",
    },
  ];

  const documents = documentsProp || defaultDocuments;

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className={styles.container}>
      {documents.map((doc, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            onClick={() => toggleFAQ(index)}
            className={`${styles.question} ${openIndex === index ? styles.questionOpen : ''}`}
          >
            {doc.fileName}
            <div className={styles.description}>{doc.description}</div>
          </button>
          <div className={`${styles.answerWrapper} ${openIndex === index ? styles.open : ''} bg-[#5454544b] rounded-md`} style={openIndex === index ? { padding: "20px" } : {}}>

            <div className='flex gap-2 items-center font-bold w-30 justify-center text-[#e7e7e7] rounded-md bg-[var(--primary-color)] h-10'> <MdFileDownload /> <a href={doc.fileUrl} download>Download</a></div>

            <object
              className={styles.pdf}
              data={doc.fileUrl}
              type="application/pdf"
              height={800}
              width="100%"
            >
              <p>Your browser does not support viewing PDF files inline. <a href={doc.fileUrl}>Download PDF</a>.</p>
            </object>
          </div>
        </div>
      ))}
    </div>
  );
}