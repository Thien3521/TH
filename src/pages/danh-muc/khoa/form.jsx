import React from "react";
import { Form, Input, DatePicker, Button } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const KhoaForm = ({ onFinish, onCancel, initialValues }) => {
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
          label="Tên Khóa"
          name="name"
          rules={[
            { required: true, message: "Please input your course name!" },
          ]}
        >
          <Input placeholder="Nhập tên khóa" />
        </Form.Item>

        <Form.Item
          label="Năm bắt đầu"
          name="year"
          rules={[{ required: true, message: "Please select start year!" }]}
        >
          <DatePicker picker="year" placeholder="Chọn thời gian" />
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

export default KhoaForm;
