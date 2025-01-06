import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

export const notify = (type, msg) => {
  const toastOptions = {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressionBar: false,
    closeOnClick: true,
    pauseOnHovr: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  if (!["success", "error", "info", "warning"].includes(type)) {
    console.warn("Invalid toast type provided");
    return;
  }

  switch (type) {
    case "success":
      toast.success(msg, toastOptions);
      break;
    case "error":
      toast.error(msg, toastOptions);
      break;
    case "info":
      toast.info(msg, toastOptions);
      break;
    case "warning":
      toast.warn(msg, toastOptions);
      break;
    default:
      break;
  }
};
