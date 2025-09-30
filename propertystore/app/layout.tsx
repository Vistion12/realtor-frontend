import { Content } from 'antd/es/layout/layout';
import { Providers } from './providers';
import { CustomHeader } from './components/CustomHeader';
import { CustomFooter } from './components/CustomFooter';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
            <CustomHeader />
            <Content style={{ flex: 1, padding: "0" }}>{children}</Content>
            <CustomFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}