import { FC, useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Layout,
  Menu,
  Image,
  Row,
  Col,
  Popover,
  Avatar,
  Button,
  Typography,
  Drawer,
} from "antd";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Loading } from "../../components/common/Loading";
import { ItemsProps, RouterProps, routes } from "../../router";
import NextLink from "next/link";
import { LeftOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLocalStorage } from "react-use";
import { SystemThemeContext } from "../../context";
const { Text } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ProjectLayout: FC = ({ children }) => {
  const router = useRouter();
  const session = useSession();
  const siderCollapsedRef = useRef(false);

  // 系统主题类型
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  // 侧边栏收起状态
  const [collapsed, setCollapsed] = useLocalStorage("collapsed", false);

  // 移动端路由抽屉收起状态
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);

  // 侧边栏占位宽度
  const siderBarWidth = useMemo(() => {
    return collapsed ? 0 : 200;
  }, [collapsed]);

  // 所有路由的 name, path 集合
  const routeNameCollection: { name: string; path: string }[] = useMemo(() => {
    const collection = [];

    const handleRoutes = (routes: (RouterProps | ItemsProps)[]) => {
      if (routes.length) {
        routes.forEach((route) => {
          if (route?.items?.length) {
            route.items.forEach((item) => {
              collection.push({ name: item?.name, path: item?.path });

              if (item?.items?.length) {
                handleRoutes(item?.items);
              }
            });
          }
        });
      }
    };

    if (routes.length) {
      handleRoutes(routes);
    }

    return collection;
  }, []);

  // 路由菜单项
  const getMenus = useCallback(
    (routes: RouterProps[], firstLevel: boolean) => {
      if (routes.length) {
        const getSubMenus = (subRoutes: RouterProps) => {
          return subRoutes.items.map((item) => {
            if (item?.items?.length) {
              return (
                <SubMenu key={item.name} title={item.name}>
                  {getMenus([{ items: item.items }], false)}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item
                  key={item.name}
                  icon={item?.icon}
                  onClick={() => {
                    if (menuDrawerVisible) {
                      setMenuDrawerVisible(false);
                    }
                  }}
                >
                  <NextLink href={item.path}>{item.name}</NextLink>
                </Menu.Item>
              );
            }
          });
        };

        return routes.map((route) => {
          if (firstLevel) {
            if (route?.items?.length) {
              return (
                <>
                  {route?.title && (
                    <Text
                      style={{
                        paddingLeft: 24,
                        margin: "24px 0",
                        display: "block",
                      }}
                      type="secondary"
                    >
                      {route?.title}
                    </Text>
                  )}

                  {getSubMenus(route)}
                </>
              );
            }
          } else {
            return getSubMenus(route);
          }
        });
      }

      return [];
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

  // 监听系统主题色变化
  useEffect(() => {
    const handleSystemThemeChange = (e) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleSystemThemeChange);

    () => {
      return window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleSystemThemeChange);
    };
  }, [setSystemTheme]);

  // 主题初始化判断
  useEffect(() => {
    setSystemTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  }, [setSystemTheme]);

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
            // 忽略侧边栏第一次断点检查
            if (!siderCollapsedRef.current) {
              siderCollapsedRef.current = true;
            } else {
              setMenuDrawerVisible(false);
              setCollapsed(state);
            }
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
              overflowY: "auto",
              background: systemTheme === "light" ? "#fff" : "#141414",
            }}
          >
            <div
              style={{
                height: "calc(100% - 112px)",
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              <Menu
                mode="inline"
                style={{
                  height: "100%",
                }}
                selectedKeys={[
                  routeNameCollection.find((item) =>
                    router.asPath.includes(item.path)
                  )?.name,
                ]}
              >
                {getMenus(routes, true)}
              </Menu>
            </div>

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
                color: systemTheme === "dark" ? "#fff" : undefined,
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
              background: systemTheme === "light" ? "#fff" : "#141414",
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

          <SystemThemeContext.Provider value={systemTheme}>
            <Content
              style={{
                margin: 24,
                transition: "all linear",
              }}
            >
              {children}
            </Content>
          </SystemThemeContext.Provider>
        </Layout>
      </Layout>

      {/* 移动端抽屉 */}
      <Drawer
        width={300}
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
            routeNameCollection.find((item) =>
              router.asPath.includes(item.path)
            )?.name,
          ]}
        >
          {getMenus(routes, true)}
        </Menu>
      </Drawer>
    </>
  );
};

export default ProjectLayout;
