create database olympics_game_news;

use olympics_game_news;

create table Publicacion(
	id_publicacion int auto_increment,
    nombre varchar(50),
    fecha date,
    upvotes int,
    downvotes int,
    primary key (id_publicacion)
);

create table Hashtag(
	id_hashtag int auto_increment,
    tag varchar(150),
    primary key (id_hashtag)
);

create table Publicacion_Hashtag(
	id_publicacion int,
    id_hashtag int,
    foreign key (id_publicacion) references Publicacion(id_publicacion),
    foreign key (id_hashtag) references Hashtag(id_hashtag)
);