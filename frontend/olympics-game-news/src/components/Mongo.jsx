import React, { useEffect, useState } from "react";
import Publicacion from "./Publicacion.jsx";
import io from "socket.io-client";
import Scrollbars from "react-custom-scrollbars";
import axios from "axios";
import { url } from "../constants/constant";

let socket;

function Mongo() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      socket = io(url);
      axios({
        url: url + "/mongo",
        method: "get",
      })
        .then((response) => {
          socket.emit("mongo", response.data.data.reverse(), setDatos);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);
  }, [datos]);

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
        {datos.map((e, i) => (
          <Publicacion
            key={i}
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
