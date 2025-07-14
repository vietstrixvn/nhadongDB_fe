'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleAPI, endpoints } from '@/api';

import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  UpdateVocation,
  VocationRegisterListResponse,
  Filters,
  DeleteVocationForm,
} from '@/types/types';

const fetchVocationList = async (
  pageParam: number = 1,
  token: string,
  filters: Filters
): Promise<VocationRegisterListResponse> => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // Filter out undefined or empty values from filters
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ''
      )
    );

    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
      ...validFilters, // Merge the valid filters into the query string
    }).toString();

    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.vocation}${queryString ? `?${queryString}` : ''}`,
      'GET',
      null,
      token
    );
    return response;
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useVocationList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
      setIsReady(true);
    };
    fetchToken();
  }, [getToken]);

  return useQuery<VocationRegisterListResponse, Error>({
    queryKey: ['vocationList', token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return fetchVocationList(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

/** 
 Tạo Tin Sự Kiện
**/

const UpdateVocationId = async (newVocation: UpdateVocation, token: string) => {
  const formData = new FormData();

  for (const key in newVocation) {
    const value = newVocation[key as keyof UpdateVocation];
    if (key === 'id' && Array.isArray(value)) {
      value.forEach((string) => formData.append('id', string));
    } else if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  if (!token) throw new Error('No token available');

  try {
    const response = await handleAPI(
      `${endpoints.vocation}`,
      'PATCH',
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error('Error creating docs:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

const useUpdateVocation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };

    fetchToken();
  }, [getToken]);

  return useMutation({
    mutationFn: async (newVocation: UpdateVocation) => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return UpdateVocationId(newVocation, token);
    },
    onSuccess: () => {
      message.success('Duyêt Thành Công Ơn Gọi');
      queryClient.invalidateQueries({ queryKey: ['vocationList'] });
    },
    onError: (error) => {
      console.log(error.message || 'Failed to create vocation.');
    },
  });
};

const DeleteVocation = async (
  deleteVocation: DeleteVocationForm,
  token: string
) => {
  const formData = new FormData();

  // Duyệt qua các key trong deleteVocation
  for (const key in deleteVocation) {
    const value = deleteVocation[key as keyof DeleteVocationForm];

    if (key === 'id' && Array.isArray(value)) {
      value.forEach((id) => formData.append('id', id)); // Thêm từng phần tử từ mảng
    } else if (typeof value === 'string') {
      formData.append(key, value); // Chỉ thêm nếu value là chuỗi
    }
  }

  // Kiểm tra token
  if (!token) throw new Error('No token available');

  try {
    const response = await handleAPI(
      `${endpoints.vocation}`, // Đường dẫn API
      'DELETE', // Phương thức DELETE
      formData, // Gửi formData
      token // Token để xác thực
    );
    return response.data; // Trả về dữ liệu nếu thành công
  } catch (error: any) {
    console.error('Error deleting vocation:', error.response?.data);
    throw new Error(
      error.response?.data?.message || 'Failed to delete vocation'
    );
  }
};

const useDeleteVocation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };

    fetchToken();
  }, [getToken]);

  return useMutation({
    mutationFn: async (deleteVocation: DeleteVocationForm) => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return DeleteVocation(deleteVocation, token);
    },
    onSuccess: () => {
      message.success('Xóa Thành Công Ơn Gọi');
      queryClient.invalidateQueries({ queryKey: ['vocationList'] });
    },
    onError: (error) => {
      console.log(error.message || 'Failed to create vocation.');
    },
  });
};
export { useVocationList, useUpdateVocation, useDeleteVocation };
