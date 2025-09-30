'use client';
import Link from 'next/link';

export function CustomFooter() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-main-inner container">
          <header className="footer-header">
            <Link href="/" className="footer-logo">
              <img 
                className="footer-logo-image"
                src="/images/logo12.png"
                alt="Alina-logo"
                width="300" height="50" loading="lazy"
              />
            </Link>
            <p className="footer-description section-description">
              Пожалуйста, не стесняйтесь обращаться ко мне по электронной почте по адресу{' '}
              <a href="mailto:chernova@33vladis.ru">chernova@33vladis.ru</a>
            </p>    
          </header>
          <div className="footer-body">
            <div className="footer-column">
              <h2 className="footer-column-title">Услуги</h2>
              <p className="footer-about">
                - Помощь в продаже недвижимости <br />
                - Помощь в покупке недвижимости <br />
                - Помощь в аренде недвижимости <br />
                - Юридическое сопровождение сделки <br />                            
              </p>
            </div>
            <div className="footer-column">
              <h2 className="footer-column-title">Время работы</h2>
              <div className="footer-shedule">
                Понедельник - Пятница <br />
                <time dateTime="09:00/21:00">09:00 - 21:00</time>
              </div>
              <div className="footer-shedule">
                Выходные дни <br />
                <time dateTime="10:00/17:00">10:00 - 17:00</time>
              </div>
            </div>
            <div className="footer-column">
              <h2 className="footer-column-title">Адрес офиса и контакты</h2>
              <address className="footer-address">
                Адрес офиса: г. Владимир,<br />
                Проспект Ленина 48, офис 301
              </address>
              <div className="footer-contacts">
                <ul className="footer-contacts-list">
                  <li className="footer-contacts-item">
                    <a className="footer-contacts-link" href="mailto:chernova@33vladis.ru">
                      chernova@33vladis.ru
                    </a>
                  </li>
                  <li className="footer-contacts-item">
                    <a className="footer-contacts-link" href="tel:+79157700523">
                      +7-(915)-770-05-23
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-column">
              <h2 className="footer-column-title">Социальные сети</h2>
              <div className="footer-soc1als">
                <ul className="footer-soc1als-list">
                  <li className="footer-soc1als-item">
                    <a className="footer-soc1als-link" href="/" target="_blank" rel="noopener noreferrer">
                      <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                        <path d="M15.07294,2H8.9375C3.33331,2,2,3.33331,2,8.92706V15.0625C2,20.66663,3.32294,22,8.92706,22H15.0625C20.66669,22,22,20.67706,22,15.07288V8.9375C22,3.33331,20.67706,2,15.07294,2Zm3.07287,14.27081H16.6875c-.55206,0-.71875-.44793-1.70831-1.4375-.86463-.83331-1.22919-.9375-1.44794-.9375-.30206,0-.38544.08332-.38544.5v1.3125c0,.35419-.11456.5625-1.04162.5625a5.69214,5.69214,0,0,1-4.44794-2.66668A11.62611,11.62611,0,0,1,5.35419,8.77081c0-.21875.08331-.41668.5-.41668H7.3125c.375,0,.51044.16668.65625.55212.70831,2.08331,1.91669,3.89581,2.40625,3.89581.1875,0,.27081-.08331.27081-.55206V10.10413c-.0625-.97913-.58331-1.0625-.58331-1.41663a.36008.36008,0,0,1,.375-.33337h2.29169c.3125,0,.41662.15625.41662.53125v2.89587c0,.3125.13544.41663.22919.41663.1875,0,.33331-.10413.67706-.44788a11.99877,11.99877,0,0,0,1.79169-2.97919.62818.62818,0,0,1,.63544-.41668H17.9375c.4375,0,.53125.21875.4375.53125A18.20507,18.20507,0,0,1,16.41669,12.25c-.15625.23956-.21875.36456,0,.64581.14581.21875.65625.64582,1,1.05207a6.48553,6.48553,0,0,1,1.22912,1.70837C18.77081,16.0625,18.5625,16.27081,18.14581,16.27081Z"/>
                      </svg>
                    </a>
                  </li>
                  <li className="footer-soc1als-item">
                    <a className="footer-soc1als-link" href="/" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2629 9.3444 8.93015 10.3492 5.43191 11.8733C4.86385 12.0992 4.56628 12.3202 4.53919 12.5363C4.4934 12.9015 4.95073 13.0453 5.57349 13.2411C5.6582 13.2678 5.74598 13.2954 5.83596 13.3246C6.44866 13.5238 7.27284 13.7568 7.70131 13.766C8.08996 13.7744 8.52375 13.6142 9.00266 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.1391 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.3761 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5034 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78393 14.6448 10.8036 15.3168C11.2937 15.6397 11.6858 15.9067 12.077 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2078 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8308 18.0694 15.3826 18.0186C15.7033 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6632 17.3816 10.0585 17.5622 8.16098C17.5781 7.99473 17.5582 7.78197 17.5422 7.68858C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0057 7.22234 16.9064 7.22408C16.455 7.23204 15.7626 7.47282 12.43 8.85893Z"/>
                      </svg>                                    
                    </a>
                  </li>
                  <li className="footer-soc1als-item">
                    <a className="footer-soc1als-link" href="/" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM12 15.88C9.86 15.88 8.12 14.14 8.12 12C8.12 9.86 9.86 8.12 12 8.12C14.14 8.12 15.88 9.86 15.88 12C15.88 14.14 14.14 15.88 12 15.88ZM17.92 6.88C17.87 7 17.8 7.11 17.71 7.21C17.61 7.3 17.5 7.37 17.38 7.42C17.26 7.47 17.13 7.5 17 7.5C16.73 7.5 16.48 7.4 16.29 7.21C16.2 7.11 16.13 7 16.08 6.88C16.03 6.76 16 6.63 16 6.5C16 6.37 16.03 6.24 16.08 6.12C16.13 5.99 16.2 5.89 16.29 5.79C16.52 5.56 16.87 5.45 17.19 5.52C17.26 5.53 17.32 5.55 17.38 5.58C17.44 5.6 17.5 5.63 17.56 5.67C17.61 5.7 17.66 5.75 17.71 5.79C17.8 5.89 17.87 5.99 17.92 6.12C17.97 6.24 18 6.37 18 6.5C18 6.63 17.97 6.76 17.92 6.88Z"/>
                      </svg>                                    
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Нижняя часть футера */}
      <div className="footer-extra">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="footer-copyright">
            © 2024 Риелтор Алина Чернова. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}