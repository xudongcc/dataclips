import { FC, useState, useMemo, useCallback, useEffect } from "react";
import { Layout, Menu, Image, Row, Col, Popover, Avatar, Button } from "antd";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Loading } from "../../components/common/Loading";
import { routes } from "../../router";
import NextLink from "next/link";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ProjectLayout: FC = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  // 侧边栏收起状态
  const [collapsed, setCollapsed] = useState(false);

  const siderBarWidth = useMemo(() => {
    return collapsed ? 80 : 200;
  }, [collapsed]);

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
    <Layout hasSider style={{ minHeight: "100%" }}>
      <nav style={{ width: siderBarWidth }} />
      <Sider
        collapsible
        style={{
          width: siderBarWidth,
          position: "fixed",
          left: "0",
          top: 0,
          zIndex: 100,
          bottom: 0,
        }}
        breakpoint="md"
        collapsed={collapsed}
        onCollapse={(state) => {
          setCollapsed(state);
        }}
      >
        <Header
          style={{
            display: "flex",
            paddingLeft: 24,
            alignItems: "center",
            background: "#fff",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            padding: 0,
          }}
        />

        <Menu
          mode="inline"
          style={{ height: "100%" }}
          selectedKeys={[
            routes.find((item) => router.asPath.includes(item.path))?.name,
          ]}
        >
          {routes.map((route) => {
            if (route.children?.length) {
              return (
                // 待优化，children
                <SubMenu title={route.name}>
                  {route?.children?.map((menu) => (
                    <Menu.Item key={menu.name}>
                      <NextLink href={menu.path}>{route.name}</NextLink>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item icon={route?.icon} key={route.name}>
                  <NextLink href={route.path}>{route.name}</NextLink>
                </Menu.Item>
              );
            }
          })}
        </Menu>
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
          {/* 头像 */}
          <Row justify="space-between">
            <Col style={{ display: "flex", alignItems: "center" }}>
              <Image
                onClick={() => {
                  setCollapsed(false);
                }}
                style={{ cursor: "pointer" }}
                src="/dataclip.png"
                width={32}
                preview={false}
                alt="data-clip"
              />
            </Col>

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
  );
};

export default ProjectLayout;
