package main

import (
	"log"

	"practica7-go-fiber/internal/app"
)

func main() {
	servidor := app.New()
	log.Fatal(servidor.Listen(":3000"))
}
