import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface JobPostingFormData {
  title: string;
  description: string;
  category: string;
  priceType: 'hourly' | 'fixed';
  price: number;
  estimatedHours: number;
  urgency: 'low' | 'medium' | 'high';
  address: string;
  requiredSkills: string;
  specialInstructions: string;
  minAge?: number;
  maxAge?: number;
  requiresBackgroundCheck: boolean;
  startsAt: string;
  endsAt: string;
}

const JobPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [formData, setFormData] = useState<JobPostingFormData>({
    title: '',
    description: '',
    category: '',
    priceType: 'hourly',
    price: 0,
    estimatedHours: 1,
    urgency: 'medium',
    address: '',
    requiredSkills: '',
    specialInstructions: '',
    minAge: undefined,
    maxAge: undefined,
    requiresBackgroundCheck: false,
    startsAt: '',
    endsAt: ''
  });

  useEffect(() => {
    // Load job categories
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/job/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
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
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const job = await response.json();
        navigate(`/jobs/${job.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An error occurred while creating the job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-posting-form">
      <div className="form-header">
        <h1>Skapa nytt jobb</h1>
        <p>Fyll i informationen nedan för att publicera ditt jobb</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* Basic Information */}
        <div className="form-section">
          <h2>Grundinformation</h2>
          
          <div className="form-group">
            <label htmlFor="title">Jobbtitel *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="T.ex. Städning av lägenhet"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Beskrivning *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Beskriv vad som behöver göras..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="form-select"
            >
              <option value="">Välj kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h2>Pris och tidsuppskattning</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priceType">Pristyp *</label>
              <select
                id="priceType"
                name="priceType"
                value={formData.priceType}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="hourly">Per timme</option>
                <option value="fixed">Fast pris</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Pris (SEK) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedHours">Uppskattad tid (timmar)</label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleInputChange}
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Prioritet</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="low">Låg</option>
              <option value="medium">Medium</option>
              <option value="high">Hög</option>
            </select>
          </div>
        </div>

        {/* Location and Timing */}
        <div className="form-section">
          <h2>Plats och tid</h2>
          
          <div className="form-group">
            <label htmlFor="address">Adress</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="T.ex. Storgatan 1, Stockholm"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startsAt">Startdatum</label>
              <input
                type="datetime-local"
                id="startsAt"
                name="startsAt"
                value={formData.startsAt}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endsAt">Slutdatum</label>
              <input
                type="datetime-local"
                id="endsAt"
                name="endsAt"
                value={formData.endsAt}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="form-section">
          <h2>Krav och önskemål</h2>
          
          <div className="form-group">
            <label htmlFor="requiredSkills">Erforderliga färdigheter</label>
            <textarea
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleInputChange}
              rows={3}
              placeholder="T.ex. Erfarenhet av städning, körkort..."
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minAge">Minsta ålder</label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                value={formData.minAge || ''}
                onChange={handleInputChange}
                min="13"
                max="25"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxAge">Högsta ålder</label>
              <input
                type="number"
                id="maxAge"
                name="maxAge"
                value={formData.maxAge || ''}
                onChange={handleInputChange}
                min="13"
                max="25"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresBackgroundCheck"
                checked={formData.requiresBackgroundCheck}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Kräv bakgrundskontroll
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="specialInstructions">Särskilda instruktioner</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              placeholder="Eventuella särskilda instruktioner eller önskemål..."
              className="form-textarea"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="btn btn-secondary"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Skapar jobb...' : 'Publicera jobb'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;
