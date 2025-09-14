import Layout, { Content, Footer, Header } from "antd/es/layout/layout";
import "./globals.css";
import { Menu } from "antd";
import Link from "next/link";

const items = [
  {key: "home", label: <Link href={"/"}>Главная страница</Link>}, 
  {key: "properties", label: <Link href={"/properties"}>Объекты недвижимости</Link>},
  {key: "clients", label: <Link href={"/clients"}>Клиенты</Link>}
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout style={{minHeight:"100vh"}}>
          <Header>
              <Menu 
                  theme="dark" 
                  mode="horizontal" 
                  items = {items} 
                  style={{flex: 1, minWidth: 0}}
              />
          </Header>
          <Content style={{padding: "0 48px"}}>{children}</Content>
          <Footer style={{textAlign: "center" }}>
              This is property store
          </Footer>
          
          </Layout>        
      </body>
    </html>
  );
}
