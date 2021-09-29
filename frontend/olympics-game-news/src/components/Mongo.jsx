import React, { useEffect, useState } from "react";
import Publicacion from "./Publicacion.jsx";
import io from "socket.io-client";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars";

let socket;
const url = "http://localhost:3001";

function Mongo() {
  const [datos, setDatos] = useState([]);

  const getPublicaciones = () => {
    return axios({
      url: url + "/mongo",
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
    setTimeout(function () {
      getPublicaciones()
        .then((data) => {
          socket = io(url);
          socket.emit("mongo", data.reverse(), setDatos);
        })
        .catch();
    });
  });

  return (
    <>
      <Scrollbars
        style={{
          width: "41rem",
          height: "93vh",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        {datos.map((e) => (
          <Publicacion
            id={e.id}
            nombre={e.nombre}
            comentario={e.comentario}
            fecha={e.fecha}
            hashtags={e.hashtags}
            upvotes={e.upvotes}
            downvotes={e.downvotes}
          ></Publicacion>
        ))}
      </Scrollbars>
    </>
  );
}


export default Mongo;
