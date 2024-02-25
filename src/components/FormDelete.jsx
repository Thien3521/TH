import { Button } from "antd";
import React from "react";

const FormDelete = ({ onOK, onCancel }) => {
  return (
    <div className="p-5">
      {" "}
      <h3>Bạn có chắc chắn xóa bản ghi này không ?</h3>
      <div className="flex justify-end mt-5">
        <Button onClick={onCancel} className="mr-5">
          Cancel
        </Button>
        <Button onClick={onOK}>OK</Button>
      </div>
    </div>
  );
};

export default FormDelete;
