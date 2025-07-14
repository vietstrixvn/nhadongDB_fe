'use client';

import DefaultLayout from '@/components/layout/DefautLayout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/design/Loading';
import ScrollToTopButton from '@/components/Button/ScrollButton';
import { message } from 'antd';
import Head from 'next/head';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTokenChecked(true);
    }
  }, [loading]);

  useEffect(() => {
    if (tokenChecked) {
      if (isAuthenticated) {
        console.warn('User is authenticated');
      } else {
        message.error('Bạn Không Có Quyền Truy Cập Vào Trang !!');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router, tokenChecked]);

  if (loading || !tokenChecked) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DefaultLayout>
        {children}
        <ScrollToTopButton />
      </DefaultLayout>
    </>
  );
}
