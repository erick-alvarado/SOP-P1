#[macro_use] extern crate rocket;


#[get("/")]
fn index() -> &'static str {
   "API Rust"
}

#[get("/iniciarCarga")]
fn iniciar_carga() -> &'static str {
   "carga iniciada"
}

#[get("/publicar")]
fn publicar() -> &'static str {
   "publicando"
}

#[get("/finalizarCarga")]
fn finalizar_carga() -> &'static str {
   "carga finalizada"
}


#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, iniciar_carga, publicar, finalizar_carga])
}