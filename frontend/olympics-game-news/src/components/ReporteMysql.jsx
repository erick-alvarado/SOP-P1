/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import GraficaCircular from "./GraficaCircular";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import Tabla from "./Tabla";
import { url } from "../constants/constant";
import Barra from "./Barra";

let socket;

const ReporteMysql = () => {
  const [ultimos, setUltimos] = useState([]);
  const [noticias, setNoticias] = useState(0);
  const [hashtags, setHastags] = useState(0);
  const [upVotes, setUpvotes] = useState(0);
  const [labels, setLabels] = useState([]);
  const [dataTop, setDataTop] = useState([]);
  const [labelFecha, setLabelFecha] = useState([]);
  const [conteoUpvotes, setConteoUpvotes] = useState([]);
  const [conteoDownvotes, setConteoDownvotes] = useState([]);

  useEffect(
    () => {
      setTimeout(() => {
        socket = io(url);
        axios({
          url: url + "/mysql/consulta1",
          method: "get",
        })
          .then((response) => {
            let data = response.data.data;
            if (data.lenght !== 0) {
              socket.emit("mysql", data[0].noticias, setNoticias);
              socket.emit("mysql", data[0].hashtags, setHastags);
              socket.emit("mysql", data[0].upvotes, setUpvotes);
            }
          })
          .catch((err) => console.log(err));

        axios({
          url: url + "/mysql/consulta2",
          method: "get",
        })
          .then((response) => {
            let data = response.data.data;
            let labels = [];
            let datos = [];
            data.forEach((element) => {
              labels.push(element.tag);
              datos.push(element.total);
            });
            socket.emit("mysql", labels, setLabels);
            socket.emit("mysql", datos, setDataTop);
          })
          .catch((err) => console.log(err));

        axios({
          url: url + "/mysql/ultimos",
          method: "get",
        })
          .then((response) => {
            let data = response.data.data;
            socket.emit("mysql", data, setUltimos);
          })
          .catch((err) => console.log(err));

        axios({
          url: url + "/mysql/votos",
          method: "get",
        })
          .then((response) => {
            let data = response.data.data;
            let labelTemp = [];
            let upvotesTemp = [];
            let downvotesTemp = [];
            data.forEach((e) => {
              labelTemp.push(e.fecha);
              upvotesTemp.push(e.upvotes);
              downvotesTemp.push(e.downvotes);
            });
            socket.emit("mysql", labelTemp, setLabelFecha);
            socket.emit("mysql", upvotesTemp, setConteoUpvotes);
            socket.emit("mysql", downvotesTemp, setConteoDownvotes);
          })
          .catch((err) => console.log(err));
      }, 1000);
    },
    [ultimos],
    [noticias],
    [hashtags],
    [upVotes],
    [labels],
    [dataTop],
    [labelFecha],
    [conteoUpvotes],
    [conteoDownvotes]
  );
  return (
    <div>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@200;400&display=swap');
      </style>
      <div style={{ fontFamily: ["Fira Sans", "sans-seri"] }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "400px",
              height: "200px",
              padding: "20px",
              textAlign: "center",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <h1>NOTICIAS</h1>
            <div
              style={{
                display: "inline-flex",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              <h2
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                {noticias}
              </h2>
              <Image
                src={
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAADU1NSSkpLm5uawsLBERERAQEAiIiIoKChYWFhRUVFiYmJubm4RERH39/fDw8OpqakdHR3d3d2FhYXh4eF0dHRnZ2e9vb0qKirt7e2urq63t7cjIyNzc3OZmZmIiIjLy8s3NzcXFxehoaExMTH2vGmtAAAFDklEQVR4nO2da1viMBBGU8FbEasu4BUUxf//F3dZkoCRbJnJlM647/lKO+l5aJp0cqlzAAAAAAAAAAAAAAAAAAAAAAAAAADg6DTTEyVMmy78HurrSg3X9YO033Let1TK44mo4GnfPvs4FRR86FtmPzdigsO+VXI8SRmO+zbJMRMSbPoWySP0J8bHzOz5VAXPs3BFLzKGIZ7ks6uQZ39JE5lwtQ8nE02E5tLfVTLhzjbR5jLRZDjfXNOVTDRveCETTQYY0oBhH8CQBgz7AIY0YNgHMKQBwz6AIQ0Y9sH/Zzg4v1zzOFrcMrJTGcOX2ZjB6vugynLRflqa/E0Mb6odBkKGrxWPURr+6aDTklGKxPDrqMOZjCFTsKqmSfib9lP+cEswrN77NUzHjDowrF5/vOEHbQjVgOEyPZw2LNWx4a+DzkouOW0tXu7rv3z6w980GbrB/K6VNH2fa/Gf7jY/0JLhXRu6pp30lJwhL93fuSGDnGG45d9I0SwZhn4IbdjNkuGVL2RIimbJ0JdB7NQYMlz6MojjioYMB74M4owpQ4bvvoy0d9+CHcMwa+SDGM2OYejiUof37RhOfBHUSSh2DEM1pKZqzBhOq71X2o4ZwxdfAnkekRnDhS+BPHnLimETXn9pnVJnxzBUQ2qmzY7hrS+APtnNiuG9L4A+JbNrw5urupX0qvcZhgKIndLuDQ+bRf7vrP6aE3/kJ1nQQr50zcofOf6xhv4yOTOjbRjG+fbk1lDc8Fc3hstwJF0wY8hdhHGXZnen7edUrVl95978gZyp35kx4NnHNYP6+7N8dUCgdFz3u2GohpwVBRbG8bdtDmeRiQnDsPjskhPNhGFIYLBWYJgwDG9OrIU9FgxjNWS0hjYMw0Io+rvhGguGoXVmdEqdDcNwk/KW6xkwjLMd0i7hYRgwDAmMO140A4Yjb3jPi6bfsAnbPTCXueo3DAkMXmtowTAM/XIX8uo3DNWQuyxYvWGcg/vMjKbeMOZBmNVQv2FIYDxyN+ZRbxiGfhfcaDnDt/ZkvBjptOZdw+JqmDPkTtbnkcwB2jUMQ7/MTmnecLLvQjojSbbtGoZ9OxgDFkYMwyHMTql+w/jmxN97RblhXInAroY6njTJy/uOYdhcpmB3mVxrMRkdj3xWvwk7yfGrofIWP745sVtD7YaxsnA7pU67YaiG1wXRVBvGoV92p9QpN1wGw9v2k7KoNowJDPosmi2qDcOb02fJpq2KDe8FOqVOteE4JjBKqqFmw0XsHPM7pU614cgvNyzcEFCxYaRs+wgLhgWdUmfDsKgamjAsi2bAsHAXFwOGRa2hCcOSTqmzYEhdb5iSMWzG88tjMc/sqeDhzaJpNRxUxyRJhn41LKyGmvOlnrLW0IAhe9zQjGHxnmbqDUurYc5wte9COmP/+OGG4rViufZwcMSsfvo3fTEsFVTf4tfF0bQbFldD9YalraF+w/Joyg2LMqUblBuuyqMpNyyvhsoNv632Y6DbUKAaKjcUqIbKDSU2MFBtOJf42KNqw/JOqVNuWN4pdcoNRfYRUfzNLqFPpWn+D0Wqocovy10ItobblBNxk+wuEZlFsyXOFK8HSohTSs9FBDV/pVPqtjpuZpQAcev1PI2i71V/QeDV0LPsW2U/coJKFZeCgs4N6/YSj0st9kHnwMnk/aK93OPweDaRvEO3PA2VIPUIBQAAAAAAAAAAAAAAAAAAAAAAAAAAAPxAfgNIDm9gBlBoUQAAAABJRU5ErkJggg=="
                }
                roundedCircle
                style={{ width: "75px", height: "75px" }}
              />
            </div>
          </div>
          <div
            style={{
              width: "400px",
              height: "200px",
              padding: "20px",
              textAlign: "center",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <h1>HASHTAGS</h1>
            <div
              style={{
                display: "inline-flex",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              <h2
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  paddingRight: "15px",
                }}
              >
                {hashtags}
              </h2>
              <Image
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB_okFMf6Igj52x6EboRttVEXEihUYj2kofw&usqp=CAU"
                }
                style={{ width: "55px", height: "55px" }}
              />
            </div>
          </div>
          <div
            style={{
              width: "400px",
              height: "200px",
              padding: "20px",
              textAlign: "center",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <h1>UPVOTES</h1>
            <div
              style={{
                display: "inline-flex",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              <h2
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  paddingRight: "15px",
                }}
              >
                {upVotes}
              </h2>
              <Image
                src={"https://image.flaticon.com/icons/png/512/59/59518.png"}
                style={{ width: "60px", height: "60px" }}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "400px",
              height: "400px",
              padding: "20px",
              textAlign: "center",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <h1>TOP HASHTAGS</h1>
            <GraficaCircular
              label={labels}
              data={dataTop}
              color={[
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(25, 205, 86)",
                "rgb(255, 153, 255)",
              ]}
            />
          </div>
          <div
            style={{
              width: "850px",
              height: "600px",
              padding: "20px",
              textAlign: "center",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <h1>VOTOS POR DIA</h1>
            <Barra
              label={labelFecha}
              upvote={conteoUpvotes}
              downvote={conteoDownvotes}
            />
          </div>
        </div>
        <div
          style={{
            width: "1000px",
            height: "400px",
            padding: "20px",
            textAlign: "center",
            marginRight: "auto",
            marginLeft: "auto",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <Tabla
            headers={["Nombre", "Fecha", "Comentario", "Hashtags"]}
            data={ultimos}
          ></Tabla>
        </div>
      </div>
    </div>
  );
};

export default ReporteMysql;
