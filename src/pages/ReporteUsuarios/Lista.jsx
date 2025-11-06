import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import { Button } from "reactstrap";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Filtrar Por Nombre/Usuario"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const columns = [
  {
    name: "ID",
    selector: (row) => row.idUsuario,
    sortable: true,
    width: "80px",
  },
  {
    name: "Nombre",
    selector: (row) => `${row.nombre} ${row.apellido}`,
    sortable: true,
  },
  {
    name: "Usuario",
    selector: (row) => row.user,
    sortable: true,
  },
  {
    name: "Boletos Vendidos",
    selector: (row) => row.cantidadBoletos,
    sortable: true,
    width: "150px",
  },
  {
    name: "Total Ventas",
    selector: (row) => `Bs. ${row.totalVentas.toFixed(2)}`,
    sortable: true,
    width: "150px",
  },
  {
    name: "Estado",
    selector: (row) => row.estado,
    sortable: true,
    width: "100px",
    cell: (row) => (
      <span
        style={{
          color: row.estado === "activo" ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {row.estado}
      </span>
    ),
  },
];

const Lista = (props) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = props.items.filter((item) => {
    const searchText = filterText.toLowerCase();
    return (
      (item.nombre && item.nombre.toLowerCase().includes(searchText)) ||
      (item.apellido && item.apellido.toLowerCase().includes(searchText)) ||
      (item.user && item.user.toLowerCase().includes(searchText))
    );
  });

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  // Calcular totales
  const totalVentas = filteredItems.reduce(
    (sum, item) => sum + item.totalVentas,
    0
  );
  const totalBoletos = filteredItems.reduce(
    (sum, item) => sum + item.cantidadBoletos,
    0
  );

  return (
    <>
      <DataTable
        title="Reporte de Usuarios"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        persistTableHead
      />
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          marginTop: "10px",
        }}
      >
        <h5>Resumen</h5>
        <p>
          <strong>Total Usuarios:</strong> {filteredItems.length}
        </p>
        <p>
          <strong>Total Boletos Vendidos:</strong> {totalBoletos}
        </p>
        <p>
          <strong>Total Ventas:</strong> Bs. {totalVentas.toFixed(2)}
        </p>
      </div>
    </>
  );
};

export default Lista;
