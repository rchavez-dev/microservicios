package handlers

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"practica7-go-fiber/internal/models"
	"practica7-go-fiber/internal/services"
)

type ProductoHandler struct {
	service *services.ProductoService
}

func NewProductoHandler(service *services.ProductoService) *ProductoHandler {
	return &ProductoHandler{service: service}
}

func (h *ProductoHandler) Listar(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(h.service.Listar())
}

func (h *ProductoHandler) Obtener(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "id invalido"})
	}

	producto, err := h.service.BuscarPorID(id)
	if errors.Is(err, services.ErrProductoNoEncontrado) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(producto)
}

func (h *ProductoHandler) Crear(c *fiber.Ctx) error {
	var body models.CrearProductoRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "json invalido"})
	}

	producto, err := h.service.Crear(body.Nombre, body.Precio)
	if errors.Is(err, services.ErrProductoInvalido) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(producto)
}
