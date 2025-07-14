"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserList } from "@/lib/userList";
import Heading from "@/components/design/Heading";
import { useBlockUser } from "@/hooks/user/useUsers";
import BackButton from "@/components/Button/BackButton";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const Page: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey] = useState(0); // State để làm mới dữ liệu
  const [is_active] = useState<string>(""); // Không lọc theo trạng thái hoạt động
  const [blocked] = useState<string>("true"); // Chỉ hiển thị người dùng bị chặn
  const { queueData, next, isLoading, isError } = UserList(
    currentPage,
    is_active,
    blocked,
    refreshKey
  );
  const totalPages = next ? currentPage + 1 : currentPage;

  const { mutate } = useBlockUser();

  // Gỡ chặn 1 người dùng
  const handleUnblock = (id: string) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn bỏ chặn người dùng này?",
      onOk: () => {
        mutate({ id: [id], status: "unblock" });
      },
    });
  };

  // Gỡ chặn danh sách người dùng
  const handleUnblockMultiple = () => {
    if (selectedKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng để bỏ chặn.");
      return;
    }
    Modal.confirm({
      title: "Bạn có chắc chắn muốn bỏ chặn các người dùng đã chọn?",
      onOk: () => {
        mutate({ id: selectedKeys, status: "unblock" });
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (_: any, record: any, index: number) => index + 1, // Hiển thị chỉ số + 1
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Trạng Thái Hoạt Động",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Chặn",
      dataIndex: "blocked",
      key: "blocked",
      render: (blocked) => (blocked ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleUnblock(record.id)}>
          Bỏ Chặn
        </Button>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

  return (
    <div className="p-4">
      <BackButton />
      <Heading name="Quản lý danh sách chặn " />
      <div className="mb-4 flex justify-between">
        <Button
          type="primary"
          danger
          disabled={selectedKeys.length === 0}
          onClick={handleUnblockMultiple}
        >
          Gỡ Chặn Danh Sách
        </Button>
      </div>
      <div className="overflow-auto" style={{ maxHeight: "800px" }}>
        <Table
          columns={columns}
          dataSource={queueData}
          rowKey="id"
          pagination={false}
          scroll={{ y: 500 }}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (selectedRowKeys) =>
              setSelectedKeys(selectedRowKeys as string[]),
          }}
        />
      </div>
      <div className="flex justify-center mt-8 items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-6 h-6 text-10 rounded-full hover:bg-gray-300 ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!next}
          className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
            !next ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Page;
