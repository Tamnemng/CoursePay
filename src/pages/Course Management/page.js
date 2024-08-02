import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import React from "react";

const { Content, Sider } = Layout;
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(2).fill(null).map((_, j) => {
        const subKey = index * 2 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

const CoursesManagement = () => {
  return (
    <Layout className="flex flex-row h-screen w-ful">
      <div className="flex flex-col mt-5">
        <UserOutlined />
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
            }}
            items={items2}
          />
        </Sider>
        <Button
          className="w-full"
          type="primary"
          icon={<PoweroffOutlined />}
          //   loading={loadings[2]}
          //   onClick={() => enterLoading(2)}
        >
          Đăng xuất
        </Button>
      </div>
      <Content>
        <div className="bg-white h-full w-full p-8">content</div>
      </Content>
    </Layout>
  );
};

export default CoursesManagement;
