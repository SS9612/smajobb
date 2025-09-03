import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  priceType: string;
  price: number;
  status: string;
  urgency: string;
  estimatedHours: number;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  startsAt?: string;
  endsAt?: string;
}

interface JobApplication {
  id: string;
  youthId: string;
  youthName: string;
  youthProfile?: {
    hourlyRate: number;
    city: string;
  };
  coverLetter: string;
  status: string;
  proposedPrice?: number;
  proposedStartDate?: string;
  proposedEndDate?: string;
  createdAt: string;
}

const JobManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/job/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/job/${jobId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    loadApplications(job.id);
    setActiveTab('applications');
  };

  const handleApplicationAction = async (applicationId: string, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/job/application/${applicationId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Reload applications
        if (selectedJob) {
          loadApplications(selectedJob.id);
        }
        // Reload jobs to update application count
        loadJobs();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('An error occurred while updating the application');
    }
  };

  const handleJobStatusChange = async (jobId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/job/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadJobs();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('An error occurred while updating the job status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low': return 'urgency-low';
      default: return 'urgency-default';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Laddar dina jobb...</p>
      </div>
    );
  }

  return (
    <div className="job-management-dashboard">
      <div className="dashboard-header">
        <h1>Mina jobb</h1>
        <button
          onClick={() => navigate('/jobs/create')}
          className="btn btn-primary"
        >
          Skapa nytt jobb
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="job-list">
            <h3>Dina jobb ({jobs.length})</h3>
            {jobs.length === 0 ? (
              <div className="empty-state">
                <p>Du har inte skapat några jobb än.</p>
                <button
                  onClick={() => navigate('/jobs/create')}
                  className="btn btn-primary"
                >
                  Skapa ditt första jobb
                </button>
              </div>
            ) : (
              <div className="job-items">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className={`job-item ${selectedJob?.id === job.id ? 'active' : ''}`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <div className="job-item-header">
                      <h4>{job.title}</h4>
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="job-item-details">
                      <span className="category">{job.category}</span>
                      <span className={`urgency ${getUrgencyColor(job.urgency)}`}>
                        {job.urgency}
                      </span>
                    </div>
                    <div className="job-item-stats">
                      <span>{job.applicationCount} ansökningar</span>
                      <span>{job.viewCount} visningar</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-main">
          {selectedJob ? (
            <div className="job-details">
              <div className="job-details-header">
                <h2>{selectedJob.title}</h2>
                <div className="job-actions">
                  <select
                    value={selectedJob.status}
                    onChange={(e) => handleJobStatusChange(selectedJob.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="open">Öppen</option>
                    <option value="in_progress">Pågående</option>
                    <option value="completed">Slutförd</option>
                    <option value="cancelled">Avbruten</option>
                  </select>
                  <button
                    onClick={() => navigate(`/jobs/${selectedJob.id}/edit`)}
                    className="btn btn-secondary"
                  >
                    Redigera
                  </button>
                </div>
              </div>

              <div className="job-info">
                <div className="job-info-item">
                  <label>Kategori:</label>
                  <span>{selectedJob.category}</span>
                </div>
                <div className="job-info-item">
                  <label>Pris:</label>
                  <span>{selectedJob.price} SEK {selectedJob.priceType === 'hourly' ? 'per timme' : 'fast pris'}</span>
                </div>
                <div className="job-info-item">
                  <label>Uppskattad tid:</label>
                  <span>{selectedJob.estimatedHours} timmar</span>
                </div>
                <div className="job-info-item">
                  <label>Prioritet:</label>
                  <span className={`urgency ${getUrgencyColor(selectedJob.urgency)}`}>
                    {selectedJob.urgency}
                  </span>
                </div>
              </div>

              <div className="job-description">
                <h3>Beskrivning</h3>
                <p>{selectedJob.description}</p>
              </div>

              <div className="applications-section">
                <h3>Ansökningar ({applications.length})</h3>
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <p>Inga ansökningar än.</p>
                  </div>
                ) : (
                  <div className="applications-list">
                    {applications.map(application => (
                      <div key={application.id} className="application-item">
                        <div className="application-header">
                          <div className="applicant-info">
                            <h4>{application.youthName}</h4>
                            {application.youthProfile && (
                              <span className="applicant-location">
                                {application.youthProfile.city}
                              </span>
                            )}
                          </div>
                          <span className={`status-badge ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>

                        <div className="application-details">
                          {application.proposedPrice && (
                            <div className="proposed-price">
                              <label>Föreslaget pris:</label>
                              <span>{application.proposedPrice} SEK</span>
                            </div>
                          )}
                          {application.proposedStartDate && (
                            <div className="proposed-dates">
                              <label>Föreslaget start:</label>
                              <span>{new Date(application.proposedStartDate).toLocaleDateString('sv-SE')}</span>
                            </div>
                          )}
                        </div>

                        <div className="application-cover-letter">
                          <h5>Personligt brev:</h5>
                          <p>{application.coverLetter}</p>
                        </div>

                        {application.status === 'pending' && (
                          <div className="application-actions">
                            <button
                              onClick={() => handleApplicationAction(application.id, 'accept')}
                              className="btn btn-success"
                            >
                              Acceptera
                            </button>
                            <button
                              onClick={() => handleApplicationAction(application.id, 'reject')}
                              className="btn btn-danger"
                            >
                              Avslå
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Välj ett jobb för att se detaljer och ansökningar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagementDashboard;
