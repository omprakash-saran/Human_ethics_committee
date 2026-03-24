import { useEffect, useState } from 'react';
import styles from './Applications.module.css';

export default function Applications() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  const [activeTab, setActiveTab] = useState('new');
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/user-dashboard`, {
          credentials: 'include'
        });

        if (isMounted) {
          setIsAuthenticated(response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsAuthChecked(true);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const handleLogin = () => {
    window.location.href = `${apiBaseUrl}/auth/omniport/login`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
    }
  };

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
        setUploadError('⚠ File format invalid. Only PDF files are accepted. Please convert and resubmit your document.');
        setFormData((prevState) => ({
          ...prevState,
          pdfFile: null
        }));
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setUploadError('⚠ File size exceeds the 20MB limit. Please reduce the file size by compressing or removing unnecessary content.');
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
        setUploadError('⚠ Research proposal document is required. Please upload a PDF file to proceed.');
        return;
      }

      if (activeTab === 'new') {
        if (!formData.researcherName.trim()) {
          setUploadError('⚠ Researcher name is mandatory. Please provide your full name to continue.');
          return;
        }

        if (!formData.email.trim()) {
          setUploadError('⚠ Email address is required. Please enter a valid email for communication.');
          return;
        }

        if (!formData.projectTitle.trim()) {
          setUploadError('⚠ Project title is necessary. Please provide a descriptive title for your research.');
          return;
        }
      }

      if (activeTab === 'resubmit') {
        if (!formData.projectId.trim()) {
          setUploadError('⚠ Project ID is required. Please enter the ID from your initial submission.');
          return;
        }

        if (!formData.researcherName.trim()) {
          setUploadError('⚠ Researcher name is mandatory. Please provide your full name to continue.');
          return;
        }

        if (!formData.email.trim()) {
          setUploadError('⚠ Email address is required. Please enter a valid email for communication.');
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

        console.log('Submitting new research proposal...'); 

        const response = await fetch(`${apiBaseUrl}/api/proposals`, {
          method: 'POST',
          body: formDataToSend,
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✓ Research proposal submitted successfully!', data);
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
            const fileInput = document.getElementById('pdf-upload');
            if (fileInput) fileInput.value = '';
          }, 3000);
        } else {
          setUploadError('⚠ Submission Error: ' + data.message);
          console.error('Error:', data);
        }
      }
      else if (activeTab === 'resubmit') {
        formDataToSend.append('projectId', formData.projectId);
        formDataToSend.append('researcherName', formData.researcherName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('isResubmission', 'true');

        console.log('Submitting updated research proposal...'); 

        const response = await fetch(`${apiBaseUrl}/api/proposals/resubmit`, {
          method: 'POST',
          body: formDataToSend,
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✓ Research proposal resubmitted successfully!', data);
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
            const fileInput = document.getElementById('pdf-upload');
            if (fileInput) fileInput.value = '';
          }, 3000);
        } else {
          setUploadError('⚠ Resubmission Error: ' + data.message);
          console.error('Error:', data);
        }
      }
    } catch (error) {
      setUploadError('⚠ An error occurred while processing your submission. Please try again or contact support.');
      console.error('Error:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      researcherName: '',
      email: '',
      projectTitle: '',
      pdfFile: null,
      projectId: ''   
    });
    setUploadError('');
  };

  const isNew = activeTab === 'new';

  if (!isAuthChecked) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.heading}>Checking login...</h1>
            <p className={styles.subheading}>Verifying your session.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.heading}>Research Proposal Submission</h1>
            <p className={styles.subheading}>
              To submit a research proposal for ethical clearance, you must be logged in as a faculty member of IIT Roorkee.
            </p>
          </div>
          <div className={styles.loginCard}>
            <p className={styles.loginText}>Please log in using your Omniport credentials to continue.</p>
            <button type="button" onClick={handleLogin} className={styles.loginButton}>
              Log in with Omniport
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <h1 className={styles.heading}>Research Proposal Submission Portal</h1>
            <button type="button" onClick={handleLogout} className={styles.logoutButton}>
              Log out
            </button>
          </div>
          <p className={styles.subheading}>
            Submit your research proposal for ethical review to the Human Ethics Committee at IIT Roorkee. Our comprehensive review process ensures adherence to international research standards.
          </p>
        </div>

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
              const fileInput = document.getElementById('pdf-upload');
              if (fileInput) fileInput.value = '';
            }}
            className={`${styles.tabButton} ${isNew ? styles.tabActive : ''}`}
          >
            Initial Submission
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
              const fileInput = document.getElementById('pdf-upload');
              if (fileInput) fileInput.value = '';
            }}
            className={`${styles.tabButton} ${!isNew ? styles.tabActive : ''}`}
          >
            Re-Submission
          </button>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {activeTab === 'new' && (
              <>
                <div className={styles.grid2}>
                  <div>
                    <label className={styles.label}>Primary Researcher Name *</label>
                    <input
                      type="text"
                      name="researcherName"
                      autoComplete="off"
                      value={formData.researcherName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Name"
                      className={styles.input}
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Contact Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="researcher@institution.edu"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Research Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    autoComplete="off"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    placeholder=""
                    className={styles.input}
                  />
                </div>
              </>
            )}

            {activeTab === 'resubmit' && (
              <>

                <div>
                  <label className={styles.label}>Original Project ID *</label>
                  <input
                    type="text"
                    name="projectId"
                    autoComplete="off"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your Project ID"
                    className={styles.input}
                  />
                </div>

                <div className={styles.grid2}>
                  <div>
                    <label className={styles.label}>Primary Researcher Name *</label>
                    <input
                      type="text"
                      name="researcherName"
                      autoComplete="off"
                      value={formData.researcherName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Name"
                      className={styles.input}
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Contact Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="researcher@institution.edu"
                      className={styles.input}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={styles.label}>Research Proposal Document (PDF) *</label>

              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handlePdfChange}
                className={styles.hiddenFileInput}
              />

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

                    if (file.type !== 'application/pdf') {
                      setUploadError('⚠ File format invalid. Only PDF files are accepted. Please convert and resubmit your document.');
                      setFormData((prevState) => ({
                        ...prevState,
                        pdfFile: null
                      }));
                      return;
                    }

                    if (file.size > 20 * 1024 * 1024) {
                      setUploadError('⚠ File size exceeds the 20MB limit. Please reduce the file size by compressing or removing unnecessary content.');
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
                <p className={styles.dropTitle}>Click to upload or drag and drop your document</p>
                <p className={styles.dropHint}>PDF format • Maximum file size: 20MB</p>
              </div>

              {/* File Info */}
              {formData.pdfFile && (
                <div className={styles.fileInfo}>
                  <span>
                    ✓ {formData.pdfFile.name} ({(formData.pdfFile.size / 1024 / 1024).toFixed(2)}MB)
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

              {uploadError && <div className={styles.errorBox}>{uploadError}</div>}
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.primaryButton}>
                {activeTab === 'new' ? 'Submit Proposal' : 'Resubmit Proposal'}
              </button>
              <button type="button" onClick={handleClear} className={styles.secondaryButton}>
                Clear All Fields
              </button>
            </div>
          </form>
        </div>

        <div className={`${styles.infoBox} ${isNew ? styles.infoBoxNew : styles.infoBoxResubmit}`}>
          <p className={`${styles.infoText} ${isNew ? styles.infoTextNew : styles.infoTextResubmit}`}>
            {isNew ? (
              <>
                <strong>Important Notice:</strong> Your research proposal will be reviewed by the Human Ethics Committee following institutional guidelines. A confirmation email along with your unique Project ID will be sent for tracking and future communications.
              </>
            ) : (
              <>
                <strong>Important Notice:</strong> Your revised proposal will replace the original submission in our system. The Project ID will remain unchanged for continuity tracking. The Committee will evaluate your revisions in accordance with current protocols.
              </>
            )}
          </p>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupIcon}>✓</div>

          <h2 className={styles.popupTitle}>{isResubmission ? 'Submission Received' : 'Submission Confirmed'}</h2>

          <p className={styles.popupText}>
            {isResubmission
              ? 'Your revised proposal has been successfully recorded. The previous version has been archived and superseded by this submission.'
              : 'Your research proposal has been successfully submitted to the Human Ethics Committee for review. A confirmation message has been sent to your email address.'}
          </p>


          <div className={styles.projectIdBox}>
            <span className={styles.projectIdLabel}>{isResubmission ? 'Project ID (Tracking)' : 'Your Project ID'}</span>
            <span className={styles.projectIdValue}>{projectId ? projectId : 'Loading...'}</span>
          </div>

          <button onClick={() => setShowPopup(false)} className={styles.popupButton}>
            {isResubmission ? 'Complete' : 'I Understand'}
          </button>
        </div>
      )}
    </div>
  );
}