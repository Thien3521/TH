import React, { useEffect, useRef, useState } from "react";
import { DemoModal } from "../../../components/Modal1";
import { apiLoggedInInstance } from "../../../utils/api";
import { Button, Input, Popover, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const NganhNghe = () => {
  const buttonRef = useRef();
  const [data, setData] = useState([]); // lưu data
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [editField, setEditField] = useState();

  const [filterValue, setFilterValue] = useState({
    code: "",
    name: "",
  });

  const getData = () => {
    apiLoggedInInstance({
      url: "/api/field",
      method: "GET",
    }).then((response) => {
      const responseData = response.data;
      const calTotalPage = Math.ceil(responseData.length / pageSize); // tính toán tổng số trang
      setTotalPage(calTotalPage); // lưu tổng số trang vào state
      setData(responseData); // lưu data từ api vào state
    });
  };

  const handleCreate = () => {
    apiLoggedInInstance({
      url: "/api/field",
      method: "POST",
      params: {
        code: code,
        name: name,
      },
    }).then((res) => {
      if (res.data) {
        getData();
        handleClose();
      }
    });
  };

  const handleClose = () => {
    // truoc khi
    setCode("");
    setName("");
    setShowModal(false);
  };

  const handleDelete = (fieldId) => {
    apiLoggedInInstance({
      url: "/api/field/" + fieldId,
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        getData();
      }
    });
  };

  const handleUpdate = () => {
    if (!editField) return;
    apiLoggedInInstance({
      url: "/api/field/" + editField.id,
      params: {
        code: editField.code,
        name: editField.name,
      },
      method: "PUT",
    }).then(() => {
      getData();
      setEditField();
      handleClose();
    });
  };

  const handleSearch = () => {
    apiLoggedInInstance({
      url: "/api/field",
      method: "GET",
    }).then((response) => {
      let filteredData = response.data;
      filteredData = filteredData.filter((item) => {
        return (
          item.code.includes(filterValue.code) &&
          item.name.includes(filterValue.name)
        );
      });
      const calTotalPage = Math.ceil(filteredData.length / pageSize); // tính toán tổng số trang
      setTotalPage(calTotalPage); // lưu tổng số trang vào state
      setData(filteredData);
    });
  };

  const handleReset = () => {
    setFilterValue({
      code: "",
      name: "",
    });
    getData();
  };

  // lấy dữ liệu từ api lần đầu và khi pageSize thay đổi
  useEffect(() => {
    getData(); //
  }, [pageSize]);

  // gọi khi state data, currentpage, pageSize thay đổi
  useEffect(() => {
    // 1 - 10
    // 10 - 20
    // 20 - 30
    const sortedData = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ); // sắp xếp
    const paginateData = sortedData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    setPaginatedData(paginateData);
  }, [data, currentPage, pageSize]);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "(*)",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Popover
            content={
              <div>
                <Button
                  onClick={() => {
                    setEditField(record);
                    setShowModal(true);
                  }}
                  icon={<EditOutlined />}
                  className="mr-2"
                ></Button>
                <Button
                  onClick={() => handleDelete(record)}
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
    },
    {
      title: "Tên ngành nghề",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center py-3 px-10 shadow-md">
        <h2>Ngành nghề ({data.length})</h2>

        <Button
          type="default"
          // ref={buttonRef}
          onClick={() => {
            setShowModal(true);
          }}
          className="flex items-center"
        >
          <PlusOutlined />
          Thêm ngành nghề
        </Button>
      </div>
      <div>
        <div className="p-5">
          {/* <div>
            <Button
              onClick={handleReset}
              icon={
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="31"
                    height="31"
                    rx="2.5"
                    stroke="#E2E3E9"
                  />
                </svg>
              }
            >
              Reset
            </Button>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
            <Input
              value={filterValue.code}
              onChange={(event) =>
                setFilterValue((prev) => ({
                  ...prev,
                  code: event.target.value,
                }))
              }
            />
            <Input
              value={filterValue.name}
              onChange={(event) =>
                setFilterValue((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </div> */}
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalPage * pageSize,
              onChange: setCurrentPage,
            }}
          />
        </div>
        {showModal && (
          <DemoModal
            title={editField ? "Chỉnh sửa ngành nghề" : "Thêm mới ngành nghề"}
            onClose={handleClose}
          >
            {editField ? (
              <div>
                <input
                  value={editField.code}
                  onChange={(e) => {
                    setEditField((pre) => ({ ...pre, code: e.target.value }));
                  }}
                  autoFocus
                  className="w-1/2 border p-2"
                  placeholder="Mã ngành nghề"
                />
                <input
                  value={editField.name}
                  onChange={(e) => {
                    setEditField((pre) => ({ ...pre, name: e.target.value }));
                  }}
                  className="w-1/2 border p-2"
                  placeholder="Tên ngành nghề"
                />
                <button
                  onClick={() => {
                    handleUpdate();
                  }}
                  className="w-1/2 border p-2"
                >
                  {"Sửa"}
                </button>
              </div>
            ) : (
              <div>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  autoFocus
                  className="w-1/2 border p-2"
                  placeholder="Mã ngành nghề"
                />
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="w-1/2 border p-2"
                  placeholder="Tên ngành nghề"
                />
                <button
                  onClick={() => {
                    handleCreate();
                  }}
                  className="w-1/2 border p-2"
                >
                  {"Thêm"}
                </button>
              </div>
            )}
          </DemoModal>
        )}
      </div>
    </div>
  );
};

