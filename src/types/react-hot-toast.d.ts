declare module 'react-hot-toast' {
  import type React from 'react';
  export const Toaster: React.FC<any>;
  export const toast: {
    (message: string, options?: any): void;
    success(message: string, options?: any): void;
    error(message: string, options?: any): void;
  };
}


