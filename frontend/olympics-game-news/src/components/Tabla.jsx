import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";

function Tabla(props) {
  const headers = props.headers;
  const data = props.data;

  return (
    <Table striped bordered hover variant="light">
      <thead>
        <tr>
          {headers.map((e, i) => (
            <th key={i}>{e}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((e, i) => (
          <tr key={i}>
            {Object.keys(e).map((k, v) => (
              <td key={v}>{e[k]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Tabla;
