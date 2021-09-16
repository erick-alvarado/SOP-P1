use std::env;
use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;


fn main(){
    dotenv().expect(".env file not found");
    let mysql_host = env::var("HOST_MYSQL").unwrap();
    let mysql_user = env::var("USER_MYSQL").unwrap();
    let mysql_pass = env::var("PASS_MYSQL").unwrap();
    let mysql_daba = env::var("DABA_MYSQL").unwrap();
    let mysql_port = env::var("PORT_MYSQL").unwrap();
    let mysql_connection = format!("mysql://{}:{}@{}:{}/{}",mysql_user,mysql_pass,mysql_host,mysql_port,mysql_daba);

    

    let opts = Opts::from_url(&mysql_connection.to_owned()).unwrap();
    let pool = Pool::new(opts).unwrap();
    let mut conn = pool.get_conn().unwrap();

    conn.query_iter("select id_hashtag, tag from Hashtag")
  .unwrap()
  .for_each(|row| {
    let r:(i32, String) = from_row(row.unwrap());
    println!("{}, {}", r.0, r.1, );
  });
    
}