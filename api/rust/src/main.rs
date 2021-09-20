#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
extern crate gcp_pubsub;
extern crate goauth;

use rocket_contrib::json::Json;
use std::env;
use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime};
use std::thread::sleep;
use mongodb::{bson::doc, sync::Client};

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
static mut Pub_mongo : PubSub = PubSub{
  guardados : 0,
  api : String::new(),
  tiempoDeCarga: 0,
  bd : String::new(),
};




unsafe fn lol(){
  let sys_time = SystemTime::now();
  let one_sec = Duration::from_secs(20);
  sleep(one_sec);
  let new_sys_time = SystemTime::now();
  let difference = new_sys_time.duration_since(sys_time)
  .expect("Clock may have gone backwards");
  Pub_mysql.tiempoDeCarga = difference.as_secs();
  println!("{} {} {} {}", Pub_mysql.tiempoDeCarga, Pub_mysql.guardados, Pub_mysql.api, Pub_mysql.bd);
}


#[get("/")]
  fn index() -> &'static str {
      "Bienvenido API Rust"
  }

  #[get("/iniciarCarga")]
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
      Pub_mysql = pm;
      Pub_mongo = pc;
    }
    "Carga Iniciada"
  }

  #[get("/finalizarCarga")]
  fn finalizar_carga() -> &'static str {
    unsafe{
      println!("{},{},{},{}",Pub_mysql.api,Pub_mysql.bd,Pub_mysql.tiempoDeCarga,Pub_mysql.guardados);
    }
    unsafe{
      println!("{},{},{},{}",Pub_mongo.api,Pub_mongo.bd,Pub_mongo.tiempoDeCarga,Pub_mongo.guardados);
    }
    
    unsafe{
      let google_credentials = env::var("GOOGLE_APPLICATION_CREDENTIALS").expect("failed to get MONGODB_URL");
      let topic_name = env::var("TOPIC").expect("failed to get MONGODB_URL");
      let credentials = goauth::credentials::Credentials::from_file(&google_credentials).unwrap();
      let mut client = gcp_pubsub::Client::new(credentials);
      let topic = client.topic(&topic_name);
      let serialized_user = serde_json::to_string(&Pub_mysql).unwrap();
      let result = topic.publish(serialized_user);
      let serialized_user2 = serde_json::to_string(&Pub_mongo).unwrap();
      let result2 = topic.publish(serialized_user2);
    }

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
      Pub_mysql = pm;
      Pub_mongo = pc;
    }
    "Carga Finalizada"
  }

  #[post("/publicar", format="json", data = "<json>")]
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
      Pub_mysql.tiempoDeCarga = Pub_mysql.tiempoDeCarga + difference.as_secs();
      Pub_mysql.guardados = Pub_mysql.guardados +1;
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
      Pub_mongo.tiempoDeCarga = Pub_mongo.tiempoDeCarga + difference2.as_secs();
      Pub_mongo.guardados = Pub_mongo.guardados +1;
    }
  }

fn main(){
  dotenv().expect(".env file not found");
  
  
  rocket::ignite().mount("/endpoint/rust",routes![index, iniciar_carga, finalizar_carga, publicar],).launch();   
}