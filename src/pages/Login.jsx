import loginService from "../services/login";
import { useNavigate } from "react-router-dom";

import { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { UserContext } from "../context/userContext";

const Login = () => {
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const User = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { user: user, password: password };

    loginService
      .login(credentials)
      .then((response) => {
        User.updateUser(response.user);
        window.localStorage.setItem("token", JSON.stringify(response.token));
        window.localStorage.setItem("user", JSON.stringify(response.user));
        User.updateUser(response.user);
        navigate("/");
        console.log("Logged in as:", response.name);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("Error logging in: Invalid user or password");
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="user">User</Label>
        <Input
          type="user"
          name="user"
          id="user"
          value={user}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Contraseña</Label>
        <Input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>
      <Button type="submit">Iniciar sesión</Button>
    </Form>
  );
};

export default Login;
