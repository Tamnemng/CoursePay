import React from "react";
import { Button } from "antd";

const ContentLayout = ({ children, onCreate, additionalRight }) => {
  return (
    <div>
      <div className="w-[99%] flex justify-end">
        {onCreate && (
          <Button type="primary" onClick={onCreate}>
            Thêm học phần mới
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
