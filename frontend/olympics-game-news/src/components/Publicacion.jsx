import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Button, Image } from "react-bootstrap";

function Publicacion(props) {
  return (
    <Container>
      <br />
      <Card style={{ width: "40rem", marginRight: "auto", marginLeft: "auto" }}>
        <Card.Body>
          <Card.Title style={{ display: "inline-flex" }}>
            <Image
              src="https://randomuser.me/api/portraits/men/40.jpg"
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
              Gerber Colindres
              <br />
              <h5 style={{ color: "#959595" }}>#remo, #Atletismo, #noticia</h5>
            </div>
          </Card.Title>
          <Card.Text>
            <h2>Hoy se iniciaron las olimpiadas.</h2>
            <h5 style={{ color: "#959595" }}>12:00 PM · Jun 1, 2021</h5>
          </Card.Text>
        </Card.Body>
        <Card.Footer style={{ backgroundColor: "#ffffff" }}>
          <Button variant="light" style={{ display: "inline-flex" }}>
            <b>100</b>{" "}
            <div style={{ color: "#959595", marginLeft: "5px" }}>upvotes</div>
          </Button>

          <Button variant="light" style={{ display: "inline-flex" }}>
            <b>30</b>{" "}
            <div style={{ color: "#959595", marginLeft: "5px" }}>downvotes</div>
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Publicacion;
