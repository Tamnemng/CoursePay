import { UserOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getStudentInfo } from "../data/studentData";
import { useEffect, useState } from "react";

const Nav = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentInfo().then((e) => {
      setUserInfo(e);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo.name);
    }
  }, [userInfo]);

  return (
    <div className="bg-blue-500 text-white/95 flex w-full justify-between p-2 gap-8">
      <div className="flex gap-2 justify-center mx-5">
        <UserOutlined />
        {loading ? "" : `${userInfo?.name} - ${userInfo.birthday}`}
      </div>
      <div
        role="button"
        className="mx-5 hover:text-white cursor-pointer flex gap-2 justify-center"
        onClick={() => {
          localStorage.setItem("isAuthenticated", "false");
          navigate("");
        }}
      >
        Đăng xuất
      </div>
    </div>
  );
};

export default Nav;
