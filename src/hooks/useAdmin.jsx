import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAdmin = () => {
  const { user } = useContext(AuthContext);

  // Since no user has role, always return false
  return false;
};

export default useAdmin;

