import React, { useEffect, useRef, useState } from "react";
import { apiLoggedInInstance } from "../../utils/api";
import Modal from "../../components/Modal";
import { USER_TYPE } from "../../constants/userType";
import { Formik } from "formik";
import { Table, Input, Button, Popover, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UserForm = ({ onFinish, onCancel, initialValues, role }) => {
  const [tempAvatar, setTempAvatar] = useState(null);
  const [nganhNghe, setNganhNghe] = useState([]);
  const [changePass, setChangePass] = useState(false);

  const [form] = Form.useForm();
  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("upload", file);
    apiLoggedInInstance({
      url: "/api/file/upload",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    apiLoggedInInstance({
      url: "/api/field",
    }).then((res) => {
      setNganhNghe(res.data);
    });
  }, []);

  const handleChangePass = (values) => {
    apiLoggedInInstance({
      url: `/api/admin/user/${initialValues.id}`,
      method: "PUT",
      params: values,
    });
    setChangePass(false);
  };

  return (
    <div>
      {" "}
      <Formik
        initialValues={
          initialValues || {
            address: "",
            avatar: "",
            birthday: "",
            classId: 0,
            courseId: 0,
            email: "",
            enabled: true,
            fieldId: 0,
            fullName: "",
            gender: 0,
            note: "",
            password: "",
            phone: "",
            studentCode: "",
            teacherType: true,
            type: role,
            username: "",
          }
        }
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "Không được để trống";
          }
          if (!values.password && !initialValues) {
            errors.password = "Không được để trống";
          }
          if (!values.fullName) {
            errors.fullName = "Không được để trống";
          }
          if (!values.email) {
            errors.email = "Không được để trống";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Email không đúng định dạng";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          onFinish(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              {/* Avatar, Tài khoản mật khẩu */}
              <div className="w-full flex justify-between">
                <div className="w-1/2">
                  <Upload
                    beforeUpload={(file) => {
                      uploadFile(file);
                      const urlImage = URL.createObjectURL(file);
                      console.log(urlImage);
                      setTempAvatar(urlImage);
                      return false; // Prevent default upload behavior
                    }}
                    fileList={[]}
                  >
                    <div className="w-[100px] h-[100px] border bg-slate-300">
                      {tempAvatar ? (
                        <img src={tempAvatar} alt="avatar" />
                      ) : (
                        <div className="flex-col text-center">
                          <UploadOutlined className="mt-5" />
                          <p>Upload</p>
                        </div>
                      )}
                    </div>
                  </Upload>
                </div>
                <div className="w-1/2 p-3">
                  <div className="w-full mb-3">
                    <div className="w-full">Tài khoản</div>
                    <input
                      name="username"
                      className="w-full px-2 py-1 border"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder="Tài khoản"
                    />
                    {errors.username && (
                      <span className="text-xs text-[red]">
                        {errors.username}
                      </span>
                    )}
                  </div>
                  {initialValues && (
                    <div className="flex justify-end">
                      <Button
                        type="text"
                        className=" text-blue-500"
                        onClick={() => {
                          setChangePass(true);
                        }}
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>
                  )}
                  {!initialValues && (
                    <div className="w-full mb-3">
                      <div className="w-full">Mật khẩu</div>
                      <input
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        type="password"
                        className="w-full px-2 py-1 border"
                        placeholder="Mật khẩu"
                      />
                      {errors.password && (
                        <span className="text-xs text-[red]">
                          {errors.password}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Thông tin liên hệ  */}
              <div className="w-full flex justify-between">
                <div className="w-1/2 p-3">
                  <div className="w-full mb-3">
                    <div className="w-full">Họ và tên</div>
                    <input
                      name="fullName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fullName}
                      className="w-full px-2 py-1 border"
                      placeholder="Tài khoản"
                    />
                  </div>
                  <div className="w-full mb-3">
                    <div className="w-full">Ngày sinh</div>
                    <input
                      type="date"
                      name="birthday"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.birthday}
                      className="w-full px-2 py-1 border"
                      placeholder="Nganhf sinh"
                    />
                  </div>
                  <div className="w-full mb-3">
                    <div className="w-full">Email</div>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="w-full px-2 py-1 border"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="w-1/2 p-3">
                  <div className="w-full flex items-center mb-3">
                    <div className="w-1/2">Giới tính</div>
                    <div className="flex items-center gap-x-2">
                      <input name="gender" type="radio" value={0} />{" "}
                      <span>Nam</span>
                      <input name="gender" type="radio" value={1} />{" "}
                      <span>Nữ</span>
                      <input name="gender" type="radio" value={2} />{" "}
                      <span>Khác</span>
                    </div>
                  </div>
                  <div className="w-full mb-3">
                    <div className="w-full">Số điện thoại</div>
                    <input
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      className="w-full px-2 py-1 border"
                      placeholder="Số điện thoại"
                    />
                  </div>
                </div>
              </div>
              {/* Dựa vào role */}
              {role === USER_TYPE.MANAGER && (
                <div>
                  <div>
                    <div>Học và làm việc tại</div>
                    <input placeholder="Nhập thông tin" />
                  </div>
                  <div>
                    <div>Ghi chú</div>
                    <textarea
                      name="note"
                      className="w-full"
                      placeholder="Nhập thông tin"
                    />
                  </div>
                </div>
              )}
              {role === USER_TYPE.TEACHER && (
                <div>
                  <div className="w-full flex items-center justify-between">
                    <div className="w-1/2">
                      <div>Hình thức</div>
                      <select
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.teacherType}
                        name="teacherType"
                        className="w-full border px-2 py-1"
                      >
                        <option value={true}>Cơ hữu</option>
                        <option value={false}>Thỉnh giảng</option>
                      </select>
                    </div>
                    <div className="w-1/2">
                      <div>Chuyên ngành</div>
                      <select
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.courseId}
                        name="courseId"
                        className="w-full border px-2 py-1"
                      >
                        {nganhNghe.map((f, i) => (
                          <option value={f.id} key={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div>Ghi chú</div>
                    <textarea
                      name="note"
                      className="w-full"
                      placeholder="Nhập thông tin"
                    />
                  </div>
                </div>
              )}
              {/* Tương tự */}
            </div>
            {/* Render Action */}
            <div className="flex justify-end items-center">
              <button onClick={onCancel} className="mr-5">
                Huỷ
              </button>
              <button type="submit" disabled={isSubmitting}>
                Thêm
              </button>
            </div>
          </form>
        )}
      </Formik>
      {changePass && (
        <Modal
          title="Thay đổi mật khẩu"
          onClose={() => {
            setChangePass(false);
          }}
        >
          <hr />
          <Form
            form={form}
            name="change_password "
            onFinish={handleChangePass}
            layout="vertical"
            className="p-5"
          >
            <Form.Item label="Mật khẩu mới" name="new_password">
              <Input.Password />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button htmlType="submit">Thay đổi mật khẩu</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default UserForm;
