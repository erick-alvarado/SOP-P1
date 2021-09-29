import React, { useEffect, useState } from "react";
import Publicacion from "./Publicacion.jsx";
import io from "socket.io-client";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars";

let socket;
const url = "http://localhost:3001";

function Mysql() {
  const [datos, setDatos] = useState([]);
  const getPublicaciones = () => {
    return axios({
      url: url + "/mysql",
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
          let lista = [];
          let key = false;
          data.forEach((element) => {
            lista.forEach((e) => {
              if (e.id_publicacion === element.id_publicacion) {
                e.hashtags.push(element.hashtags);
                key = true;
              }
            });
            if (key) {
              key = false;
            } else {
              lista.push({
                id: element.id,
                id_publicacion: element.id_publicacion,
                nombre: element.nombre,
                comentario: element.comentario,
                fecha: element.fecha,
                upvotes: element.upvotes,
                downvotes: element.downvotes,
                hashtags: [element.hashtags],
              });
            }
          });
          socket = io(url);
          socket.emit("mysql", lista.reverse(), setDatos);
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
        {datos.map((e, i) => (
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

export default Mysql;
