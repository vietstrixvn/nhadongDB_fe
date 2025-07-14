"use client"; // Ensures this is a client component

import React, { useState, useMemo } from "react";
import { Table, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BlogList } from "@/lib/blogList";
import BlogDetailsModal from "@/app/(dashboard)/blog/BlogDetailsModal";
import { EyeOutlined } from "@ant-design/icons";
import { FaArrowLeft, FaArrowRight, FaSync } from "@/lib/iconLib";
import { Error, Heading } from "@/components/design/index";
import { useUser } from "@/context/userProvider";
import TableQueueList from "@/app/(dashboard)/blog/BlogQueueTable";

const Blogs: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { userInfo } = useUser() || {}; // Provide a default empty object if useUser returns null

  // Pass model into CategoriesList
  const { queueData, next, isLoading, isError } = BlogList(
    currentPage,
    "",
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const columns: ColumnsType<any> = [
    {
      title: "Chi Tiết",
      dataIndex: "full",
      key: "full",
      width: 150,
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record)}>
          <EyeOutlined /> Xem Chi Tiết
        </Button>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_: any, record: any, index: number) => index + 1, // This will display index + 1 as the ID
    },
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
      width: 400,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Thể Loại",
      dataIndex: "categories",
      key: "categories",
      width: 150,
      render: (categories) => (
        <span>
          {categories.map((category: any, index: number) => {
            // Danh sách màu sắc để luân phiên
            const colors = ["geekblue", "green", "volcano", "orange", "cyan"];
            const color = colors[index % colors.length]; // Chọn màu theo index
            return (
              <Tag
                color={color}
                key={category.id}
                style={{ marginBottom: "5px" }}
              >
                {category.name} {/* Hiển thị tên của thể loại */}
              </Tag>
            );
          })}
        </span>
      ),
    },
  ];

  const dataSource = useMemo(() => queueData, [queueData]);

  if (isError) return <Error />;

  const handleViewDetails = (blog: any) => {
    setSelectedBlog(blog);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedBlog(null);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản Lý Bài Viêt" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
        </div>

        <div className="overflow-auto" style={{ maxHeight: "800px" }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            pagination={false}
            scroll={{ y: 500 }}
            loading={isLoading}
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
        {userInfo?.role.name === "admin" ? (
          <>
            <Heading name="Quản lý hàng đợi duyệt bài viết" />
            <TableQueueList model="blog" />
          </>
        ) : null}
      </div>
      <BlogDetailsModal
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedBlog}
      />
    </>
  );
};

export default Blogs;
