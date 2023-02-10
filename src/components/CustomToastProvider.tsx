import { ToastContainer } from 'react-toastify';
import { Slide } from 'react-toastify';

interface IProps {}

export function CustomToastProvider(props: IProps) {
  const {} = props;

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
    />
  );
}
