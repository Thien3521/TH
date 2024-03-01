import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TopicForm = ({ onFinish, onCancel, initialValues, mode }) => {
  const [form] = Form.useForm();
  const [draf, setDraf] = useState(initialValues?.isDraf || false);

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={(values) => {
          onFinish({ ...values, isDraf: draf });
        }}
        layout="vertical"
        className="p-5"
      >
        <Form.Item
          name="name"
          label="Tên đề tài"
          rules={[{ required: true, message: "Please enter a name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Please enter a content!" }]}
        >
          <ReactQuill theme="snow" />
        </Form.Item>
        <Form.Item className="flex justify-end ">
          <Button className="mr-5" onClick={onCancel}>
            Cancel
          </Button>
          {mode === "CREATE" && (
            <Button
              htmlType="submit"
              onClick={() => {
                setDraf(true);
              }}
            >
              Nháp
            </Button>
          )}

          <Button
            htmlType="submit"
            onClick={() => {
              setDraf(false);
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default TopicForm;
