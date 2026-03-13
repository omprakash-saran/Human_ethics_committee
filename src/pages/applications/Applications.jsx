import { useState } from 'react';

export default function Applications() {
  // Tab state: 'new' for first submission, 'resubmit' for updates
  const [activeTab, setActiveTab] = useState('new');

  const [formData, setFormData] = useState({
    researcherName: '',
    email: '',
    projectTitle: '',
    pdfFile: null,
    projectId: '' // For resubmission
  });

  const [showPopup, setShowPopup] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isResubmission, setIsResubmission] = useState(false); // Track if it's a resubmission

  // ✅ THIS FUNCTION MUST BE HERE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle PDF file upload
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        setUploadError('❌ Please upload a PDF file only');
        setFormData(prevState => ({
          ...prevState,
          pdfFile: null
        }));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('❌ File size must be less than 5MB');
        setFormData(prevState => ({
          ...prevState,
          pdfFile: null
        }));
        return;
      }

      setUploadError('');
      setFormData(prevState => ({
        ...prevState,
        pdfFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Clear previous errors
  setUploadError('');
  
  // Common validation
  if (!formData.pdfFile) {
    setUploadError('❌ Please upload a PDF file');
    return;
  }

  // Validation for NEW submission
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

  // Validation for RESUBMISSION
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
    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('pdfFile', formData.pdfFile);

    // For NEW submission
    if (activeTab === 'new') {
      formDataToSend.append('researcherName', formData.researcherName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('projectTitle', formData.projectTitle);
      formDataToSend.append('isResubmission', 'false');

      console.log('Submitting NEW proposal...'); // Debug log

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
    // For RESUBMISSION
    else if (activeTab === 'resubmit') {
      formDataToSend.append('projectId', formData.projectId);
      formDataToSend.append('researcherName', formData.researcherName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('isResubmission', 'true');

      console.log('Submitting RESUBMISSION...'); // Debug log

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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      paddingTop: '40px',
      paddingBottom: '80px',
      paddingLeft: '16px',
      paddingRight: '16px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#236b60',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Submit Your Research Proposal
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.6'
          }}>
            Fill out the form and upload your research proposal PDF to IIT Roorkee
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
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
            style={{
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'new' ? '3px solid #236b60' : 'none',
              color: activeTab === 'new' ? '#236b60' : '#999',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'new') e.target.style.color = '#236b60';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'new') e.target.style.color = '#999';
            }}
          >
            📝 New Submission
          </button>

          <button
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
            style={{
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'resubmit' ? '3px solid #236b60' : 'none',
              color: activeTab === 'resubmit' ? '#236b60' : '#999',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'resubmit') e.target.style.color = '#236b60';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'resubmit') e.target.style.color = '#999';
            }}
          >
            🔄 Resubmit Proposal
          </button>
        </div>

        {/* Form Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          marginBottom: '32px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* TAB 1: NEW SUBMISSION */}
            {activeTab === 'new' && (
              <>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #86efac',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: '#166534', fontSize: '14px', margin: '0', fontWeight: '500' }}>
                    ✅ First time submitting? Fill in your details and upload your proposal. You'll receive a unique Project ID.
                  </p>
                </div>

                {/* Row 1: Name and Email */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px'
                }}>
                  
                  {/* Researcher Name */}
                  <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Researcher Name *
                </label>
                <input
                  type="text"
                  name="researcherName"
                  autoComplete="off"
                  value={formData.researcherName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#236b60';
                    e.target.style.boxShadow = '0 0 0 3px rgba(35, 107, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#236b60';
                    e.target.style.boxShadow = '0 0 0 3px rgba(35, 107, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

                {/* Project Title */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    autoComplete="off"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your research project title"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#236b60';
                      e.target.style.boxShadow = '0 0 0 3px rgba(35, 107, 96, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </>
            )}

            {/* TAB 2: RESUBMISSION */}
            {activeTab === 'resubmit' && (
              <>
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fcd34d',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: '#92400e', fontSize: '14px', margin: '0', fontWeight: '500' }}>
                    🔄 Resubmitting? Enter your Project ID from the original submission and upload the updated PDF.
                  </p>
                </div>

                {/* Project ID Field */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    Project ID *
                  </label>
                  <input
                    type="text"
                    name="projectId"
                    autoComplete="off"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your Project ID (e.g., PROJ-1234567890)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#236b60';
                      e.target.style.boxShadow = '0 0 0 3px rgba(35, 107, 96, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Row 1: Name and Email */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px'
                }}>
                  
                  {/* Researcher Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      Researcher Name *
                    </label>
                    <input
                      type="text"
                      name="researcherName"
                      autoComplete="off"
                      value={formData.researcherName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#236b60';
                        e.target.style.boxShadow = '0 0 0 3px rgba(35, 107, 96, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#236b60';
                        e.target.style.boxShadow = '0 0 0 3px rgba(35, 107, 96, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* PDF UPLOAD SECTION - Shared by both tabs */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                Upload Proposal (PDF) *
              </label>
              
              {/* File Input - Hidden but accessible */}
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handlePdfChange}
                style={{
                  display: 'none'
                }}
              />
              
              {/* File Input */}
              <div 
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '8px'
                }}
                onClick={() => {
                  document.getElementById('pdf-upload').click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#236b60';
                  e.currentTarget.style.backgroundColor = '#f0f9f7';
                  e.currentTarget.style.borderWidth = '2px';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    
                    // Validate file type
                    if (file.type !== 'application/pdf') {
                      setUploadError('❌ Please upload a PDF file only');
                      setFormData(prevState => ({
                        ...prevState,
                        pdfFile: null
                      }));
                      return;
                    }

                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      setUploadError('❌ File size must be less than 5MB');
                      setFormData(prevState => ({
                        ...prevState,
                        pdfFile: null
                      }));
                      return;
                    }

                    setUploadError('');
                    setFormData(prevState => ({
                      ...prevState,
                      pdfFile: file
                    }));
                  }
                }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '12px'
                }}>
                  📄
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#236b60',
                  marginBottom: '4px'
                }}>
                  Click to upload or drag and drop
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#999'
                }}>
                  PDF up to 5MB
                </p>
              </div>

              {/* File Info */}
              {formData.pdfFile && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  border: '1px solid #86efac',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#166534',
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>✅ {formData.pdfFile.name} ({(formData.pdfFile.size / 1024 / 1024).toFixed(2)}MB)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, pdfFile: null }));
                      document.getElementById('pdf-upload').value = '';
                      setUploadError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#166534',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0',
                      marginLeft: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#991b1b',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {uploadError}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginTop: '24px'
            }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#236b60',
                  color: 'white',
                  fontWeight: '600',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(35, 107, 96, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1a5349';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(35, 107, 96, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#236b60';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(35, 107, 96, 0.3)';
                }}
              >
                {activeTab === 'new' ? 'Submit Proposal' : 'Resubmit Proposal'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  fontWeight: '600',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#d1d5db';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: activeTab === 'new' ? '#eff6ff' : '#fef3c7',
          borderLeft: `4px solid ${activeTab === 'new' ? '#3b82f6' : '#f59e0b'}`,
          padding: '16px 20px',
          borderRadius: '6px',
          marginBottom: '50px'
        }}>
          <p style={{
            color: activeTab === 'new' ? '#1e40af' : '#92400e',
            fontSize: '15px',
            lineHeight: '1.6',
            margin: '0'
          }}>
            {activeTab === 'new' ? (
              <>
                <strong>📝 Note:</strong> Your proposal PDF will be sent to the Ethics Committee. 
                You will receive a confirmation email once submitted with your unique Project ID.
              </>
            ) : (
              <>
                <strong>⚠️ Important:</strong> Your old submission will be deleted and replaced with this updated version. 
                The Project ID will remain the same for tracking purposes.
              </>
            )}
          </p>
        </div>
      </div>

            {/* SUCCESS POPUP MODAL */}
      {showPopup && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '20px', right: '20px',
          backgroundColor: 'white', borderRadius: '12px', padding: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', zIndex: 1000,
          maxWidth: '500px', margin: '0 auto',
          animation: 'slideUpFromBottom 0.4s ease-out'
        }}>
          <div style={{
            width: '60px', height: '60px', backgroundColor: '#dcfce7',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            fontSize: '36px', animation: 'scaleIn 0.5s ease-out'
          }}>✅</div>

          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#236b60', marginBottom: '8px', textAlign: 'center' }}>
            {isResubmission ? 'Proposal Resubmitted!' : 'Proposal Submitted!'}
          </h2>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6', textAlign: 'center' }}>
            {isResubmission 
              ? 'Your updated proposal has been received. The old submission has been replaced.'
              : 'An email confirmation has been sent to you. Please save your Project ID safely!'
            }
          </p>

          {/* Display the Project ID */}
          <div style={{
            backgroundColor: '#f0fdf4', border: '2px dashed #22c55e',
            padding: '16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '12px', color: '#166534', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>
              {isResubmission ? 'Your Project ID (Updated)' : 'Your Project ID'}
            </span>
            <span style={{ fontSize: '24px', color: '#15803d', fontWeight: '900', letterSpacing: '1px' }}>
              {projectId ? projectId : 'Loading...'}
            </span>
          </div>

          <button
            onClick={() => setShowPopup(false)}
            style={{
              backgroundColor: '#236b60', color: 'white', fontWeight: '600',
              padding: '12px 20px', borderRadius: '6px', border: 'none',
              fontSize: '15px', cursor: 'pointer', transition: 'all 0.3s ease', width: '100%'
            }}
          >
            {isResubmission ? 'Close' : 'I have saved my ID, Close Window'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUpFromBottom {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}