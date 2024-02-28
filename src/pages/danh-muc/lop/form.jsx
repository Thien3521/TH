import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { apiLoggedInInstance } from "../../../utils/api";

const { Option } = Select;

const LopForm = ({ onFinish, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [khoas, setKhoas] = useState([]);

  useEffect(() => {
    // Fetch danh sách các khóa và cập nhật state
    fetchKhoas();
  }, []);

  const fetchKhoas = async () => {
    try {
      const response = await apiLoggedInInstance({
        url: "/api/course",
        method: "GET",
      });
      setKhoas(response.data);
    } catch (error) {
      console.error("Error fetching khoas:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const khoa = khoas.find((khoa) => khoa.name === values.khoa);
        if (khoa) {
          onFinish({ ...values, khoa_id: khoa.id });
        }
      }}
      initialValues={initialValues}
      className="p-5 pb-0"
    >
      <div className="flex justify-between">
        <Form.Item
          label="Tên lớp"
          name="name"
          rules={[
            { required: true, message: "Please input your course name!" },
          ]}
        >
          <Input placeholder="Nhập tên lớp" />
        </Form.Item>

        <Form.Item
          label="Khoá"
          name="khoa"
          rules={[{ required: true, message: "Please select khoa!" }]}
        >
          <Select placeholder="Chọn khoá">
            {khoas.map((khoa) => (
              <Option key={khoa.id} value={khoa.name}>
                {khoa.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <hr />

      <Form.Item className="flex justify-end pt-5">
        <Button htmlType="button" onClick={onCancel} className="mr-5">
          Cancel
        </Button>
        <Button htmlType="submit">OK</Button>
      </Form.Item>
    </Form>
  );
};

export default LopForm;
