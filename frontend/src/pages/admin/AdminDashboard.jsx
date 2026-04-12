import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function AdminDashboard() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProposals = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/proposals`, {
        credentials: 'include'
      });

      if (res.status === 403) {
        navigate('/admin/login');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Unable to load proposals');
        return;
      }

      setProposals(data.data || []);
    } catch (err) {
      setError('Unable to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleDownload = async (proposalId) => {
    setError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/proposals/${proposalId}/download`, {
        credentials: 'include'
      });

      if (res.status === 403) {
        navigate('/admin/login');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        setError(data.message || 'Unable to generate download link');
        return;
      }

      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError('Unable to generate download link');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      // ignore
    } finally {
      navigate('/admin/login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Submitted proposals</p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={fetchProposals}>
            Refresh
          </button>
          <button type="button" className={styles.button} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div className={styles.loading}>Loading proposals...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Researcher</th>
                <th>Email</th>
                <th>Project Title</th>
                <th>File Name</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.empty}>No proposals found.</td>
                </tr>
              ) : (
                proposals.map((proposal) => (
                  <tr key={proposal._id}>
                    <td>{proposal.projectId}</td>
                    <td>{proposal.researcherName}</td>
                    <td>{proposal.email}</td>
                    <td>{proposal.projectTitle}</td>
                    <td>{proposal.pdfFileName || '-'}</td>
                    <td>{proposal.submittedAt ? new Date(proposal.submittedAt).toLocaleString() : '-'}</td>
                    <td>{proposal.status || 'Pending'}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => handleDownload(proposal._id)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
