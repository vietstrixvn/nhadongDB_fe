"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Select, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CategoriesList } from "@/lib/categoriesList";
import { useRouter } from "next/navigation";
import { useDeleteCategory } from "@/hooks/cateogry/useCategories";
import CategoriesQueueTable from "@/app/(dashboard)/danh_muc/categories/CategoriesQueueTable";
import EditBlogCategory from "@/app/(dashboard)/blog/blog_categories/EditBlogCategory";
import { FaSync, MdOutlineDelete, FaRegEdit } from "@/lib/iconLib";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import { useUser } from "@/context/userProvider";
import Pagination from "@/components/Pagination";

const { Option } = Select;

const Categories: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [model, setModel] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const router = useRouter(); // Hook for navigation
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For editing category
  const [editingCategory, setEditingCategory] = useState(null);
  const { userInfo } = useUser() || {};

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = CategoriesList(currentPage, model, refreshKey);

  const totalPages = next ? currentPage + 1 : currentPage;

  const { mutate: deleteCategory } = useDeleteCategory();

  const handleDelete = (categoryId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thể loại này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteCategory(categoryId);
      },
    });
  };

  const handleEdit = (editCategory: any) => {
    if (!editCategory.id) {
      console.error("ID thể loại không hợp lệ!");
      return;
    }
    setEditingCategory(editCategory);
    setIsEditModalVisible(true); // Mở modal chỉnh sửa
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (_, __, index) => <span>{index + 1}</span>, // index + 1
    },
    {
      title: "Tên Thể Loại",
      dataIndex: "name",
      key: "name",
      width: 400,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (fileUrl: string) => (
        <Image
          width={100}
          src={fileUrl}
          preview={{
            destroyOnClose: true,
          }}
          alt="Category Image"
        />
      ),
    },
    {
      title: "Thao Tác",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            className="mr-2"
          >
            <MdOutlineDelete className="text-albert-error" />
          </Button>
          <Button onClick={() => handleEdit(record)}>
            <FaRegEdit />
          </Button>
        </>
      ),
    },
  ];
  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleModelChange = (value: string) => {
    setModel(value);
    setRefreshKey((prev) => prev + 1); // Refresh data when model changes
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleCreateCategory = () => {
    router.push("/danh_muc/categories/create_category"); // Navigate to the create category page
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false); // Hide the edit category modal
    setEditingCategory(null); // Reset editing category
  };

  return (
    <>
      <div className="p-4">
        <Heading name="quản lý toàn bộ thể loại  " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <div className="mb-4">
            {/* Phần chữ Bộ Lọc */}
            <p className="mb-2">Bộ Lọc</p>

            {/* Phần Select và Button kế nhau */}
            <div className="flex items-center">
              <Select
                value={model}
                onChange={handleModelChange}
                placeholder="Chọn model"
                style={{ width: 200 }}
              >
                <Option value="blog">Giáo Hội</Option>
                <Option value="news">Tin Tức</Option>
                <Option value="document">Tư Liệu</Option>
                <Option value="mission">Sứ Vụ</Option>
                <Option value="website">Các Thành Phần Web</Option>
              </Select>

              <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
                <FaSync /> Làm mới
              </Button>
            </div>
          </div>
          <Button type="primary" onClick={handleCreateCategory}>
            Tạo Thể Loại
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
                setSelectedKeys(selectedRowKeys as number[]),
            }}
          />
        </div>
        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        {userInfo?.role.name === "admin" ? (
          <>
            <CategoriesQueueTable />
          </>
        ) : null}
      </div>
      <Modal
        title="Sửa Thể Loại"
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        footer={null}
        width={600}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <EditBlogCategory category={editingCategory} />{" "}
        {/* Hiển thị thông tin thể loại */}
      </Modal>
    </>
  );
};

export default Categories;
