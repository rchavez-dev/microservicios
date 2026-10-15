package tests

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func TestMongoDBConTestcontainers(t *testing.T) {
	ctx := context.Background()

	t.Log("1. Creando contenedor temporal de MongoDB...")

	req := testcontainers.ContainerRequest{
		Image:        "mongo:7",
		ExposedPorts: []string{"27017/tcp"},
		WaitingFor: wait.
			ForLog("Waiting for connections").
			WithStartupTimeout(60 * time.Second),
	}

	mongoContainer, err := testcontainers.GenericContainer(
		ctx,
		testcontainers.GenericContainerRequest{
			ContainerRequest: req,
			Started:          true,
		},
	)

	if err != nil {
		t.Fatalf("No se pudo iniciar MongoDB: %v", err)
	}

	// Al finalizar la prueba, Testcontainers elimina el contenedor.
	defer func() {
		t.Log("6. Eliminando contenedor temporal...")

		if err := mongoContainer.Terminate(ctx); err != nil {
			t.Logf("Error eliminando contenedor: %v", err)
		}
	}()

	t.Log("2. Contenedor MongoDB iniciado correctamente")

	host, err := mongoContainer.Host(ctx)
	if err != nil {
		t.Fatalf("No se pudo obtener el host: %v", err)
	}

	port, err := mongoContainer.MappedPort(ctx, "27017")
	if err != nil {
		t.Fatalf("No se pudo obtener el puerto: %v", err)
	}

	uri := fmt.Sprintf(
		"mongodb://%s:%s",
		host,
		port.Port(),
	)

	t.Logf("3. MongoDB disponible temporalmente en %s", uri)

	client, err := mongo.Connect(
		ctx,
		options.Client().ApplyURI(uri),
	)

	if err != nil {
		t.Fatalf("No se pudo conectar a MongoDB: %v", err)
	}

	defer client.Disconnect(ctx)

	t.Log("4. Probando conexión con MongoDB...")

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		t.Fatalf("MongoDB no respondió al Ping: %v", err)
	}

	t.Log("5. MongoDB respondió correctamente ✅")

	/*
		Esta pausa SOLO se activa si ejecutamos:

		SHOW_CONTAINER=1 go test -v ./tests -run TestMongoDBConTestcontainers

		Nos permitirá abrir otra terminal y ejecutar docker ps
		para ver el contenedor temporal mientras la prueba está corriendo.
	*/
	if os.Getenv("SHOW_CONTAINER") == "1" {
		t.Log("MODO DEMOSTRACIÓN: el contenedor permanecerá visible 15 segundos...")
		time.Sleep(15 * time.Second)
	}
}