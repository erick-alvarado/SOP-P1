#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket_contrib::json::Json;
use std::env;
use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime};
use std::thread::sleep;

#[derive(Clone, Deserialize, Serialize, Debug)]
struct Publicacion {
  nombre: String,
  comentario: String,
  fecha: String, 
  hashtags: Vec<String>,
  upvotes: i32,
  downvotes: i32
}

#[derive(Clone, Deserialize, Serialize, Debug)]
struct PubSub {
  guardados:i32,
  api : String,
  tiempoDeCarga: u64,
  bd: String,
}

static mut Pub_mysql : PubSub = PubSub{
  guardados : 0,
  api : String::new(),
  tiempoDeCarga: 0,
  bd : String::new(),
};


/*unsafe fn lol(){
  let sys_time = SystemTime::now();
  let one_sec = Duration::from_secs(20);
  sleep(one_sec);
  let new_sys_time = SystemTime::now();
  let difference = new_sys_time.duration_since(sys_time)
  .expect("Clock may have gone backwards");
  Pub_mysql.tiempoDeCarga = difference.as_secs();
  println!("{} {} {} {}", Pub_mysql.tiempoDeCarga, Pub_mysql.guardados, Pub_mysql.api, Pub_mysql.bd);
}*/

fn main(){
  dotenv().expect(".env file not found");

  #[get("/")]
  fn index() -> &'static str {
      "Bienvenido API Rust"
  }

  #[get("/iniciarCarga")]
  fn iniciar_carga() -> &'static str {
    "Carga Iniciada"
  }

  #[get("/finalizarCarga")]
  fn finalizar_carga() -> &'static str {
    "Carga Finalizada"
  }

  #[post("/publicar", format="json", data = "<json>")]
  fn publicar(json: Json<Publicacion>)  {

    let mysql_host = env::var("HOST_MYSQL").unwrap();
    let mysql_user = env::var("USER_MYSQL").unwrap();
    let mysql_pass = env::var("PASS_MYSQL").unwrap();
    let mysql_daba = env::var("DABA_MYSQL").unwrap();
    let mysql_port = env::var("PORT_MYSQL").unwrap();
    let mysql_connection = format!("mysql://{}:{}@{}:{}/{}",mysql_user,mysql_pass,mysql_host,mysql_port,mysql_daba);

    let opts = Opts::from_url(&mysql_connection.to_owned()).unwrap();
    let pool = Pool::new(opts).unwrap();
    let mut conn = pool.get_conn().unwrap();

    let user = json.into_inner();

    let split: Vec<_> = user.fecha.as_str().split("/").collect();
    let mut fecha_nueva = String::new();
    fecha_nueva.push_str(split[2]);
    fecha_nueva.push('-');
    fecha_nueva.push_str(split[1]);
    fecha_nueva.push('-');
    fecha_nueva.push_str(split[0]);
    let mut hashtags_publi = String::new();
    for hs in user.hashtags{
      hashtags_publi.push_str(hs.as_str());
      hashtags_publi.push(',');
    }

    conn.exec_drop(
      "call split(:cadena, :separador, :_nombre, :_comentario, :_fecha, :_upvotes, :_downvotes) ",
      params! {
          "cadena" => hashtags_publi.trim_end_matches(','),
          "separador" => ",",
          "_nombre" => user.nombre,
          "_comentario" => user.comentario,
          "_fecha" => fecha_nueva,
          "_upvotes" => user.upvotes,
          "_downvotes" => user.downvotes,
      },
    ).unwrap();
  }

  rocket::ignite().mount("/endpoint/rust",routes![index, iniciar_carga, finalizar_carga, publicar],).launch();   
}