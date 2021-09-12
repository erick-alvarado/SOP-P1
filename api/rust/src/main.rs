#[macro_use] extern crate rocket;


#[get("/endpoint/rust")]
fn index() -> &'static str {
   "API Rust"
}

#[get("/endpoint/rust/iniciarCarga")]
fn iniciar_carga() -> &'static str {
   "carga iniciada"
}

#[get("/endpoint/rust/publicar")]
fn publicar() -> &'static str {
   "publicando"
}

#[get("/endpoint/rust/finalizarCarga")]
fn finalizar_carga() -> &'static str {
   "carga finalizada"
}


#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, iniciar_carga, publicar, finalizar_carga])
}