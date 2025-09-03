import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  jobPrice: number;
  jobPriceType: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ApplicationFormData {
  coverLetter: string;
  proposedPrice?: number;
  proposedStartDate?: string;
  proposedEndDate?: string;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  jobTitle,
  jobPrice,
  jobPriceType,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    coverLetter: '',
    proposedPrice: undefined,
    proposedStartDate: '',
    proposedEndDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/job/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          ...formData
        })
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/jobs/${jobId}`);
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred while submitting your application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-application-form">
      <div className="form-header">
        <h2>Ansök om jobbet</h2>
        <p>"{jobTitle}"</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* Job Information */}
        <div className="job-info-card">
          <h3>Jobbinformation</h3>
          <div className="job-info-item">
            <label>Pris:</label>
            <span>{jobPrice} SEK {jobPriceType === 'hourly' ? 'per timme' : 'fast pris'}</span>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="form-group">
          <label htmlFor="coverLetter">Personligt brev *</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            required
            rows={6}
            placeholder="Berätta varför du är rätt person för detta jobb. Inkludera relevant erfarenhet och varför du är intresserad..."
            className="form-textarea"
          />
          <small className="form-help">
            Ett bra personligt brev ökar dina chanser att få jobbet. Berätta om din erfarenhet och varför du är rätt person för uppgiften.
          </small>
        </div>

        {/* Proposed Terms */}
        <div className="form-section">
          <h3>Föreslagna villkor (valfritt)</h3>
          <p className="section-description">
            Du kan föreslå alternativa villkor om du vill förhandla om priset eller tiden.
          </p>

          <div className="form-group">
            <label htmlFor="proposedPrice">Föreslaget pris (SEK)</label>
            <input
              type="number"
              id="proposedPrice"
              name="proposedPrice"
              value={formData.proposedPrice || ''}
              onChange={handleInputChange}
              min="0"
              placeholder={`Föreslå ett pris (aktuellt: ${jobPrice} SEK)`}
              className="form-input"
            />
            <small className="form-help">
              Lämna tomt om du accepterar det ursprungliga priset.
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proposedStartDate">Föreslaget startdatum</label>
              <input
                type="date"
                id="proposedStartDate"
                name="proposedStartDate"
                value={formData.proposedStartDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="proposedEndDate">Föreslaget slutdatum</label>
              <input
                type="date"
                id="proposedEndDate"
                name="proposedEndDate"
                value={formData.proposedEndDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="application-tips">
          <h4>Tips för en bra ansökan:</h4>
          <ul>
            <li>Skriv ett personligt och engagerat brev</li>
            <li>Nämn relevant erfarenhet och färdigheter</li>
            <li>Visa entusiasm för uppgiften</li>
            <li>Var tydlig med din tillgänglighet</li>
            <li>Kontrollera stavning och grammatik</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel || (() => navigate(`/jobs/${jobId}`))}
            className="btn btn-secondary"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Skickar ansökan...' : 'Skicka ansökan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
