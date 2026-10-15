package services

import (
	"errors"
	"strings"

	"practica7-go-fiber/internal/models"
)

var ErrProductoNoEncontrado = errors.New("producto no encontrado")
var ErrProductoInvalido = errors.New("producto invalido")

type ProductoService struct {
	productos []models.Producto
	siguiente int
}

func NewProductoService() *ProductoService {
	return &ProductoService{
		productos: []models.Producto{
			{ID: 1, Nombre: "Teclado", Precio: 120.50},
			{ID: 2, Nombre: "Mouse", Precio: 75.00},
		},
		siguiente: 3,
	}
}

func (s *ProductoService) Listar() []models.Producto {
	resultado := make([]models.Producto, len(s.productos))
	copy(resultado, s.productos)
	return resultado
}

func (s *ProductoService) BuscarPorID(id int) (models.Producto, error) {
	for _, producto := range s.productos {
		if producto.ID == id {
			return producto, nil
		}
	}
	return models.Producto{}, ErrProductoNoEncontrado
}

func (s *ProductoService) Crear(nombre string, precio float64) (models.Producto, error) {
	nombre = strings.TrimSpace(nombre)
	if nombre == "" || precio <= 0 {
		return models.Producto{}, ErrProductoInvalido
	}

	producto := models.Producto{
		ID:     s.siguiente,
		Nombre: nombre,
		Precio: precio,
	}
	s.productos = append(s.productos, producto)
	s.siguiente++
	return producto, nil
}
