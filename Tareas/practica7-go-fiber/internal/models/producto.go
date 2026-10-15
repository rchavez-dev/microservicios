package models

type Producto struct {
	ID     int     `json:"id"`
	Nombre string  `json:"nombre"`
	Precio float64 `json:"precio"`
}

type CrearProductoRequest struct {
	Nombre string  `json:"nombre"`
	Precio float64 `json:"precio"`
}
