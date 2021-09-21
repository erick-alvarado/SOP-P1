import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Button, Image } from "react-bootstrap";

function Publicacion(props) {
  const publicacion = {
    perfil: props.id,
    nombre: props.nombre,
    comentario: props.comentario,
    fecha: props.fecha,
    hora: props.hora,
    hashtags: props.hashtags,
    upvotes: props.upvotes,
    downvotes: props.downvotes,
  };
  return (
    <Container>
      <Card style={{ width: "40rem", marginRight: "auto", marginLeft: "auto" }}>
        <Card.Body>
          <Card.Title style={{ display: "inline-flex" }}>
            <Image
              src={`https://randomuser.me/api/portraits/men/${publicacion.perfil}.jpg`}
              roundedCircle
              style={{ width: "75px", height: "75px" }}
            />
            <div
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                marginLeft: "10px",
              }}
            >
              {publicacion.nombre}
              <br />
              <h5 style={{ color: "#959595" }}>
                {publicacion.hashtags.map((e) => "#" + e + " ")}
              </h5>
            </div>
          </Card.Title>
          <Card.Text>
            <h2>{publicacion.comentario}</h2>
            <h5 style={{ color: "#959595" }}>
              {publicacion.hora} · {publicacion.fecha}
            </h5>
          </Card.Text>
        </Card.Body>
        <Card.Footer style={{ backgroundColor: "#ffffff" }}>
          <Button variant="light" style={{ display: "inline-flex" }}>
            <b>{publicacion.upvotes}</b>{" "}
            <div style={{ color: "#959595", marginLeft: "5px" }}>upvotes</div>
          </Button>

          <Button variant="light" style={{ display: "inline-flex" }}>
            <b>{publicacion.downvotes}</b>{" "}
            <div style={{ color: "#959595", marginLeft: "5px" }}>downvotes</div>
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Publicacion;
