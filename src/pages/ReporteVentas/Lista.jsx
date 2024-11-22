import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import { Button } from "reactstrap";
import { CSVLink } from "react-csv";

const Data = [
  {
    idBoleto: 33,
    fecha: "2024-11-13T15:23:19.000Z",
    nombre: "Rosse",
  },
];

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
      placeholder="Filtrar Por Nombre"
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
    name: "idBoleto",
    selector: (row) => row.idBoleto,
    sortable: true,
  },
  {
    name: "nombre",
    selector: (row) => row.nombre,
    sortable: true,
  },
  {
    name: "fecha",
    selector: (row) => row.fecha.fecha,
    sortable: true,
  },
  {
    name: "total",
    selector: (row) => row.total,
    sortable: true,
  },
  {
    name: "usuario",
    selector: (row) => row.usuario.nombre,
    sortable: true,
  },
];

const Lista = (props) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = props.items.filter(
    (item) =>
      item.nombre &&
      item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );
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
  return (
    <>
      <DataTable
        title="Reporte de Ventas"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        persistTableHead
      />
      {/* <CSVLink data={filteredItems} filename={"reporte-ventas.csv"}>
        Descargar CSV
      </CSVLink> */}
    </>
  );
};

export default Lista;
