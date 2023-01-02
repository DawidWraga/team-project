import baseAxios, { AxiosError } from 'axios';

export const axios = baseAxios.create({
  // set it only for external domains or specific api prefixes
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  baseURL: process.env.BASE_URL,
});

// axiosInstance.interceptors.request.use(onSuccess, onError);
// axiosInstance.interceptors.response.use(onSuccess, onError);

export const getAxiosErrorMessage = (error: AxiosError | any): any => {
  if ((error as any).meta?.cause) return { cause: (error as any).meta.cause };

  // duplicate email used in registration
  if (error?.code === 'P2002' && error?.meta?.target === 'User_email_key')
    return { cause: 'Only one account allowed per user' };

  return (
    (error as any).meta?.cause || (error as any).response?.data?.message || error.message
  );
};
