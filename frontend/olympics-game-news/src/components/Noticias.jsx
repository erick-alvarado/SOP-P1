import React, { useEffect, useState } from "react";
import Publicacion from "./Publicacion.jsx";
import { io } from "socket.io-client";
import axios from "axios";

const url = "http://localhost:4000/";

function Noticias() {
  const [datos, setDatos] = useState([]);
  const [socket, setSocket] = useState(null);
  const getPublicaciones = () => {
    return axios({
      url: url + "mongo",
      method: "get",
    })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  };

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  /* useEffect(() => {
    getPublicaciones()
      .then((data) => setDatos(data))
      .catch();
  }); */
  return (
    <>
      {datos.map((e) => (
        <Publicacion
          id={60}
          nombre={e.nombre}
          comentario={e.comentario}
          fecha={"20/09/2021"}
          hora={"13:17"}
          hashtags={e.hashtags}
          upvotes={e.upvotes}
          downvotes={e.downvotes}
        ></Publicacion>
      ))}
    </>
  );
}

export default Noticias;
