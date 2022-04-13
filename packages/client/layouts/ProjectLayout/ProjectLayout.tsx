import { FC, useState, useMemo, useCallback, useEffect } from "react";
import {
  Layout,
  Menu,
  Image,
  Row,
  Col,
  Popover,
  Avatar,
  Button,
  Drawer,
} from "antd";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Loading } from "../../components/common/Loading";
import { routes } from "../../router";
import NextLink from "next/link";
import { LeftOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ProjectLayout: FC = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  // 侧边栏收起状态
  const [collapsed, setCollapsed] = useState(false);

  // 移动端路由抽屉收起状态
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);

  // 侧边栏占位宽度
  const siderBarWidth = useMemo(() => {
    return collapsed ? 0 : 200;
  }, [collapsed]);

  // 路由菜单项
  const getSubMenus = useCallback(
    (routes) => {
      return routes.map((route) => {
        if (route.children?.length) {
          return (
            <SubMenu key={route.name} title={route.name}>
              {getSubMenus(route.children)}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={route.name}
              icon={route?.icon}
              onClick={() => {
                if (menuDrawerVisible) {
                  setMenuDrawerVisible(false);
                }
              }}
            >
              <NextLink href={route.path}>{route.name}</NextLink>
            </Menu.Item>
          );
        }
      });
    },
    [menuDrawerVisible]
  );

  // 登录退出
  const handleLogout = useCallback(() => {
    signOut();
    router.push("/login");
  }, [router]);

  // 验证登录态
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  if (session.status !== "authenticated") {
    return <Loading />;
  }

  return (
    <>
      <Layout hasSider style={{ minHeight: "100%" }}>
        <nav style={{ width: siderBarWidth }} />
        <Sider
          collapsedWidth={0}
          style={{
            width: siderBarWidth,
            position: "fixed",
            left: "0",
            top: 0,
            zIndex: 100,
            bottom: 0,
          }}
          zeroWidthTriggerStyle={{
            display: "none",
          }}
          collapsible
          breakpoint="md"
          collapsed={collapsed}
          onCollapse={(state) => {
            setMenuDrawerVisible(false);
            setCollapsed(state);
          }}
        >
          <Header
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          />

          <div
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            <Menu
              mode="inline"
              style={{
                height: "100%",
              }}
              selectedKeys={[
                routes.find((item) => router.asPath.includes(item.path))?.name,
              ]}
            >
              {getSubMenus(routes)}
            </Menu>

            <Row
              style={{
                position: "absolute",
                bottom: 64,
                height: 48,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                setCollapsed(true);
              }}
            >
              <LeftOutlined />
            </Row>
          </div>
        </Sider>

        <Layout
          style={{
            position: "relative",
            minHeight: "100vh",
          }}
        >
          <header style={{ height: 64 }} />
          <Header
            style={{
              background: "#fff",
              position: "fixed",
              padding: "0 24px",
              top: "0px",
              zIndex: 101,
              width: "100%",
              right: 0,
              height: 64,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Row justify="space-between">
              {/* logo */}
              <Col style={{ display: "flex", alignItems: "center" }}>
                {collapsed ? (
                  <MenuUnfoldOutlined
                    style={{ fontSize: 18, cursor: "pointer" }}
                    onClick={() => {
                      if (
                        window.document.body.clientWidth <= 768 &&
                        collapsed
                      ) {
                        setMenuDrawerVisible(true);
                      } else {
                        setCollapsed(false);
                      }
                    }}
                  />
                ) : (
                  <Image
                    onClick={() => {
                      if (
                        window.document.body.clientWidth <= 768 &&
                        collapsed
                      ) {
                        setMenuDrawerVisible(true);
                      } else {
                        setCollapsed(false);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    src="/dataclip.png"
                    width={32}
                    preview={false}
                    alt="data-clip"
                  />
                )}
              </Col>

              {/* 头像 */}
              <Col>
                <Popover
                  content={
                    <Button type="text" onClick={handleLogout}>
                      退出登录
                    </Button>
                  }
                  placement="bottomLeft"
                  trigger="click"
                >
                  <Avatar
                    size={32}
                    style={{ cursor: "pointer" }}
                    src={session.data?.user?.image}
                  />
                </Popover>
              </Col>
            </Row>
          </Header>

          <Content
            style={{
              margin: 24,
              transition: "all linear",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      {/* 移动端抽屉 */}
      <Drawer
        width={200}
        closable={false}
        placement="left"
        visible={collapsed && menuDrawerVisible}
        onClose={() => {
          setMenuDrawerVisible(false);
        }}
      >
        <Menu
          mode="inline"
          style={{ height: "100%", borderRightWidth: 0 }}
          selectedKeys={[
            routes.find((item) => router.asPath.includes(item.path))?.name,
          ]}
        >
          {getSubMenus(routes)}
        </Menu>
      </Drawer>
    </>
  );
};

export default ProjectLayout;
