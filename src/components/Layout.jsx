import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../contexts/userContext";
import styles from "./Layout.module.css";
import { BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
const Layout = () => {
  const navigate = useNavigate();
  const { handleLogout } = useContext(userContext);
  const { pathname } = useLocation();

  const menus = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/quan-tri-thanh-vien",
      name: "Quản trị thành viên",
    },
    {
      path: "/danh-muc",
      name: "Danh mục",
      child: [
        {
          path: "/nganh-nghe",
          name: "Ngành nghề",
        },
        {
          path: "/khoa",
          name: "Khóa",
        },
        {
          path: "/lop",
          name: "Lớp",
        },
      ],
    },
    {
      path: "/do-an",
      name: "Đồ án",
      child: [
        {
          path: "/quan-ly-dot",
          name: "Quản lý đợt",
        },
        {
          path: "/kho-de-tai",
          name: "Kho đề tài",
        },
      ],
    },
  ];
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.sideBar} p-8`}>
        {menus.map((menu, index) => (
          <MenuItem
            path={menu.path}
            name={menu.name}
            child={menu.child}
            key={index}
          />
        ))}
      </div>
      <div className={`${styles.rightContent}`}>
        <div className={`${styles.header} flex justify-between`}>
          <h1 className="font-bold">TRƯỜNG ĐẠI HỌC</h1>
          <div className="text-xl text-center flex mr-5">
            <BellOutlined className="mr-5" />
            <Popover
              content={
                <div>
                  <Button
                    type="text"
                    onClick={() => {
                      handleLogout();
                      navigate("/login");
                    }}
                    icon={<LogoutOutlined />}
                  >
                    Logout
                  </Button>
                </div>
              }
              trigger="click"
            >
              <UserOutlined />
            </Popover>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

const MenuItem = ({ path, name, child }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (!child) {
    return (
      <Link to={path}>
        <div className={pathname === path ? styles.active : null}>{name}</div>
      </Link>
    );
  }

  return (
    <div>
      <div
        className={pathname.includes(path) ? styles.active : null}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {name}
      </div>
      <div className="pl-5">
        {open &&
          child.map((item, index) => (
            <Link to={`${path}${item.path}`} key={index}>
              <div
                className={pathname.includes(item.path) ? styles.active : null}
              >
                {item.name}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Layout;
