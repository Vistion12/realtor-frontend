// components/ImageCarousel.tsx
import { useState } from 'react';
import { Modal, Button, Image } from 'antd';
import { LeftOutlined, RightOutlined, ExpandOutlined } from '@ant-design/icons';
import { PropertyImage } from '../Models/Property';

interface ImageCarouselProps {
  images: PropertyImage[];
  propertyTitle: string;
}

export const ImageCarousel = ({ images, propertyTitle }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="image-placeholder">
        <div>Нет изображений</div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="image-carousel">
        <div className="carousel-container">
          <img
            src={`http://localhost:5100${images[currentIndex].url}`}
            alt={`${propertyTitle} - ${currentIndex + 1}`}
            className="carousel-image"
            onClick={openModal}
          />
          
          {images.length > 1 && (
            <>
              <Button 
                className="carousel-btn prev-btn"
                icon={<LeftOutlined />}
                onClick={prevImage}
                size="small"
              />
              <Button 
                className="carousel-btn next-btn"
                icon={<RightOutlined />}
                onClick={nextImage}
                size="small"
              />
            </>
          )}
          
          <Button 
            className="expand-btn"
            icon={<ExpandOutlined />}
            onClick={openModal}
            size="small"
          />
        </div>

        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width="80vw"
        style={{ top: 20 }}
        styles={{ body: { padding: 0 } }} // ← исправлено
      >
        <div className="modal-carousel">
          <img
            src={`http://localhost:5100${images[currentIndex].url}`}
            alt={`${propertyTitle} - ${currentIndex + 1}`}
            style={{ width: '100%', height: 'auto' }}
          />
          
          {images.length > 1 && (
            <>
              <Button 
                className="modal-carousel-btn prev-btn"
                icon={<LeftOutlined />}
                onClick={prevImage}
              />
              <Button 
                className="modal-carousel-btn next-btn"
                icon={<RightOutlined />}
                onClick={nextImage}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};