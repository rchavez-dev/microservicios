package app

import (
	"github.com/gofiber/fiber/v2"
	"practica7-go-fiber/internal/handlers"
	"practica7-go-fiber/internal/services"
)

func New() *fiber.App {
	app := fiber.New()
	service := services.NewProductoService()
	handler := handlers.NewProductoHandler(service)

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"estado":   "ok",
			"servicio": "productos",
		})
	})

	api := app.Group("/api")
	api.Get("/productos", handler.Listar)
	api.Get("/productos/:id", handler.Obtener)
	api.Post("/productos", handler.Crear)

	return app
}
 