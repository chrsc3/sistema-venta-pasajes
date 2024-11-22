import loginService from "../services/login";
import { useNavigate } from "react-router-dom";
import LogoChaqueño from "../assets/LogoChaque.jpg";

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
        User.updateUser(response);
        window.localStorage.setItem("login", JSON.stringify(response));
        navigate("/");
        console.log("Logged in as:", response.name);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("Error logging in: Invalid user or password");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="card"
              style={{
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                borderRadius: "20px",
              }}
            >
              <div className="card-body">
                <div className="text-center mb-4">
                  <img
                    src={LogoChaqueño}
                    alt="Logo Chaqueño"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "20%",
                      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                    }}
                  />
                </div>
                <h3 className="card-title text-center">Iniciar sesión</h3>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="user">Usuario</Label>
                    <Input
                      type="text"
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
                  <Button type="submit" color="primary" block>
                    Iniciar sesión
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
