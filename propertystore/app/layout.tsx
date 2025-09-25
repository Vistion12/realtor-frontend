import Layout, { Content, Footer, Header } from 'antd/es/layout/layout';
import { Providers } from './providers';
import { AppMenu } from './components/AppMenu';
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
          <Layout style={{minHeight:"100vh"}}>
            <Header>
              <AppMenu />
            </Header>
            <Content style={{padding: "0 48px"}}>{children}</Content>
            <Footer style={{textAlign: "center"}}>This is property store</Footer>
          </Layout>        
        </Providers>
      </body>
    </html>
  );
}