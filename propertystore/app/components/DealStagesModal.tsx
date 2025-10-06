'use client';
import { Modal } from 'antd';

interface DealStagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DealStagesModal = ({ isOpen, onClose }: DealStagesModalProps) => {
  const stages = [
    {
      stage: 1,
      title: "Консультация и анализ",
      description: "Знакомство, анализ ваших потребностей и возможностей, консультация по рынку недвижимости",
      duration: "1-2 дня"
    },
    {
      stage: 2,
      title: "Подбор объектов",
      description: "Поиск и подбор подходящих вариантов, организация просмотров, анализ преимуществ и недостатков",
      duration: "3-7 дней"
    },
    {
      stage: 3,
      title: "Юридическая проверка",
      description: "Тщательная проверка документов на объект, анализ юридической чистоты, выявление возможных рисков",
      duration: "2-3 дня"
    },
    {
      stage: 4,
      title: "Переговоры и согласование",
      description: "Переговоры с продавцом/покупателем, согласование цены и условий сделки, подготовка предварительного договора",
      duration: "3-5 дней"
    },
    {
      stage: 5,
      title: "Оформление сделки",
      description: "Подготовка полного пакета документов, сопровождение в банке (при ипотеке), регистрация в Росреестре",
      duration: "5-7 дней"
    },
    {
      stage: 6,
      title: "Передача объекта",
      description: "Подписание акта приема-передачи, расчеты между сторонами, вручение ключей",
      duration: "1 день"
    },
    {
      stage: 7,
      title: "Постпродажное обслуживание",
      description: "Консультации после сделки, помощь в решении возникающих вопросов, поддержка клиента",
      duration: "бессрочно"
    }
  ];

  return (
    <Modal
      title="Этапы сделки с недвижимостью"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      className="deal-stages-modal"
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: 'var(--color-dark-gray)' }}>
            Каждая сделка проходит несколько этапов юридической проверки и сопровождения
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {stages.map((stage) => (
            <div 
              key={stage.stage}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                border: '1px solid var(--color-light-gray)',
                borderRadius: 'var(--border-radius)',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--color-dark-gray)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {stage.stage}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px',
                  color: 'var(--color-dark)'
                }}>
                  {stage.title}
                </h4>
                <p style={{ 
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: 'var(--color-dark-gray)',
                  lineHeight: '1.5'
                }}>
                  {stage.description}
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: 'var(--color-light-gray)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  ⏱️ {stage.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: 'var(--color-light-gray)', 
          borderRadius: 'var(--border-radius)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Гарантия юридической чистоты всех сделок!</strong>
            <br />
            Опыт работы с 2013 года • 100% успешных сделок • Полное сопровождение
          </p>
        </div>
      </div>
    </Modal>
  );
};