import React, { useEffect, useState } from "react";
import Publicacion from "./Publicacion.jsx";
import io from "socket.io-client";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars";
import { url } from "../constants/constant";

let socket;

function Mysql() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      axios({
        url: url + "/mysql",
        method: "get",
      })
        .then((response) => {
          let data = response.data.data;
          socket = io(url);
          socket.emit("mysql", data.reverse(), setDatos);
        })
        .catch();
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

export default Mysql;
