'use client';
import { Modal } from 'antd';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactsModal = ({ isOpen, onClose }: ContactsModalProps) => {
  return (
    <Modal
      title="Мои контакты"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      className="contacts-modal"
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px', color: 'var(--color-dark)' }}>
            Чернова Алина
          </h3>
          <p style={{ color: 'var(--color-dark-gray)', margin: 0 }}>
            Семейный риелтор во Владимире
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'var(--color-light-gray)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              📍
            </div>
            <div>
              <strong>Адрес офиса:</strong>
              <br />
              г. Владимир, Проспект Ленина 48, офис 301
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'var(--color-light-gray)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              📞
            </div>
            <div>
              <strong>Телефон:</strong>
              <br />
              <a href="tel:+79157700523" style={{ color: 'var(--color-dark)', textDecoration: 'none' }}>
                +7 (915) 770-05-23
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'var(--color-light-gray)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ✉️
            </div>
            <div>
              <strong>Email:</strong>
              <br />
              <a href="mailto:chernova@33vladis.ru" style={{ color: 'var(--color-dark)', textDecoration: 'none' }}>
                chernova@33vladis.ru
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'var(--color-light-gray)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🕒
            </div>
            <div>
              <strong>Время работы:</strong>
              <br />
              Пн-Пт: 9:00 - 21:00
              <br />
              Сб-Вс: 10:00 - 17:00
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: 'var(--color-light-gray)', 
          borderRadius: 'var(--border-radius)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Работаю по всему Владимиру и области</strong>
            <br />
            Бесплатная консультация при первой встрече!
          </p>
        </div>
      </div>
    </Modal>
  );
};