const ButtonAction = ({ item, onDelete, clickUpdate }) => {
  const buttonRef = useRef();
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
  }, []);
  return (
    <div
      ref={buttonRef}
      style={{
        position: "relative",
      }}
    >
      <button onClick={() => setOpen(!open)}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.75"
            y="0.75"
            width="30.5"
            height="30.5"
            rx="2.25"
            stroke="#98BEE1"
            stroke-width="1.5"
          />
          <g clip-path="url(#clip0_4_4716)">
            <path
              d="M16 18.25C17.2426 18.25 18.25 17.2426 18.25 16C18.25 14.7574 17.2426 13.75 16 13.75C14.7574 13.75 13.75 14.7574 13.75 16C13.75 17.2426 14.7574 18.25 16 18.25Z"
              stroke="#98BEE1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.55 18.25C21.4502 18.4762 21.4204 18.7271 21.4645 18.9704C21.5086 19.2137 21.6246 19.4382 21.7975 19.615L21.8425 19.66C21.982 19.7993 22.0926 19.9647 22.1681 20.1468C22.2436 20.3289 22.2824 20.5241 22.2824 20.7213C22.2824 20.9184 22.2436 21.1136 22.1681 21.2957C22.0926 21.4778 21.982 21.6432 21.8425 21.7825C21.7032 21.922 21.5378 22.0326 21.3557 22.1081C21.1736 22.1836 20.9784 22.2224 20.7812 22.2224C20.5841 22.2224 20.3889 22.1836 20.2068 22.1081C20.0247 22.0326 19.8593 21.922 19.72 21.7825L19.675 21.7375C19.4982 21.5646 19.2737 21.4486 19.0304 21.4045C18.7871 21.3604 18.5362 21.3902 18.31 21.49C18.0882 21.5851 17.899 21.7429 17.7657 21.9442C17.6325 22.1454 17.561 22.3812 17.56 22.6225V22.75C17.56 23.1478 17.402 23.5294 17.1207 23.8107C16.8394 24.092 16.4578 24.25 16.06 24.25C15.6622 24.25 15.2806 24.092 14.9993 23.8107C14.718 23.5294 14.56 23.1478 14.56 22.75V22.6825C14.5542 22.4343 14.4738 22.1935 14.3294 21.9915C14.1849 21.7896 13.9831 21.6357 13.75 21.55C13.5238 21.4502 13.2729 21.4204 13.0296 21.4645C12.7863 21.5086 12.5618 21.6246 12.385 21.7975L12.34 21.8425C12.2007 21.982 12.0353 22.0926 11.8532 22.1681C11.6711 22.2436 11.4759 22.2824 11.2787 22.2824C11.0816 22.2824 10.8864 22.2436 10.7043 22.1681C10.5222 22.0926 10.3568 21.982 10.2175 21.8425C10.078 21.7032 9.9674 21.5378 9.89191 21.3557C9.81642 21.1736 9.77757 20.9784 9.77757 20.7812C9.77757 20.5841 9.81642 20.3889 9.89191 20.2068C9.9674 20.0247 10.078 19.8593 10.2175 19.72L10.2625 19.675C10.4354 19.4982 10.5514 19.2737 10.5955 19.0304C10.6396 18.7871 10.6098 18.5362 10.51 18.31C10.4149 18.0882 10.2571 17.899 10.0558 17.7657C9.85463 17.6325 9.61884 17.561 9.3775 17.56H9.25C8.85218 17.56 8.47064 17.402 8.18934 17.1207C7.90804 16.8394 7.75 16.4578 7.75 16.06C7.75 15.6622 7.90804 15.2806 8.18934 14.9993C8.47064 14.718 8.85218 14.56 9.25 14.56H9.3175C9.56575 14.5542 9.8065 14.4738 10.0085 14.3294C10.2104 14.1849 10.3643 13.9831 10.45 13.75C10.5498 13.5238 10.5796 13.2729 10.5355 13.0296C10.4914 12.7863 10.3754 12.5618 10.2025 12.385L10.1575 12.34C10.018 12.2007 9.9074 12.0353 9.83191 11.8532C9.75642 11.6711 9.71757 11.4759 9.71757 11.2787C9.71757 11.0816 9.75642 10.8864 9.83191 10.7043C9.9074 10.5222 10.018 10.3568 10.1575 10.2175C10.2968 10.078 10.4622 9.9674 10.6443 9.89191C10.8264 9.81642 11.0216 9.77757 11.2188 9.77757C11.4159 9.77757 11.6111 9.81642 11.7932 9.89191C11.9753 9.9674 12.1407 10.078 12.28 10.2175L12.325 10.2625C12.5018 10.4354 12.7263 10.5514 12.9696 10.5955C13.2129 10.6396 13.4638 10.6098 13.69 10.51H13.75C13.9718 10.4149 14.161 10.2571 14.2943 10.0558C14.4275 9.85463 14.499 9.61884 14.5 9.3775V9.25C14.5 8.85218 14.658 8.47064 14.9393 8.18934C15.2206 7.90804 15.6022 7.75 16 7.75C16.3978 7.75 16.7794 7.90804 17.0607 8.18934C17.342 8.47064 17.5 8.85218 17.5 9.25V9.3175C17.501 9.55884 17.5725 9.79463 17.7057 9.99585C17.839 10.1971 18.0282 10.3549 18.25 10.45C18.4762 10.5498 18.7271 10.5796 18.9704 10.5355C19.2137 10.4914 19.4382 10.3754 19.615 10.2025L19.66 10.1575C19.7993 10.018 19.9647 9.9074 20.1468 9.83191C20.3289 9.75642 20.5241 9.71757 20.7213 9.71757C20.9184 9.71757 21.1136 9.75642 21.2957 9.83191C21.4778 9.9074 21.6432 10.018 21.7825 10.1575C21.922 10.2968 22.0326 10.4622 22.1081 10.6443C22.1836 10.8264 22.2224 11.0216 22.2224 11.2188C22.2224 11.4159 22.1836 11.6111 22.1081 11.7932C22.0326 11.9753 21.922 12.1407 21.7825 12.28L21.7375 12.325C21.5646 12.5018 21.4486 12.7263 21.4045 12.9696C21.3604 13.2129 21.3902 13.4638 21.49 13.69V13.75C21.5851 13.9718 21.7429 14.161 21.9442 14.2943C22.1454 14.4275 22.3812 14.499 22.6225 14.5H22.75C23.1478 14.5 23.5294 14.658 23.8107 14.9393C24.092 15.2206 24.25 15.6022 24.25 16C24.25 16.3978 24.092 16.7794 23.8107 17.0607C23.5294 17.342 23.1478 17.5 22.75 17.5H22.6825C22.4412 17.501 22.2054 17.5725 22.0042 17.7057C21.8029 17.839 21.6451 18.0282 21.55 18.25V18.25Z"
              stroke="#98BEE1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_4_4716">
              <rect
                width="18"
                height="18"
                fill="white"
                transform="translate(7 7)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          <div onClick={clickUpdate}>Sửa</div>
          <div
            onClick={() => {
              onDelete(item.id);
              setOpen(false);
            }}
          >
            Xoá
          </div>
        </div>
      )}
    </div>
  );
};
export default NganhNghe;
