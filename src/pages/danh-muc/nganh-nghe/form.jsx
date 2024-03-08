import React from "react";
import { Form, Input, Button } from "antd";
import moment from "moment";

const NganhNgheForm = ({ onFinish, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  if (initialValues?.year) {
    initialValues.year = moment(initialValues.year);
  }
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      className="p-5 pb-0"
    >
      <div className="flex justify-between">
        <Form.Item
          label="Mã ngành nghề"
          name="code"
          rules={[
            { required: true, message: "Please input your course name!" },
          ]}
        >
          <Input placeholder="Nhập mã ngành nghề" />
        </Form.Item>

        <Form.Item
          label="Tên ngành nghề"
          name="name"
          rules={[
            { required: true, message: "Please input your course name!" },
          ]}
        >
          <Input placeholder="Nhập tên ngành nghề" />
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

export default NganhNgheForm;
