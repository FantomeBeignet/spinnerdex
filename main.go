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
	Name    string `json:"name"`
	Twitter string `json:"twitter"`
	Youtube string `json:"youtube"`
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
	db.Where("name = ?", name).First(&spinner)
	log.Println(spinner.Name, spinner.Twitter, spinner.Youtube)
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
	db.First(&spinner, "name = ?", name)
	twitter := r.FormValue("twitter")
	youtube := r.FormValue("youtube")
	if twitter != "" {
		db.Model(&spinner).Where("name = ?", name).Update("twitter", twitter)
	}
	if youtube != "" {
		db.Model(&spinner).Where("name = ?", name).Update("youtube", youtube)
	}
	log.Printf("Updated spinner %s with twitter %s and youtube %s", name, twitter, youtube)
}

func AddSpinner(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	db := InitDB()
	name := strings.ToLower(r.FormValue("name"))
	twitter := r.FormValue("twitter")
	youtube := r.FormValue("youtube")
	db.Create(&Spinner{Name: name, Twitter: twitter, Youtube: youtube})
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
