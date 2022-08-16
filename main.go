package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Spinner struct {
	Key     string `gorm:"primary_key" json:"key"`
	Name    string `json:"name"`
	Twitter string `json:"twitter"`
	Youtube string `json:"youtube"`
	Board   string `json:"board"`
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
	name := strings.ToLower(p.ByName("name"))
	var spinner Spinner
	db.First(&spinner, "key = ?", name)
	json, err := json.Marshal(spinner)
	if err != nil {
		panic(err)
	}
	log.Println("Requested spinner", name)
	fmt.Fprint(w, string(json))
}

func EditSpinner(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	db := InitDB()
	name := strings.ToLower(p.ByName("name"))
	var spinner Spinner
	db.First(&spinner, "key = ?", name)
	twitter := r.FormValue("twitter")
	youtube := r.FormValue("youtube")
	board := r.FormValue("board")
	if twitter != "" {
		db.Model(&spinner).Where("key = ?", name).Update("twitter", twitter)
	}
	if youtube != "" {
		db.Model(&spinner).Where("key = ?", name).Update("youtube", youtube)
	}
	if board != "" {
		db.Model(&spinner).Where("key = ?", name).Update("board", board)
	}
	log.Printf("Updated spinner %s with twitter %s and youtube %s and board %s", name, twitter, youtube, board)
}

func AddSpinner(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	db := InitDB()
	name := r.FormValue("name")
	key := strings.ToLower(name)
	twitter := r.FormValue("twitter")
	youtube := r.FormValue("youtube")
	board := r.FormValue("board")
	db.Create(&Spinner{Key: key, Name: name, Twitter: twitter, Youtube: youtube, Board: board})
	log.Printf("Added spinner %s with twitter %s and youtube %s", name, twitter, youtube)
}

func main() {
	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}
	port := os.Getenv("PORT")
	router := httprouter.New()
	router.GET("/api/spinner/:name", GetSpinner)
	router.PATCH("/api/edit/:name", EditSpinner)
	router.POST("/api/add", AddSpinner)
	log.Println("Listening on port", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
