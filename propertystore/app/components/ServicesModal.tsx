'use client';
import { Modal, Button } from 'antd';
import { ConsultationForm } from './ConsultationForm';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServicesModal = ({ isOpen, onClose }: ServicesModalProps) => {
  const services = [
    {
      title: "Покупка недвижимости",
      description: "Подбор оптимальных вариантов, организация просмотров, проверка юридической чистоты, сопровождение сделки",
      icon: "🏠"
    },
    {
      title: "Продажа недвижимости",
      description: "Оценка стоимости, профессиональная фотосъемка, реклама на всех площадках, переговоры с покупателями",
      icon: "💰"
    },
    {
      title: "Аренда",
      description: "Подбор арендодателей или арендаторов, подготовка договоров, юридическое сопровождение",
      icon: "🔑"
    },
    {
      title: "Инвестиции в недвижимость",
      description: "Анализ рынка, подбор доходных объектов, расчет рентабельности, управление объектами",
      icon: "📈"
    },
    {
      title: "Юридическое сопровождение",
      description: "Проверка документов, подготовка договоров, регистрация сделок в Росреестре",
      icon: "⚖️"
    },
    {
      title: "Консультации",
      description: "Профессиональные консультации по всем вопросам недвижимости, рынка и законодательства",
      icon: "💬"
    }
  ];

  return (
    <Modal
      title="Мои услуги"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      className="services-modal"
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {services.map((service, index) => (
            <div 
              key={index}
              style={{
                padding: '20px',
                border: '1px solid var(--color-light-gray)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                {service.icon}
              </div>
              <h4 style={{ 
                margin: '0 0 10px 0', 
                fontSize: '18px',
                color: 'var(--color-dark)'
              }}>
                {service.title}
              </h4>
              <p style={{ 
                margin: 0,
                fontSize: '14px',
                color: 'var(--color-dark-gray)',
                lineHeight: '1.5'
              }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-light-gray)', paddingTop: '30px' }}>
          <h4 style={{ marginBottom: '20px' }}>Выберите способ связи</h4>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ConsultationForm />
            <Button 
              className="button transparent"
              href="tel:+79157700523"
              style={{ height: '50px' }}
            >
              📞 Позвонить
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};