"use client";

import React from "react";
import { Drawer, Typography, Divider, Button, Image } from "antd";
import formatDate from "@/utils/formatDate";

const { Paragraph } = Typography;

interface BlogDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  blog: any | null; // Accept blog data type as any
}

const BlogDetailsDrawer: React.FC<BlogDetailsDrawerProps> = ({
  open,
  onClose,
  blog,
}) => {
  if (!blog) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Thông Tin Chi Tiết Bài Viết"
      width={1200}
      bodyStyle={{ padding: "24px" }}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-24 font-semibold text-center">{blog.title}</h1>
        <div className="flex items-center justify-center text-gray-500 text-sm space-x-6">
          <p className="mr-4">
            {blog.user.first_name} {blog.user.last_name}
          </p>
          <div>
            <strong>Email:</strong> {blog.user.email}
          </div>
          <div className="flex items-center space-x-2">
            {blog.categories.map((category: any) => (
              <span
                key={category.id}
                className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
          <span>{formatDate(blog.created_date)}</span>
        </div>

        <div className="text-center mt-2 text-16">
          <p>{blog.description}</p>
        </div>

        {blog.image && (
          <div className="mt-8 w-full max-w-3xl mx-auto">
            <Image
              src={blog.image}
              alt="Blog Image"
              className="w-full h-auto rounded-xl shadow-lg"
              width={800}
              height={450}
            />
          </div>
        )}

        <div className="flex flex-col gap-8 mt-12">
          <div
            className="content text-lg text-justify"
            dangerouslySetInnerHTML={{
              __html: blog.content.replace(/\"/g, ""), // Xóa tất cả dấu "
            }}
          />
          {/* Source */}
          <div className="mt-6 mb-6">
            <p className="text-gray-500 font-semibold">Nguồn:</p>
            <p className="text-blue-800">{blog.link}</p>
          </div>
        </div>

        <Divider />
        <Paragraph className="text-gray-800 mb-2">
          <strong>Hình Ảnh Bổ Sung:</strong>
        </Paragraph>
        <div className="mb-2">
          {blog.media.map((media: any) => (
            <div key={media.id} className="mb-2">
              <span className="bg-indigo-500 text-white py-1 px-2 rounded-full text-sm">
                {media.file_type}
              </span>
              <div className="mt-2">
                {media.file_type === "PDF" ? (
                  <div className="relative overflow-hidden w-full h-[600px]">
                    <iframe
                      src={media.file}
                      title="PDF Preview"
                      className="w-full h-full"
                      style={{
                        border: "none",
                      }}
                    />
                  </div>
                ) : media.file_type === "IMAGE" ? (
                  <div className="relative overflow-hidden w-full h-[200px]">
                    <Image
                      src={media.file}
                      alt="Blog Image"
                      className="rounded-lg shadow-md"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ) : (
                  <p className="text-red-500">Không hỗ trợ loại tệp này</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Đóng
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default BlogDetailsDrawer;
