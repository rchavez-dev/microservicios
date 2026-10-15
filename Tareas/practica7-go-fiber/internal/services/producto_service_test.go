package services

import (
	"errors"
	"testing"
)

func TestListarProductos(t *testing.T) {
	service := NewProductoService()
	productos := service.Listar()

	if len(productos) != 2 {
		t.Fatalf("se esperaban 2 productos, se obtuvieron %d", len(productos))
	}
}

func TestCrearProductoValido(t *testing.T) {
	service := NewProductoService()
	producto, err := service.Crear("Monitor", 950)

	if err != nil {
		t.Fatalf("no se esperaba error: %v", err)
	}
	if producto.ID != 3 {
		t.Errorf("se esperaba ID 3, se obtuvo %d", producto.ID)
	}
	if producto.Nombre != "Monitor" {
		t.Errorf("nombre inesperado: %s", producto.Nombre)
	}
}

func TestCrearProductoInvalido(t *testing.T) {
	service := NewProductoService()
	_, err := service.Crear("", -10)

	if !errors.Is(err, ErrProductoInvalido) {
		t.Fatalf("se esperaba ErrProductoInvalido, se obtuvo %v", err)
	}
}

func TestBuscarProductoInexistente(t *testing.T) {
	service := NewProductoService()
	_, err := service.BuscarPorID(999)

	if !errors.Is(err, ErrProductoNoEncontrado) {
		t.Fatalf("se esperaba ErrProductoNoEncontrado, se obtuvo %v", err)
	}
}
 