package tests

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"practica7-go-fiber/internal/app"
)

func TestHealth(t *testing.T) {
	servidor := app.New()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	resp, err := servidor.Test(req)

	if err != nil {
		t.Fatalf("error ejecutando la peticion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("se esperaba 200, se obtuvo %d", resp.StatusCode)
	}
}

func TestListarProductos(t *testing.T) {
	servidor := app.New()
	req := httptest.NewRequest(http.MethodGet, "/api/productos", nil)
	resp, err := servidor.Test(req)

	if err != nil {
		t.Fatalf("error ejecutando la peticion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("se esperaba 200, se obtuvo %d", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	if !bytes.Contains(body, []byte("Teclado")) {
		t.Fatalf("la respuesta no contiene el producto esperado: %s", string(body))
	}
}

func TestCrearProducto(t *testing.T) {
	servidor := app.New()
	payload := map[string]any{"nombre": "Monitor", "precio": 850.50}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/api/productos", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := servidor.Test(req)

	if err != nil {
		t.Fatalf("error ejecutando la peticion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("se esperaba 201, se obtuvo %d", resp.StatusCode)
	}
}

func TestCrearProductoInvalido(t *testing.T) {
	servidor := app.New()
	body := []byte(`{"nombre":"","precio":0}`)

	req := httptest.NewRequest(http.MethodPost, "/api/productos", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := servidor.Test(req)

	if err != nil {
		t.Fatalf("error ejecutando la peticion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("se esperaba 400, se obtuvo %d", resp.StatusCode)
	}
}

func TestProductoNoEncontrado(t *testing.T) {
	servidor := app.New()
	req := httptest.NewRequest(http.MethodGet, "/api/productos/999", nil)
	resp, err := servidor.Test(req)

	if err != nil {
		t.Fatalf("error ejecutando la peticion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("se esperaba 404, se obtuvo %d", resp.StatusCode)
	}
}
 