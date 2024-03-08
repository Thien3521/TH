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
import NganhNgheForm from "./form";
import FormDelete from "../../../components/FormDelete";

const NganhNgheContainer = () => {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [record, setRecord] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiLoggedInInstance({
        url: "/api/field",
        method: "GET",
      });
      setData(response.data);
      // console.log(response.data);
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

  const onCloseModalCreate = () => {
    setShowModalCreate(false);
  };

  const onCloseModalUpdate = () => {
    setShowModalUpdate(false);
  };

  const handleUpdate = async (values) => {
    const { name, code } = values;
    await apiLoggedInInstance({
      url: `/api/field/${record.id}`,
      method: "PUT",
      params: {
        name,
        code,
      },
    });

    setShowModalUpdate(false);
    fetchData();
  };

  const handleCreate = async (values) => {
    const { name, code } = values;
    await apiLoggedInInstance({
      url: `/api/field`,
      method: "POST",
      params: {
        name,
        code,
      },
    });

    setShowModalCreate(false);
    fetchData();
  };

  const handleDelete = async () => {
    await apiLoggedInInstance({
      url: `/api/field/${record.id}`,
      method: "DELETE",
    });

    setShowModalDelete(false);
    fetchData();
  };

  const handleCancel = () => {
    setShowModalUpdate(false);
    setShowModalCreate(false);
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
      title: "Mã ngành nghề",
      dataIndex: "code",
      key: "code",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search mã"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys[0], "code")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            onClick={() => handleSearch(selectedKeys[0], "code")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleSearch("", "code");
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
        record.code.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Tên ngành nghề",
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
    },
  ];

  return (
    <>
      <div className="w-full flex justify-between items-center py-3 px-10 shadow-md">
        <h2>Ngành nghề ({data?.length || 0})</h2>

        <Button
          type="default"
          onClick={() => {
            setShowModalCreate(true);
          }}
          className="flex items-center"
        >
          <PlusOutlined />
          Thêm ngành nghề
        </Button>
      </div>
      <div className="p-5">
        <Table dataSource={filteredData} columns={columns} />
      </div>
      {showModalCreate && (
        <Modal
          title="Thêm ngành nghề"
          onClose={() => {
            onCloseModalCreate();
          }}
        >
          <hr />
          <NganhNgheForm onCancel={handleCancel} onFinish={handleCreate} />
        </Modal>
      )}

      {showModalUpdate && (
        <Modal
          title="Chỉnh sửa ngành nghề"
          onClose={() => {
            onCloseModalUpdate();
          }}
        >
          <hr />
          <NganhNgheForm
            initialValues={record}
            onCancel={handleCancel}
            onFinish={handleUpdate}
          />
        </Modal>
      )}

      {showModalDelete && (
        <Modal
          title="Xóa ngành nghề"
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

export default NganhNgheContainer;
