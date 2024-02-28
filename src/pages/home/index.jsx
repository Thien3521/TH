import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLoggedInInstance } from "../../utils/api";
import { userContext } from "../../contexts/userContext";
const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { setUser, user } = useContext(userContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      apiLoggedInInstance({
        url: "/api/auth/user-info",
        method: "GET",
      }).then((response) => {
        if (response?.data) {
          setUser(response?.data);
        } else {
          navigate("/login");
        }
      });
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        username: {user?.username}
      </button>
      <div>{token ? "Đã đăng nhập" : "Chưa đăng nhập"}</div>
    </div>
  );
};

export default Home;
