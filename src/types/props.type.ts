import { ReactNode } from 'react';
import type { ImageProps } from 'next/image';

export interface DefaultLayoutProps {
  children: ReactNode; // Khai báo kiểu cho children
}

export type SEOProps = {
  title: string;
  description: string;
  image?: string;
};

export interface CustomImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  imageKey?: string;
  src: ImageProps['src'];
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  priority?: boolean;
  className?: string;
}
