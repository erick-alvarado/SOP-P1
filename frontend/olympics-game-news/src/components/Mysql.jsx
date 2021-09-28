import React, { useEffect, useState } from "react";
import Publicacion from "./Publicacion.jsx";
import io from "socket.io-client";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars";

let socket;
const url = "http://localhost:4000";

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
          data.forEach((element) => {
            if (lista.length === 0) {
              lista.push({
                id_publicacion: element.id_publicacion,
                nombre: element.nombre,
                comentario: element.comentario,
                fecha: element.fecha,
                upvotes: element.upvotes,
                downvotes: element.downvotes,
                hashtags: [element.hashtags],
              });
            } else {
              lista.forEach((e) => {
                if (e.id_publicacion === element.id_publicacion) {
                  e.hashtags.push(element.hashtags);
                } else {
                  lista.push({
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
            }
          });
          socket = io(url);
          socket.emit("mysql", lista, setDatos);
        })
        .catch();
    }, 1000);
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
            id={random(1, 99)}
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

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default Mysql;
