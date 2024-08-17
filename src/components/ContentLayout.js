import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ContentLayout = ({ children, onCreate, additionalRight }) => {
  return (
    <div>
      <div className="w-[99%] flex justify-end -translate-x-14">
        {onCreate && (
          <Button type="primary" onClick={onCreate}>
            <PlusOutlined /> Thêm học phần
          </Button>
        )}
        {additionalRight && additionalRight()}
      </div>
      <div className="h-[calc(100vh_-_200px)] mt-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default ContentLayout;
