#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
extern crate gcp_pubsub;
extern crate goauth;
extern crate serde;
extern crate serde_json;

use rocket_contrib::json::Json;
use std::env;
use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime};
use std::thread::sleep;
use mongodb::{bson::doc, sync::Client};
use futures::executor::block_on;
use serde_json::json;

#[derive(Clone, Deserialize, Serialize, Debug)]
struct Publicacion {
  nombre: String,
  comentario: String,
  fecha: String, 
  hashtags: Vec<String>,
  upvotes: i32,
  downvotes: i32
}

#[derive(Clone, Deserialize, Serialize, Debug, Default)]
struct PubSub {
  pub guardados:i32,
  pub api : String,
  pub tiempoDeCarga: u64,
  pub bd: String,
}

static mut PUB_MYSQL : PubSub = PubSub{
  guardados : 0,
  api : String::new(),
  tiempoDeCarga: 0,
  bd : String::new(),
};
static mut PUB_MONGO : PubSub = PubSub{
  guardados : 0,
  api : String::new(),
  tiempoDeCarga: 0,
  bd : String::new(),
};

async fn ps(){
  unsafe{
    let google_credentials = std::env::var("GOOGLE_APPLICATION_CREDENTIALS").unwrap();
    let topic_name = std::env::var("TOPIC").unwrap();
    let credentials = goauth::credentials::Credentials::from_file(&google_credentials).unwrap();
    let mut client = gcp_pubsub::Client::new(credentials);
    println!("Refreshed token: {}", client.refresh_token().is_ok());
    let topic = client.topic(&topic_name);
    let result = topic.publish(PUB_MYSQL.clone()).await;
    println!("Refreshed token: {}", client.refresh_token().is_ok());
    let result2 = topic.publish(PUB_MONGO.clone()).await;
  }
}
#[get("/")]
  fn index() -> &'static str {
      "Bienvenido API Rust"
  }

  #[get("/endpoint/rust/iniciarCarga")]
  fn iniciar_carga() -> &'static str {

    let mut pm : PubSub = PubSub{
      guardados : 0,
      api : String::from("rust"),
      tiempoDeCarga: 0,
      bd : String::from("Google SQL"),
    };
    let mut pc : PubSub = PubSub{
      guardados : 0,
      api : String::from("rust"),
      tiempoDeCarga: 0,
      bd : String::from("Cosmo DB"),
    };
    unsafe{
      PUB_MYSQL = pm;
      PUB_MONGO = pc;
    }
    "Carga Iniciada"
  }

  #[get("/endpoint/rust/finalizarCarga")]
  fn finalizar_carga() -> &'static str {
    
      let future = ps(); // Nothing is printed
      block_on(future);

    let mut pm : PubSub = PubSub{
      guardados : 0,
      api : String::from("rust"),
      tiempoDeCarga: 0, 
      bd : String::from("Google SQL"),
    };
    let mut pc : PubSub = PubSub{
      guardados : 0,
      api : String::from("rust"),
      tiempoDeCarga: 0,
      bd : String::from("Cosmo DB"),
    };
    unsafe{
      PUB_MYSQL = pm;
      PUB_MONGO = pc;
    }
    "Carga Finalizada"
  }

  #[post("/endpoint/rust/publicar", format="json", data = "<json>")]
  fn publicar(json: Json<Publicacion>)  {
    let sys_time = SystemTime::now();
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
    let us = user.clone();

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

    unsafe{
      let new_sys_time = SystemTime::now();
      let difference = new_sys_time.duration_since(sys_time)
      .expect("Clock may have gone backwards");
      println!("{}", difference.as_secs());
      PUB_MYSQL.tiempoDeCarga = PUB_MYSQL.tiempoDeCarga + difference.as_secs();
      PUB_MYSQL.guardados = PUB_MYSQL.guardados +1;
    }

    let sys_time2 = SystemTime::now();
    let conn_string = std::env::var_os("MONGODB_URL").expect("missing environment variable MONGODB_URL").to_str().expect("failed to get MONGODB_URL").to_owned();
    
    let todos_db_name = std::env::var_os("MONGODB_DATABASE").expect("missing environment variable MONGODB_DATABASE").to_str().expect("failed to get MONGODB_DATABASE").to_owned();

    let todos_collection_name = std::env::var_os("MONGODB_COLLECTION").expect("missing environment variable MONGODB_COLLECTION").to_str().expect("failed to get MONGODB_COLLECTION").to_owned();

    let mongo_client = Client::with_uri_str(&*conn_string).expect("failed to create client");
    let todo_coll = mongo_client.database(todos_db_name.as_str()).collection(todos_collection_name.as_str());
    let todo_doc = mongodb::bson::to_bson(&us).expect("struct to BSON conversion failed").as_document().expect("BSON to Document conversion failed").to_owned();
        
    let r = todo_coll.insert_one(todo_doc, None).expect("failed to add todo");

    unsafe{
      let new_sys_time2 = SystemTime::now();
      let difference2 = new_sys_time2.duration_since(sys_time2)
      .expect("Clock may have gone backwards");
      println!("{}", difference2.as_secs());
      PUB_MONGO.tiempoDeCarga = PUB_MONGO.tiempoDeCarga + difference2.as_secs();
      PUB_MONGO.guardados = PUB_MONGO.guardados +1;
    }
  }

fn main(){
  dotenv().expect(".env file not found");
  rocket::ignite().mount("/",routes![index, iniciar_carga, finalizar_carga, publicar],).launch();   
}