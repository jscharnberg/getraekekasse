package app

import (
	"fmt"
	"getraenkekasse/config"
	"getraenkekasse/database"
	"getraenkekasse/router"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func SetupAndRunApp() error {
	// load env
	err := config.LoadENV()
	if err != nil {
		return err
	}

	// start database
	err = database.StartMongoDB()
	if err != nil {
		return err
	} else {
		fmt.Println("woo")
	}

	// defer closing database
	defer database.CloseMongoDB()

	// create app
	app := fiber.New()

	// attach middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path} ${latency}\n",
	}))

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5175",     // Ursprung, der erlaubt ist (Sie können auch ein Array von Ursprüngen verwenden)
		AllowMethods: "GET,POST,PUT,PATCH,DELETE", // Erlaubte HTTP-Methoden
	}))

	// setup routes
	router.SetupRoutes(app)

	// get the port and start
	port := os.Getenv("PORT")
	app.Listen(":" + port)

	return nil
}
