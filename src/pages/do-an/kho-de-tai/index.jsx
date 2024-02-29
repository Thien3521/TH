import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { apiLoggedInInstance } from "../../../utils/api";
import { Tabs } from "antd";
import TopicContainer from "./topic";

const DeTaiContainer = () => {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [showModalCreate, setShowModalCreate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiLoggedInInstance({
        url: "/api/topic",
        method: "GET",
      });
      setData(response.data);
      setFilteredData(response.data); // Set dữ liệu lọc mặc định khi lấy dữ liệu
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <div className="w-full flex justify-between items-center py-3 px-10 shadow-md">
        <h2>Kho đề tài ({data?.length || 0})</h2>

        <Button
          type="default"
          onClick={() => {
            setShowModalCreate(true);
          }}
          className="flex items-center"
        >
          <PlusOutlined />
          Thêm đề tài
        </Button>
      </div>
      <div className="p-5">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: "Kho",
              key: "1",
              children: <TopicContainer />,
            },
            {
              label: "Đề tài theo năm",
              key: "2",
              children: <TopicContainer />,
            },
            {
              label: "Thống kê",
              key: "3",
              children: <TopicContainer />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default DeTaiContainer;
