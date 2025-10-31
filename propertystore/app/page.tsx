"use client";
import { useEffect, useState } from "react";
import { ConsultationForm } from "./components/ConsultationForm"; 
import Link from "next/link";
import { DealStagesModal } from "./components/DealStagesModal";
import { Button, Dropdown, Space } from "antd";
import { UserOutlined, LoginOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

export default function Home() {
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false);
  const router = useRouter();

  const authMenuItems = [
    {
      key: 'realtor',
      icon: <UserOutlined />,
      label: 'Вход для риелтора',
      onClick: () => router.push('/login')
    },
    {
      key: 'client',
      icon: <TeamOutlined />,
      label: 'Личный кабинет клиента',
      onClick: () => router.push('/client/login')
    }
  ];
  return (
    <div>
      {/* Баннер секция */}
      <section className="banner">
        <div className="banner-body">
          <div className="banner-info">
            Продажа любых объектов недвижимости<br />
            Опыт работы с 2013 года.
          </div>
          <h3 className="banner-title">риелтор Чернова Алина</h3>
          
        </div>
      </section>

      {/* Быстрая консультация */}
      <section className="quick-contact">
        <div className="container">
          <div className="quick-contact-form">
            <div className="quick-contact-form-body">
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Мотивационные блоки */}
      <section className="motivation">
        <ul className="motivation-list">
          <li className="motivation-item">
            <div className="motivation-card container">
              <div className="motivation-card-body">
                <h3 
                  className="motivation-card-title backdrop-title title-medium"
                  data-title="Надежность"
                >
                  Рада приветствовать вас на своем сайте!
                </h3>
                <div className="motivation-card-description">
                  <p>
                    Меня зовут Алина и я являюсь успешным семейным риелтором в городе Владимире.<br />
                    Абсолютно все мои клиенты остаются довольны моей работой. <br />
                    Все сделки, которые я сопровождаю проходят несколько этапов юридической проверки.
                  </p>
                </div>
                <button 
                  className="motivation-card-button button transparent"
                  onClick={() => setIsStagesModalOpen(true)}
                >
                  Этапы
                </button>
              </div>
              <img 
                className="motivation-card-image"
                src="/images/motivation/img1.jpg" 
                alt="риелтор Алина" 
                width="518" height="778" loading="lazy"
              />
            </div>
          </li>
          
          <li className="motivation-item">
            <div className="motivation-card container">
              <div className="motivation-card-body">
                <h3 
                  className="motivation-card-title backdrop-title title-medium"
                  data-title="Выгода"
                >
                  Сейчас лучший момент воспользоваться моими услугами!
                </h3>
                <div className="motivation-card-description">
                  <p>
                    Я помогаю своим клиентам покупать недвижимость не только для жизни, 
                    но и для инвестирования!
                  </p>
                </div>
                <Link href="/properties?type=invest">
                  <button className="motivation-card-button button transparent">
                    Инвест объекты
                  </button>
                </Link>
              </div>
              <img 
                className="motivation-card-image"
                src="/images/motivation/img2.jpg" 
                alt="успешный риелтор Алина" 
                width="508" height="650" loading="lazy"
              />
            </div>
          </li>
        </ul>
      </section>

      {/* Типы недвижимости */}
      <section className="abilities-types">
        <ul className="abilities-types-list">
          <li className="abilities-types-items">
            <Link href="/properties?type=novostroyki">
              <img 
                className="abilities-types-image"
                src="/images/novostr.svg"
                alt="Новостройки"
                width="150" height="140" loading="lazy"
              />                                    
            </Link>  
            <h3 className="abilities-types-items-title">Новостройки</h3>                  
          </li>
          
          <li className="abilities-types-items">
            <Link href="/properties?type=secondary">
              <img 
                className="abilities-types-image"
                src="/images/vtorichka.svg"
                alt="Вторичная недвижимость"
                width="150" height="140" loading="lazy"
              />
            </Link>                                
            <h3 className="abilities-types-items-title">Вторичная недвижимость</h3>
          </li>
          
          <li className="abilities-types-items">
            <Link href="/properties?type=countryside">
              <img 
                className="abilities-types-image"
                src="/images/zagorodka.svg"
                alt="Загородная недвижимость"
                width="150" height="140" loading="lazy"
              />
            </Link>                                
            <h3 className="abilities-types-items-title">Загородная недвижимость</h3>
          </li>
          
          <li className="abilities-types-items">
            <Link href="/properties?type=rent">
              <img 
                className="abilities-types-image"
                src="/images/arenda.svg"
                alt="Аренда"
                width="150" height="140" loading="lazy"
              /> 
            </Link>                                
            <h3 className="abilities-types-items-title">Аренда</h3>
          </li>
        </ul>
      </section>

      {/* Форма заявки */}
      <section className="join-us">
        <div className="join-us-img-wrapper">
          <img 
            className="join-us-img" 
            src="/images/motivation/img7.jpeg"
            alt="Консультация"
            width="450" height="725"
          />
        </div>
        <div className="join-us-body container">
          <h2 className="join-us-title">спешите</h2>
          <div className="join-us-form">
            <header className="join-us-form-header">
              <h3 
                className="motivation-card-title backdrop-title title-medium"
                data-title="Действуйте"
              >
                Оставьте заявку прямо сейчас
              </h3>
              <div className="join-us-form-subtitle" style={{ textAlign: 'center', marginBottom: '30px' }}>
                Заполните форму сегодня и я продам вашу недвижимость завтра
              </div>
            </header>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно этапов сделки */}
      <DealStagesModal 
        isOpen={isStagesModalOpen}
        onClose={() => setIsStagesModalOpen(false)}
      />
    </div>
  );
}