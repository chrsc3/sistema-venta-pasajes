import { createContext, useState } from "react";

// Crea el contexto de usuario
export const UserContext = createContext();

// Crea el proveedor de contexto de usuario
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(window.localStorage.getItem("user"));

  // Función para actualizar el usuario
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
