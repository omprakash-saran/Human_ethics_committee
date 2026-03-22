import { useState } from 'react';
import styles from './Applications.module.css';

export default function Applications() {
  const [activeTab, setActiveTab] = useState('new');

  const [formData, setFormData] = useState({
    researcherName: '',
    email: '',
    projectTitle: '',
    pdfFile: null,
    projectId: '' 
  });

  const [showPopup, setShowPopup] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isResubmission, setIsResubmission] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadError('❌ Please upload a PDF file only');
        setFormData((prevState) => ({
          ...prevState,
          pdfFile: null
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError('❌ File size must be less than 5MB');
        setFormData((prevState) => ({
          ...prevState,
          pdfFile: null
        }));
        return;
      }

      setUploadError('');
      setFormData((prevState) => ({
        ...prevState,
        pdfFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploadError('');

    if (!formData.pdfFile) {
      setUploadError('❌ Please upload a PDF file');
      return;
    }

    if (activeTab === 'new') {
      if (!formData.researcherName.trim()) {
        setUploadError('❌ Please enter researcher name');
        return;
      }

      if (!formData.email.trim()) {
        setUploadError('❌ Please enter email address');
        return;
      }

      if (!formData.projectTitle.trim()) {
        setUploadError('❌ Please enter project title');
        return;
      }
    }

    if (activeTab === 'resubmit') {
      if (!formData.projectId.trim()) {
        setUploadError('❌ Please enter your Project ID');
        return;
      }

      if (!formData.researcherName.trim()) {
        setUploadError('❌ Please enter researcher name');
        return;
      }

      if (!formData.email.trim()) {
        setUploadError('❌ Please enter email address');
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('pdfFile', formData.pdfFile);

      if (activeTab === 'new') {
        formDataToSend.append('researcherName', formData.researcherName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('projectTitle', formData.projectTitle);
        formDataToSend.append('isResubmission', 'false');

        console.log('Submitting NEW proposal...'); 

        const response = await fetch('http://localhost:5001/api/proposals', {
          method: 'POST',
          body: formDataToSend
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Proposal submitted successfully!', data);
          setProjectId(data.projectId);
          setIsResubmission(false);
          setShowPopup(true);

          setTimeout(() => {
            setFormData({
              researcherName: '',
              email: '',
              projectTitle: '',
              pdfFile: null,
              projectId: ''
            });
            setUploadError('');
          }, 3000);
        } else {
          setUploadError('❌ Error: ' + data.message);
          console.error('Error:', data);
        }
      }
      else if (activeTab === 'resubmit') {
        formDataToSend.append('projectId', formData.projectId);
        formDataToSend.append('researcherName', formData.researcherName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('isResubmission', 'true');

        console.log('Submitting RESUBMISSION...'); 

        const response = await fetch('http://localhost:5001/api/proposals/resubmit', {
          method: 'POST',
          body: formDataToSend
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Proposal resubmitted successfully!', data);
          setProjectId(data.projectId);
          setIsResubmission(true);
          setShowPopup(true);

          setTimeout(() => {
            setFormData({
              researcherName: '',
              email: '',
              projectTitle: '',
              pdfFile: null,
              projectId: ''
            });
            setUploadError('');
          }, 3000);
        } else {
          setUploadError('❌ Error: ' + data.message);
          console.error('Error:', data);
        }
      }
    } catch (error) {
      setUploadError('❌ Error submitting form: ' + error.message);
      console.error('Error:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      researcherName: '',
      email: '',
      projectTitle: '',
      pdfFile: null
    });
    setUploadError('');
  };

  const isNew = activeTab === 'new';

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.heading}>Submit Your Research Proposal</h1>
          <p className={styles.subheading}>
            Fill out the form and upload your research proposal PDF to IIT Roorkee
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('new');
              setUploadError('');
              setFormData({
                researcherName: '',
                email: '',
                projectTitle: '',
                pdfFile: null,
                projectId: ''
              });
            }}
            className={`${styles.tabButton} ${isNew ? styles.tabActive : ''}`}
          >
            New Submission
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('resubmit');
              setUploadError('');
              setFormData({
                researcherName: '',
                email: '',
                projectTitle: '',
                pdfFile: null,
                projectId: ''
              });
            }}
            className={`${styles.tabButton} ${!isNew ? styles.tabActive : ''}`}
          >
            Resubmit Proposal
          </button>
        </div>

        {/* Form Container */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* TAB 1: NEW SUBMISSION */}
            {activeTab === 'new' && (
              <>
                <div className={`${styles.notice} ${styles.noticeNew}`}>
                  <p className={styles.noticeTextNew}>
                    First time submitting? Fill in your details and upload your proposal. You'll receive a unique
                    Project ID.
                  </p>
                </div>

                {/* Row 1: Name and Email */}
                <div className={styles.grid2}>
                  {/* Researcher Name */}
                  <div>
                    <label className={styles.label}>Researcher Name *</label>
                    <input
                      type="text"
                      name="researcherName"
                      autoComplete="off"
                      value={formData.researcherName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className={styles.input}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Project Title */}
                <div>
                  <label className={styles.label}>Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    autoComplete="off"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your research project title"
                    className={styles.input}
                  />
                </div>
              </>
            )}

            {/* TAB 2: RESUBMISSION */}
            {activeTab === 'resubmit' && (
              <>
                <div className={`${styles.notice} ${styles.noticeResubmit}`}>
                  <p className={styles.noticeTextResubmit}>
                    Resubmitting? Enter your Project ID from the original submission and upload the updated PDF.
                  </p>
                </div>

                {/* Project ID Field */}
                <div>
                  <label className={styles.label}>Project ID *</label>
                  <input
                    type="text"
                    name="projectId"
                    autoComplete="off"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your Project ID (e.g., PROJ-1234567890)"
                    className={styles.input}
                  />
                </div>

                {/* Row 1: Name and Email */}
                <div className={styles.grid2}>
                  {/* Researcher Name */}
                  <div>
                    <label className={styles.label}>Researcher Name *</label>
                    <input
                      type="text"
                      name="researcherName"
                      autoComplete="off"
                      value={formData.researcherName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className={styles.input}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className={styles.input}
                    />
                  </div>
                </div>
              </>
            )}

            {/* PDF UPLOAD SECTION - Shared by both tabs */}
            <div>
              <label className={styles.label}>Upload Proposal (PDF) *</label>

              {/* File Input - Hidden but accessible */}
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handlePdfChange}
                className={styles.hiddenFileInput}
              />

              {/* Dropzone */}
              <div
                className={styles.dropzone}
                onClick={() => {
                  document.getElementById('pdf-upload').click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add(styles.dropzoneActive);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove(styles.dropzoneActive);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove(styles.dropzoneActive);

                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];

                    // Validate file type
                    if (file.type !== 'application/pdf') {
                      setUploadError('❌ Please upload a PDF file only');
                      setFormData((prevState) => ({
                        ...prevState,
                        pdfFile: null
                      }));
                      return;
                    }

                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      setUploadError('❌ File size must be less than 5MB');
                      setFormData((prevState) => ({
                        ...prevState,
                        pdfFile: null
                      }));
                      return;
                    }

                    setUploadError('');
                    setFormData((prevState) => ({
                      ...prevState,
                      pdfFile: file
                    }));
                  }
                }}
              >
                <div className={styles.dropIcon}>📄</div>
                <p className={styles.dropTitle}>Click to upload or drag and drop</p>
                <p className={styles.dropHint}>PDF up to 5MB</p>
              </div>

              {/* File Info */}
              {formData.pdfFile && (
                <div className={styles.fileInfo}>
                  <span>
                    ✅ {formData.pdfFile.name} ({(formData.pdfFile.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, pdfFile: null }));
                      document.getElementById('pdf-upload').value = '';
                      setUploadError('');
                    }}
                    className={styles.fileRemove}
                    aria-label="Remove selected file"
                    title="Remove selected file"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Error Message */}
              {uploadError && <div className={styles.errorBox}>{uploadError}</div>}
            </div>

            {/* Buttons */}
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.primaryButton}>
                {activeTab === 'new' ? 'Submit Proposal' : 'Resubmit Proposal'}
              </button>
              <button type="button" onClick={handleClear} className={styles.secondaryButton}>
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className={`${styles.infoBox} ${isNew ? styles.infoBoxNew : styles.infoBoxResubmit}`}>
          <p className={`${styles.infoText} ${isNew ? styles.infoTextNew : styles.infoTextResubmit}`}>
            {isNew ? (
              <>
                <strong>Note:</strong> Your proposal PDF will be sent to the Ethics Committee. You will receive a
                confirmation email once submitted with your unique Project ID.
              </>
            ) : (
              <>
                <strong>Important:</strong> Your old submission will be deleted and replaced with this updated
                version. The Project ID will remain the same for tracking purposes.
              </>
            )}
          </p>
        </div>
      </div>

      {/* SUCCESS POPUP MODAL */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupIcon}>✅</div>

          <h2 className={styles.popupTitle}>{isResubmission ? 'Proposal Resubmitted!' : 'Proposal Submitted!'}</h2>

          <p className={styles.popupText}>
            {isResubmission
              ? 'Your updated proposal has been received. The old submission has been replaced.'
              : 'An email confirmation has been sent to you. Please save your Project ID safely!'}
          </p>

          {/* Display the Project ID */}
          <div className={styles.projectIdBox}>
            <span className={styles.projectIdLabel}>{isResubmission ? 'Your Project ID (Updated)' : 'Your Project ID'}</span>
            <span className={styles.projectIdValue}>{projectId ? projectId : 'Loading...'}</span>
          </div>

          <button onClick={() => setShowPopup(false)} className={styles.popupButton}>
            {isResubmission ? 'Close' : 'I have saved my ID, Close Window'}
          </button>
        </div>
      )}
    </div>
  );
}