import React, { useEffect, useState } from "react";
import { apiLoggedInInstance } from "../../../utils/api";
import { Button, Popover, Table, Input } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Modal from "../../../components/Modal";
import FormDelete from "../../../components/FormDelete";
import moment from "moment";
import TopicForm from "./TopicForm";

const TopicContainer = () => {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [record, setRecord] = useState();

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

  const handleSearch = (value, dataIndex) => {
    const filtered = data.filter((record) =>
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        ?.includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const onCloseModalUpdate = () => {
    setShowModalUpdate(false);
  };

  const handleUpdate = async (values) => {
    await apiLoggedInInstance({
      url: `/api/topic/${record.id}`,
      method: "PUT",
      data: values,
    });

    setShowModalUpdate(false);
    fetchData();
  };

  const handleDelete = async () => {
    await apiLoggedInInstance({
      url: `/api/topic/${record.id}`,
      method: "DELETE",
    });

    setShowModalDelete(false);
    fetchData();
  };

  const handleCancel = () => {
    setShowModalUpdate(false);
    setShowModalDelete(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "(*)",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Popover
            placement="right"
            content={
              <div>
                <Button
                  onClick={() => {
                    setRecord(record);
                    setShowModalUpdate(true);
                  }}
                  icon={<EditOutlined />}
                  className="mr-2"
                ></Button>
                <Button
                  onClick={() => {
                    setRecord(record);
                    setShowModalDelete(true);
                  }}
                  icon={<DeleteOutlined />}
                ></Button>
              </div>
            }
            trigger="click"
          >
            <Button icon={<SettingOutlined />} />
          </Popover>
        </span>
      ),
    },
    {
      title: "Tên đề tài",
      dataIndex: "name",
      key: "name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys[0], "name")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            onClick={() => handleSearch(selectedKeys[0], "name")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleSearch("", "name");
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search description"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys[0], "description")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            onClick={() => handleSearch(selectedKeys[0], "description")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleSearch("", "description");
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (record.isDraft) return "Nháp";
        if (record.isApply) return "Áp dụng";
        else return "Xét duyệt";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) =>
        moment(new Date(record.createdAt), "DD/MM/YYYY").format("DD/MM/YY"),
    },
  ];

  return (
    <>
      <Table dataSource={filteredData} columns={columns} />

      {showModalUpdate && (
        <Modal
          title="Thêm Đề Tài"
          onClose={() => {
            onCloseModalUpdate();
          }}
        >
          <hr />
          <TopicForm
            onCancel={handleCancel}
            onFinish={handleUpdate}
            initialValues={record}
          />
        </Modal>
      )}

      {showModalDelete && (
        <Modal
          title="Sửa đề tài"
          onClose={() => {
            onCloseModalUpdate();
          }}
        >
          <hr />
          <FormDelete onOK={handleDelete} onCancel={handleCancel} />
        </Modal>
      )}
    </>
  );
};

export default TopicContainer;
