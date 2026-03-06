import { useState } from 'react';

export default function Applications() {
  const [formData, setFormData] = useState({
    researcherName: '',
    email: '',
    projectTitle: '',
    startDate: '',
    endDate: '',
    pdfFile: null
  });

  const [showPopup, setShowPopup] = useState(false);
  const [uploadError, setUploadError] = useState('');

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
  
  // Validate all fields
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
  
  if (!formData.startDate) {
    setUploadError('❌ Please select start date');
    return;
  }
  
  if (!formData.endDate) {
    setUploadError('❌ Please select end date');
    return;
  }
  
  // Check if PDF is uploaded
  if (!formData.pdfFile) {
    setUploadError('❌ Please upload a PDF file');
    return;
  }

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('researcherName', formData.researcherName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('projectTitle', formData.projectTitle);
    formDataToSend.append('startDate', formData.startDate);
    formDataToSend.append('endDate', formData.endDate);
    formDataToSend.append('pdfFile', formData.pdfFile);

    console.log('Submitting form data...'); // Debug log

    const response = await fetch('http://localhost:5001/api/proposals', {
      method: 'POST',
      body: formDataToSend
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Proposal submitted successfully!', data);
      setShowPopup(true);

      setTimeout(() => {
        setFormData({
          researcherName: '',
          email: '',
          projectTitle: '',
          startDate: '',
          endDate: '',
          pdfFile: null
        });
        setUploadError('');
        setShowPopup(false);
      }, 3000);
    } else {
      setUploadError('❌ Error: ' + data.message);
      console.error('Error:', data);
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
      startDate: '',
      endDate: '',
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

        {/* Form Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          marginBottom: '32px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
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

            {/* PDF Upload Section */}
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
              
              {/* File Input */}
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '8px'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#236b60';
                e.currentTarget.style.backgroundColor = '#f0f9f7';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#f9fafb';
                if (e.dataTransfer.files[0]) {
                  handlePdfChange({ target: { files: e.dataTransfer.files } });
                }
              }}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  style={{
                    display: 'none'
                  }}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" style={{
                  cursor: 'pointer',
                  display: 'block'
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
                </label>
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
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#166534',
                      cursor: 'pointer',
                      fontSize: '18px'
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

            {/* Row 2: Dates */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              
              {/* Start Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Project Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  autoComplete="off"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
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

              {/* End Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Project End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  autoComplete="off"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
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
                Submit Proposal
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
          backgroundColor: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: '16px 20px',
          borderRadius: '6px',
          marginBottom: '50px'
        }}>
          <p style={{
            color: '#1e40af',
            fontSize: '15px',
            lineHeight: '1.6',
            margin: '0'
          }}>
            <strong>📝 Note:</strong> Your proposal PDF will be sent to the Ethics Committee. 
            You will receive a confirmation email once submitted.
          </p>
        </div>
      </div>

      {/* SUCCESS POPUP MODAL */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          maxWidth: '500px',
          margin: '0 auto',
          animation: 'slideUpFromBottom 0.4s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '36px',
            animation: 'scaleIn 0.5s ease-out'
          }}>
            ✅
          </div>

          <h2 style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#236b60',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Proposal Submitted!
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '8px',
            lineHeight: '1.6',
            textAlign: 'center'
          }}>
            Your research proposal has been successfully submitted to the Ethics Committee.
          </p>

          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#1f2937',
            textAlign: 'center'
          }}>
            <strong>Submitted by:</strong> {formData.researcherName}
          </div>

          <button
            onClick={() => setShowPopup(false)}
            style={{
              backgroundColor: '#236b60',
              color: 'white',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1a5349';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#236b60';
            }}
          >
            Close
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