package database

import (
	"database/sql"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func GetConnectionMysql() (db *sql.DB, e error) {
	driver := "mysql"
	user := os.Getenv("MYSQL_USER")
	password := os.Getenv("MYSQL_PASSWORD")
	nombre := os.Getenv("MYSQL_NAME")
	host := os.Getenv("MYSQL_HOST")
	conexion, err := sql.Open(driver, user+":"+password+"@tcp("+host+")/"+nombre)
	if err != nil {
		return nil, err
	}
	return conexion, nil
}
