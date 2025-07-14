'use client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { handleAPI, endpoints } from '@/api';

import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { UserFilters, FetchUserListResponse } from '@/types/types';

/**
Hàm xử lý lấy danh sách user
 **/

const fetchUserList = async (
  pageParam: number = 1,
  token: string,
  filters: UserFilters
): Promise<FetchUserListResponse> => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const params = new URLSearchParams();
    params.append('page', pageParam.toString());

    // Handle multiple roles
    if (filters.role) {
      filters.role.forEach((role) => params.append('role', role));
    }

    // Add other filters if necessary
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'role' && value !== undefined) {
        params.append(key, value.toString());
      }
    });
    if (!endpoints.users) {
      throw null;
    }
    // Make the API request
    const response = await handleAPI(
      `${endpoints.users}?${params.toString()}`,
      'GET',
      null,
      token
    );
    return response;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};

// Custom hook for user list
const useUserList = (
  page: number,
  filters: UserFilters = {},
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

  return useQuery<FetchUserListResponse, Error>({
    queryKey: ['userList', token, page, filters, refreshKey],
    queryFn: async () => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return fetchUserList(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};
// hook
interface NewManager {
  [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

/**
Hàm xử lý tạo manager
 **/

const CreateManager = async (newManager: NewManager, token: string) => {
  const formData = new FormData();

  for (const key in newManager) {
    const value = newManager[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  }

  if (!token) throw new Error('No token available');

  try {
    const response = await handleAPI(
      `${endpoints.users}`,
      'POST',
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error('Error creating manager:', error.response?.data);
    throw new Error(
      error.response?.data?.message || 'Failed to create manager'
    );
  }
};

const useCreateManager = () => {
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
    mutationFn: async (newManager: NewManager) => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return CreateManager(newManager, token);
    },
    onSuccess: () => {
      message.success('Quản trị viên đã được thêm thành công');
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
    onError: (error) => {
      console.log(error.message || 'Failed to add manager.');
    },
  });
};

interface AddManager {
  [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

/**
Hàm xử lý thêm user từ danh sách user thành admin
**/

const AddManager = async (addManager: AddManager, token: string) => {
  const formData = new FormData();

  // Duyệt qua các trường trong browseManager
  for (const key in addManager) {
    const value = addManager[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  }

  if (!token) throw new Error('No token available');

  try {
    const response = await handleAPI(
      `${endpoints.roleAddUserToManager}`,
      'POST',
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error('Error creating manager:', error.response?.data);
    throw new Error(
      error.response?.data?.message || 'Failed to create manager'
    );
  }
};

const useAddManager = () => {
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
    mutationFn: async (addManager: AddManager) => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return AddManager(addManager, token);
    },
    onSuccess: () => {
      console.log('Người quản lý đã được thêm thành công');
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
    onError: (error) => {
      console.log(error.message || 'Failed to add manager.');
    },
  });
};

interface ActiveUser {
  [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

const ActiveUserList = async (activeUser: ActiveUser, token: string) => {
  const formData = new FormData();

  // Duyệt qua các trường trong browseManager
  for (const key in activeUser) {
    const value = activeUser[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  }
  // Nếu không có token, ném lỗi
  if (!token) throw new Error('No token available');

  try {
    // Gửi yêu cầu POST với formData
    const response = await handleAPI(
      `${endpoints.activeUser}`,
      'POST',
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error('Error browse queue:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to browse queue');
  }
};

const useActiveUser = () => {
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
    mutationFn: async (activeUser: ActiveUser) => {
      if (!token) {
        throw new Error('Token is not available');
      }
      return ActiveUserList(activeUser, token);
    },
    onSuccess: () => {
      message.success('Duyệt hàng đợi thành công!');
      queryClient.invalidateQueries({ queryKey: ['userQueueList'] });
    },
    onError: (error) => {
      console.log(error.message || 'Failed to browse queue.');
    },
  });
};

/**
 Hàm xử lý khóa và mở khóa user
 **/

interface BlockedUser {
  id: string[];
  status: string;
}

const blockUserAPI = async (blockUser: BlockedUser, token: string) => {
  if (!token) throw new Error('No token available');

  const formData = new FormData();
  Object.entries(blockUser).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  try {
    const response = await handleAPI(
      `${endpoints.blocked}`,
      'POST',
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error('Error blocking user:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to block user');
  }
};

const useBlockUser = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (blockUser: BlockedUser) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Token is not available');
      }
      return blockUserAPI(blockUser, token);
    },
    onSuccess: () => {
      message.success('Người dùng đã bị chặn thành công!');
      queryClient.invalidateQueries({ queryKey: ['userQueueList'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Không thể chặn người dùng.');
    },
  });
};

export {
  useUserList,
  useCreateManager,
  useAddManager,
  useActiveUser,
  useBlockUser,
};
