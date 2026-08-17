import React, { createContext, useState, useContext, ReactNode } from "react";
import { useNavigate } from "react-router";

const LoginContext = createContext<any>(null);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userdata, setUserdata] = useState<any>([]);
  const [permissionId, setPermissionsId] = useState<any>([]);
  const [prevLocation, setPrevLocation] = useState(false);
  const navigate = useNavigate();

  const login = (data: any, isLogin: any = 0) => {
    setIsLoggedIn(true);
    setUserdata(data);
    const newdata = data?.role_permission?.map(
      (item: any) => item?.read_permission == 1 && item?.p_id
    );
    setPermissionsId(newdata || []);
    if (isLogin) {
      if (prevLocation) {
        navigate(prevLocation);
      } else {
        navigate("/franchisee/dashboard");
      }
    } else {
      if (prevLocation && !isLoggedIn) {
        navigate(prevLocation);
      }
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserdata("");
    setPermissionsId([]);
    window.history.pushState(null, null, location.pathname);
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userdata,
        permissionId,
        prevLocation,
        setPrevLocation,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
