import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import MediaGallery from '../components/MediaGallery';
import FileUpload from '../components/FileUpload';
import { MediaUploadResult } from '../services/mediaApi';

const Media: React.FC = () => {
  const { user } = useAuth();
  const [selectedEntityType, setSelectedEntityType] = useState('user');
  const [selectedEntityId, setSelectedEntityId] = useState(user?.id || '');
  const [uploadResults, setUploadResults] = useState<MediaUploadResult[]>([]);

  const handleUploadComplete = (results: MediaUploadResult[]) => {
    setUploadResults(results);
    console.log('Upload completed:', results);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  const handleMediaSelect = (media: any) => {
    console.log('Media selected:', media);
  };

  const handleMediaDelete = (mediaId: string) => {
    console.log('Media deleted:', mediaId);
  };

  if (!user) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">
          <div className="error-container">
            <h2>Åtkomst nekad</h2>
            <p>Du måste vara inloggad för att hantera media.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mediahantering</h2>
            <p>Ladda upp och hantera dina filer</p>
          </div>

          {/* Entity Selection */}
          <div className="media-entity-selection">
            <div className="form-group">
              <label htmlFor="entityType">Entitetstyp:</label>
              <select
                id="entityType"
                value={selectedEntityType}
                onChange={(e) => setSelectedEntityType(e.target.value)}
                className="form-control"
              >
                <option value="user">Användare</option>
                <option value="job">Jobb</option>
                <option value="message">Meddelande</option>
                <option value="review">Recension</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="entityId">Entitets-ID:</label>
              <input
                id="entityId"
                type="text"
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="form-control"
                placeholder="Ange entitets-ID"
              />
            </div>
          </div>

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="upload-results">
              <h3>Uppladdningsresultat</h3>
              <div className="results-list">
                {uploadResults.map((result, index) => (
                  <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                    <div className="result-icon">
                      {result.success ? '✅' : '❌'}
                    </div>
                    <div className="result-details">
                      <p><strong>{result.fileName}</strong></p>
                      {result.success ? (
                        <p>Uppladdad: <a href={result.url} target="_blank" rel="noopener noreferrer">Visa fil</a></p>
                      ) : (
                        <p>Fel: {result.errorMessage}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Component */}
          <div className="media-upload-section">
            <h3>Ladda upp filer</h3>
            <FileUpload
              entityType={selectedEntityType}
              entityId={selectedEntityId}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              multiple={true}
              showPreview={true}
              className="media-page-upload"
            />
          </div>

          {/* Media Gallery */}
          <div className="media-gallery-section">
            <h3>Uppladdade filer</h3>
            <MediaGallery
              entityType={selectedEntityType}
              entityId={selectedEntityId}
              showUpload={false}
              showDelete={true}
              onMediaSelect={handleMediaSelect}
              onMediaDelete={handleMediaDelete}
              className="media-page-gallery"
              columns={4}
            />
          </div>

          {/* Usage Examples */}
          <div className="media-usage-examples">
            <h3>Användningsexempel</h3>
            <div className="examples-grid">
              <div className="example-card">
                <h4>Profilbilder</h4>
                <p>Ladda upp profilbilder för användare</p>
                <code>entityType: "user", entityId: "user-id"</code>
              </div>
              
              <div className="example-card">
                <h4>Jobb-bilder</h4>
                <p>Ladda upp bilder för jobbannonser</p>
                <code>entityType: "job", entityId: "job-id"</code>
              </div>
              
              <div className="example-card">
                <h4>Meddelande-bilagor</h4>
                <p>Ladda upp filer som bilagor i meddelanden</p>
                <code>entityType: "message", entityId: "message-id"</code>
              </div>
              
              <div className="example-card">
                <h4>Recensions-bilder</h4>
                <p>Ladda upp bilder med recensioner</p>
                <code>entityType: "review", entityId: "review-id"</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;
