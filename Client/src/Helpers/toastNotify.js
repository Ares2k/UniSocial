import { toast } from "react-toastify";

export const notifyRegister = () => {
  toast.success('Successfully registered !', {
    toastId: 1,
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
}

export const notifyLogin = () => {
  toast.success('Successfully logged in !', {
    toastId: 1,
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
}
