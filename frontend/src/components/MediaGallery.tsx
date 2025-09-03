import React, { useState, useEffect } from 'react';
import { mediaApi, Media } from '../services/mediaApi';
import FileUpload from './FileUpload';

interface MediaGalleryProps {
  entityType: string;
  entityId: string;
  showUpload?: boolean;
  showDelete?: boolean;
  onMediaSelect?: (media: Media) => void;
  onMediaDelete?: (mediaId: string) => void;
  className?: string;
  maxItems?: number;
  columns?: number;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  entityType,
  entityId,
  showUpload = true,
  showDelete = false,
  onMediaSelect,
  onMediaDelete,
  className = '',
  maxItems,
  columns = 3
}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadMedia = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const mediaList = await mediaApi.getMediaByEntity(entityType, entityId);
      const limitedMedia = maxItems ? mediaList.slice(0, maxItems) : mediaList;
      setMedia(limitedMedia);
    } catch (err: any) {
      setError('Kunde inte ladda media');
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, maxItems]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);



  const handleUploadComplete = (results: any[]) => {
    // Reload media after successful upload
    loadMedia();
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  const handleMediaClick = (mediaItem: Media) => {
    setSelectedMedia(mediaItem);
    setShowModal(true);
    if (onMediaSelect) {
      onMediaSelect(mediaItem);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna fil?')) {
      return;
    }

    try {
      await mediaApi.deleteMedia(mediaId);
      setMedia(media.filter(m => m.id !== mediaId));
      if (onMediaDelete) {
        onMediaDelete(mediaId);
      }
    } catch (err: any) {
      setError('Kunde inte ta bort filen');
      console.error('Error deleting media:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  const renderMediaItem = (mediaItem: Media) => {
    const isImage = mediaApi.isImageFile(mediaItem.contentType);
    const isVideo = mediaApi.isVideoFile(mediaItem.contentType);
    const isAudio = mediaApi.isAudioFile(mediaItem.contentType);

    return (
      <div
        key={mediaItem.id}
        className="media-gallery-item"
        onClick={() => handleMediaClick(mediaItem)}
      >
        <div className="media-item-content">
          {isImage ? (
            <img
              src={mediaItem.thumbnailUrl || mediaItem.url}
              alt={mediaItem.altText || mediaItem.originalFileName}
              className="media-image"
              loading="lazy"
            />
          ) : isVideo ? (
            <div className="media-video-placeholder">
              <span className="media-icon">🎥</span>
              <span className="media-type">Video</span>
            </div>
          ) : isAudio ? (
            <div className="media-audio-placeholder">
              <span className="media-icon">🎵</span>
              <span className="media-type">Ljud</span>
            </div>
          ) : (
            <div className="media-file-placeholder">
              <span className="media-icon">
                {mediaApi.getFileTypeIcon(mediaItem.contentType)}
              </span>
              <span className="media-type">Fil</span>
            </div>
          )}
          
          <div className="media-overlay">
            <div className="media-info">
              <span className="media-name">{mediaItem.originalFileName}</span>
              <span className="media-size">
                {mediaApi.formatFileSize(mediaItem.fileSize)}
              </span>
            </div>
            
            {showDelete && (
              <button
                className="media-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMedia(mediaItem.id);
                }}
                title="Ta bort fil"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`media-gallery loading ${className}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Laddar media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`media-gallery ${className}`}>
      {/* Upload Section */}
      {showUpload && (
        <div className="media-gallery-upload">
          <FileUpload
            entityType={entityType}
            entityId={entityId}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            multiple={true}
            showPreview={false}
            className="gallery-upload"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="media-gallery-error">
          <p>{error}</p>
        </div>
      )}

      {/* Media Grid */}
      {media.length > 0 ? (
        <div 
          className="media-gallery-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {media.map(renderMediaItem)}
        </div>
      ) : (
        <div className="media-gallery-empty">
          <div className="empty-icon">📁</div>
          <p>Inga filer uppladdade än</p>
        </div>
      )}

      {/* Media Modal */}
      {showModal && selectedMedia && (
        <div className="media-modal-overlay" onClick={closeModal}>
          <div className="media-modal" onClick={(e) => e.stopPropagation()}>
            <div className="media-modal-header">
              <h3>{selectedMedia.originalFileName}</h3>
              <button className="media-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            
            <div className="media-modal-content">
              {mediaApi.isImageFile(selectedMedia.contentType) ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.altText || selectedMedia.originalFileName}
                  className="media-modal-image"
                />
              ) : mediaApi.isVideoFile(selectedMedia.contentType) ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="media-modal-video"
                />
              ) : mediaApi.isAudioFile(selectedMedia.contentType) ? (
                <audio
                  src={selectedMedia.url}
                  controls
                  className="media-modal-audio"
                />
              ) : (
                <div className="media-modal-file">
                  <div className="file-icon-large">
                    {mediaApi.getFileTypeIcon(selectedMedia.contentType)}
                  </div>
                  <p>{selectedMedia.originalFileName}</p>
                  <a
                    href={selectedMedia.url}
                    download={selectedMedia.originalFileName}
                    className="btn btn-primary"
                  >
                    Ladda ner
                  </a>
                </div>
              )}
            </div>
            
            <div className="media-modal-footer">
              <div className="media-details">
                <p><strong>Storlek:</strong> {mediaApi.formatFileSize(selectedMedia.fileSize)}</p>
                <p><strong>Typ:</strong> {selectedMedia.contentType}</p>
                <p><strong>Uppladdad:</strong> {new Date(selectedMedia.createdAt).toLocaleDateString('sv-SE')}</p>
                {selectedMedia.description && (
                  <p><strong>Beskrivning:</strong> {selectedMedia.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
