package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Spinner struct {
	Name    string
	Twitter string
	Youtube string
}

func InitDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("spinners.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return db
}

func GetSpinner(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	db := InitDB()
	name := p.ByName("name")
	var spinner Spinner
	db.Where("name = ?", name).First(&spinner)
	log.Println(spinner.Name, spinner.Twitter, spinner.Youtube)
	json, err := json.Marshal(spinner)
	if err != nil {
		panic(err)
	}
	log.Println("Requested spinner", name)
	fmt.Fprint(w, string(json))
}

func main() {
	router := httprouter.New()
	router.GET("/spinner/:name", GetSpinner)
	log.Println("Listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
