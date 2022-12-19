import baseAxios, { AxiosError } from 'axios';

export const axios = baseAxios.create({
  // set it only for external domains or specific api prefixes
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  baseURL: process.env.BASE_URL,
});

// axiosInstance.interceptors.request.use(onSuccess, onError);
// axiosInstance.interceptors.response.use(onSuccess, onError);

export const getAxiosErrorMessage = (error: AxiosError): any => {
  if ((error as any).meta?.cause) return { cause: (error as any).meta.cause };

  return (
    (error as any).meta?.cause || (error as any).response?.data?.message || error.message
  );
};
