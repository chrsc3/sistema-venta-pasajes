/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Alert,
} from "reactstrap";
import clientesService from "../../services/clientes";
import { UserContext } from "../../context/userContext";

function ClientesPage() {
  const User = useContext(UserContext);
  const [clientes, setClientes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
    direccion: "",
    email: "",
    estado: "activo",
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAll();
      setClientes(data);
      applyFilter(search, data);
    } catch (e) {
      setError("Error cargando clientes");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (term, base = clientes) => {
    if (!term) {
      setFiltered(base);
      return;
    }
    const lower = term.toLowerCase();
    setFiltered(
      base.filter((c) =>
        [c.nombre, c.apellido, c.ci, c.telefono, c.email]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(lower))
      )
    );
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    applyFilter(val);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombre: "",
      apellido: "",
      ci: "",
      telefono: "",
      direccion: "",
      email: "",
      estado: "activo",
    });
    toggleModal();
  };

  const openEdit = (cliente) => {
    setEditing(cliente);
    setForm({ ...cliente });
    toggleModal();
  };

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await clientesService.update(editing.idCliente, form);
      } else {
        await clientesService.create(form);
      }
      toggleModal();
      loadClientes();
    } catch (err) {
      setError("Error guardando cliente");
    }
  };

  const deleteCliente = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    try {
      await clientesService.remove(id);
      loadClientes();
    } catch (err) {
      setError("Error eliminando cliente");
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1>
          <i className="fas fa-address-book mr-3"></i>Clientes
        </h1>
        <p className="page-header-subtitle">
          Gestión de clientes frecuentes para agilizar ventas
        </p>
      </div>
      <Card className="page-actions">
        <CardBody>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <FormGroup>
                <Label>Buscar</Label>
                <Input
                  value={search}
                  onChange={onSearchChange}
                  placeholder="Nombre, CI, teléfono, email..."
                />
              </FormGroup>
            </Col>
            <Col md={6} className="text-md-right">
              <Button color="primary" onClick={openCreate}>
                <i className="fas fa-user-plus mr-2"></i>Nuevo Cliente
              </Button>
            </Col>
          </Row>
          {error && (
            <Alert color="warning" className="mt-2 mb-0">
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>

      <div className="content-card">
        <div className="content-card-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-users"></i>
              <h4>Sin clientes</h4>
              <p>Agrega nuevos clientes para reutilizar sus datos en ventas.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>CI</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.idCliente}>
                      <td>{c.idCliente}</td>
                      <td>
                        {[c.nombre, c.apellido].filter(Boolean).join(" ")}
                      </td>
                      <td>{c.ci}</td>
                      <td>{c.telefono}</td>
                      <td>{c.email}</td>
                      <td>
                        <span
                          style={{
                            color: c.estado === "activo" ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td style={{ minWidth: 160 }}>
                        <Button
                          size="sm"
                          color="info"
                          className="mr-2"
                          onClick={() => openEdit(c)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => deleteCliente(c.idCliente)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
        <ModalHeader toggle={toggleModal}>
          {editing ? "Editar Cliente" : "Nuevo Cliente"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={submitForm}>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                name="nombre"
                value={form.nombre}
                onChange={onChangeForm}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Apellido</Label>
              <Input
                name="apellido"
                value={form.apellido}
                onChange={onChangeForm}
              />
            </FormGroup>
            <FormGroup>
              <Label>CI</Label>
              <Input
                name="ci"
                value={form.ci}
                onChange={onChangeForm}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Teléfono</Label>
              <Input
                name="telefono"
                value={form.telefono}
                onChange={onChangeForm}
              />
            </FormGroup>
            <FormGroup>
              <Label>Dirección</Label>
              <Input
                name="direccion"
                value={form.direccion}
                onChange={onChangeForm}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={onChangeForm}
              />
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <Input
                type="select"
                name="estado"
                value={form.estado}
                onChange={onChangeForm}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Input>
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button color="secondary" onClick={toggleModal} className="mr-2">
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ClientesPage;
