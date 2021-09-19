create database olympics_game_news;

use olympics_game_news;

create table Publicacion(
	id_publicacion int auto_increment,
    nombre varchar(50),
    comentario varchar(250),
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
    foreign key (id_publicacion) references Publicacion(id_publicacion) ON DELETE CASCADE,
    foreign key (id_hashtag) references Hashtag(id_hashtag) ON DELETE CASCADE
);


delimiter //
 
CREATE PROCEDURE split(in cadena TEXT, separador VARCHAR(20), _nombre varchar(50), _comentario varchar(250), _fecha date, _upvotes int, _downvotes int)
BEGIN
 
    DECLARE itemArray TEXT;
    DECLARE i INT;
	
    insert into Publicacion(nombre,comentario,fecha,upvotes,downvotes) values(_nombre,_comentario,_fecha,_upvotes,_downvotes);
    SET @llave = (SELECT LAST_INSERT_ID());
    SET i = 1; # se le puede dar cualquier valor menos 0.
 
    # INTRO BUCLE
 
    WHILE i > 0 DO
 
        SET i = INSTR(cadena,separador); 
        # seteo i a la posicion donde esta el caracter para separar
        # realiza lo mismo que indexOf en javascript
 
        SET itemArray = SUBSTRING(cadena,1,i-1); 
        # esta variable guardara el valor actual del supuesto array
        # se logra cortando desde la posicion 1 que para MySQL es la primera letra (en javascript es 0)
        # hasta la posicion donde se encuentra la cadena a separar -1 ya que sino incluiria el 1er caracter
        # del caracter o cadena de caracteres que hacen de separador
        
        IF i > 0 THEN
        
            SET cadena = SUBSTRING(cadena,i+CHAR_LENGTH(separador),CHAR_LENGTH(cadena));
                
        # corto / preparo la cadena total para la proxima vez que se entre al bucle para eso corto desde la posicion
        # donde esta el caracter separador hasta el tamaño total de la cadena
        # como el separador puede ser de n caracteres en el 2do parametro paso i que es la posicion del separador
        # sumado al tamaño de su cadena 
 
        ELSE
        
        # si el if entra aca es porque i ya vale 0 y no entrara nuevamente al bucle lo cual significa que la 
        # cadena original ya no tiene separadores por ende lo que queda de ella es igual a la ultima posicion
        # del supuesto array
 
            SET itemArray = cadena;
 
        
        END IF;
        
        # he creado una tabla test que tiene como estructura:
        # id int, i int, texto1 text, texto2 text para subir de muestra como cambia el indice (i)
        # y como sube el elemento iterado y por ultimo la cadena original para ver como va mutando
        
		set @existencia = (select count(*) from Hashtag where tag = itemArray);
		if @existencia > 0 then
			set @tag = (select id_hashtag from Hashtag where tag = itemArray);
            insert into Publicacion_Hashtag(id_publicacion, id_hashtag) values(@llave, @tag);
		else
			if itemArray<>"" then
				insert into Hashtag(tag) values(itemArray);
				set @tag = (SELECT LAST_INSERT_ID());
				insert into Publicacion_Hashtag(id_publicacion, id_hashtag) values(@llave, @tag);
            end if;
		end if;
 
    END WHILE;
 
END;
/