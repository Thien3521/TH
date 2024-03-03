import React, { useEffect, useRef, useState } from "react";
import { apiLoggedInInstance } from "../../utils/api";
import Modal from "../../components/Modal";
import { USER_TYPE } from "../../constants/userType";
import { Formik } from "formik";
import { Table, Input, Button, Popover } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import UserForm from "./UserForm";
import FormDelete from "../../components/FormDelete";
const { Search } = Input;

const QuanTriThanhVien = () => {
  // ref
  const inputFileRef = useRef();

  //state lưu data
  const [data, setData] = useState([]);
  const [totalUser, setTotalUser] = useState(0);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [showModalCreate, setShowModalCreate] = useState(false);
  // filter
  const [filterData, setFilterData] = useState({
    address: null,
    birthday_start: null,
    birthday_end: null,
    email: null,
  });
  // form
  const [step, setStep] = useState(1); // 1 - chọn vai trò, 2 - nhập thông tin
  const [role, setRole] = useState(USER_TYPE.MANAGER);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [record, setRecord] = useState();

  const searchUser = () => {
    apiLoggedInInstance({
      url: "/api/admin/user",
      params: {
        page_index: pageIndex,
        page_size: pageSize,
        ...filterData,
      },
    }).then((response) => {
      const { data: userData, headers } = response; //
      //lưu data vào state
      setData(userData);
      // tính tổng số trang
      const { totalelement } = headers;
      setTotalPage(Math.ceil(totalelement / pageSize));
      setTotalUser(totalelement);
    });
  };

  // Hàm đóng modal tạo
  const onCloseModalCreate = () => {
    setShowModalCreate(false);
    if (step === 2) {
      setStep(1);
    }
  };

  const handleCreateUser = (values) => {
    apiLoggedInInstance({
      url: "/api/admin/user",
      method: "POST",
      data: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        searchUser();

        setShowModalCreate(false);
      }
    });
  };

  const handleUpdateUser = (values) => {
    const { type } = values;
    console.log(type);
    let url = `/api/admin/user/${record.id}`;
    if (type === USER_TYPE.TEACHER) {
      url = `/api/admin/user/teacher/${record.id}`;
    } else if (type === USER_TYPE.STUDENT) {
      url = `/api/admin/user/student/${record.id}`;
    }

    apiLoggedInInstance({
      url,
      method: "PUT",
      params: values,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setShowModalUpdate(false);
      searchUser();

      console.log(res);
    });
  };

  const handleDelete = async () => {
    await apiLoggedInInstance({
      url: `/api/admin/user/${record.id}`,
      method: "DELETE",
    });
    searchUser();

    setShowModalDelete(false);
  };

  const handleCancel = () => {
    setShowModalUpdate(false);
    setShowModalCreate(false);
    setShowModalDelete(false);
  };

  // Lấy ra thông tin user
  useEffect(() => {
    searchUser();
  }, [pageIndex, pageSize]);

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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === 0 ? "Nam" : gender === 1 ? "Nữ" : "Khác"),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-between items-center py-3 px-10 shadow-md">
        <h2>Quản trị thành viên ({totalUser})</h2>
        <Button
          type="default"
          onClick={() => setShowModalCreate(true)}
          className="flex items-center"
        >
          <PlusOutlined />
          Thêm thành viên
        </Button>
      </div>
      <div className="p-5">
        <div className="mb-5">
          <Search
            placeholder="Số điện thoại"
            onSearch={searchUser}
            onChange={(e) =>
              setFilterData((pre) => ({ ...pre, phone: e.target.value }))
            }
            style={{ width: 200 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data.map((user, index) => ({
            ...user,
            index,
          }))}
          pagination={{
            total: totalUser,
            onChange: (page) => setPageIndex(page - 1),
          }}
        />
      </div>
      {showModalCreate && (
        <Modal
          title="Thêm thành viên"
          onClose={() => {
            onCloseModalCreate();
          }}
        >
          {/* Bước 1: Chọn vai trò */}
          {step === 1 && (
            <>
              <hr className="text-black mt-5" />

              <div className="w-full flex justify-around p-5">
                <div
                  className="cursor-poiner"
                  onClick={() => {
                    setRole(USER_TYPE.MANAGER);
                  }}
                >
                  <input
                    type="radio"
                    checked={role === USER_TYPE.MANAGER}
                    name="role"
                    value={USER_TYPE.MANAGER}
                  />
                  <span className="ml-2">Quản lý</span>
                </div>
                <div
                  className="cursor-poiner"
                  onClick={() => {
                    setRole(USER_TYPE.TEACHER);
                  }}
                >
                  <input
                    type="radio"
                    checked={role === USER_TYPE.TEACHER}
                    name="role"
                    value={USER_TYPE.TEACHER}
                  />
                  <span className="ml-2">Giáo viên</span>
                </div>
                <div
                  className="cursor-poiner"
                  onClick={() => {
                    setRole(USER_TYPE.STUDENT);
                  }}
                >
                  <input
                    type="radio"
                    checked={role === USER_TYPE.STUDENT}
                    name="role"
                    value={USER_TYPE.STUDENT}
                  />
                  <span className="ml-2">Sinh viên</span>
                </div>
              </div>

              <hr className="text-black" />

              <div className="flex justify-end items-center mt-5">
                <Button
                  type="default"
                  onClick={() => {
                    onCloseModalCreate();
                  }}
                  className="mr-4"
                >
                  Huỷ
                </Button>
                {step === 1 ? (
                  <Button
                    type="default"
                    onClick={() => {
                      setStep(2);
                    }}
                  >
                    Tiếp Tục
                  </Button>
                ) : (
                  <button>Thêm</button>
                )}
              </div>
            </>
          )}
          {/* Nhập form */}
          {step === 2 && (
            <div>
              <UserForm
                onFinish={handleCreateUser}
                onCancel={onCloseModalCreate}
                role={role}
              />
            </div>
          )}
        </Modal>
      )}
      {showModalUpdate && (
        <Modal
          title="Sửa thành viên"
          onClose={() => {
            setShowModalUpdate(false);
          }}
        >
          <UserForm
            onFinish={handleUpdateUser}
            onCancel={onCloseModalCreate}
            initialValues={record}
          />
        </Modal>
      )}

      {showModalDelete && (
        <Modal
          title="Xóa thành viên"
          onClose={() => {
            setShowModalDelete(false);
          }}
        >
          <hr />
          <FormDelete onOK={handleDelete} onCancel={handleCancel} />
        </Modal>
      )}
    </div>
  );
};

export default QuanTriThanhVien;
