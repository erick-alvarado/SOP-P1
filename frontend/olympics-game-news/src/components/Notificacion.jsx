import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import axios from "axios";
import { url } from "../constants/constant";

toast.configure();

let socket;

function Notificacion() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      axios({
        url: url + "/subscriber",
        method: "get",
      })
        .then((response) => {
          let data = response.data;
          socket = io(url);
          socket.emit("mongo", data, setDatos);
          data.forEach((e) => {
            let aux = e.msg
              .replaceAll("\\", "")
              .replaceAll("{", "")
              .replaceAll("}", "");
            aux = aux.split(",");
            toast.info(aux[0] + "\n" + aux[1] + "\n" + aux[2] + "\n" + aux[3]);
          });
        })
        .catch((err) => console.log(err));
    }, 1000);
  }, [datos]);

  return <div></div>;
}

export default Notificacion;
