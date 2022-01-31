import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  OrderedListOutlined,
  UserOutlined,
  PieChartOutlined,
  ApartmentOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { createElement, ReactNode, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const { Header, Sider, Content } = Layout;

type SidebarProps = {
  children: ReactNode;
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        style={{ minHeight: "100vh" }}
        collapsible
        collapsed={collapsed}
      >
        {collapsed ? (
          <div
            className="logo"
            style={{
              height: 60,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            L<span style={{ fontSize: "1.5rem", color: "lightblue" }}>.</span>
          </div>
        ) : (
          <div
            className="logo"
            style={{
              height: 60,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            Logo
            <span style={{ fontSize: "1.5rem", color: "lightblue" }}>.</span>
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[router.asPath]}
          defaultOpenKeys={[router.asPath.split("/")[1]]}
        >
          <Menu.Item key="/" icon={<PieChartOutlined />}>
            <Link href="/" passHref>
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            key="assets"
            icon={<OrderedListOutlined />}
            title="Assets"
          >
            <Menu.Item key="/assets">
              <Link href="/assets" passHref>
                List
              </Link>
            </Menu.Item>
            <Menu.Item key="/assets/create">
              <Link href="/assets/create" passHref>
                Create
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="companies"
            icon={<ApartmentOutlined />}
            title="Companies"
          >
            <Menu.Item key="/companies">
              <Link href="/companies" passHref>
                List
              </Link>
            </Menu.Item>
            <Menu.Item key="/companies/create">
              <Link href="/companies/create" passHref>
                Create
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="units" icon={<BarsOutlined />} title="Units">
            <Menu.Item key="/units">
              <Link href="/units" passHref>
                List
              </Link>
            </Menu.Item>
            <Menu.Item key="/units/create">
              <Link href="/units/create" passHref>
                Create
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="users" icon={<UserOutlined />} title="Users">
            <Menu.Item key="/users">
              <Link href="/users" passHref>
                List
              </Link>
            </Menu.Item>
            <Menu.Item key="/users/create">
              <Link href="/users/create" passHref>
                Create
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ paddingLeft: 20 }}>
          {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: toggle,
          })}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
