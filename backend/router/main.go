package router

import (
	"getraenkekasse/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/health", handlers.HandleHealthCheck)

	app.Post("/test", handlers.Test)

	//setup user group
	user := app.Group("/user")
	user.Get("/", handlers.GetUser)
	user.Post("/login", handlers.Login)
	user.Post("/new", handlers.CreateUser)

	// setup the todos group
	//todos := app.Group("/todos")
	//todos.Get("/", handlers.HandleAllTodos)
	//todos.Post("/", handlers.HandleCreateTodo)
	//todos.Put("/:id", handlers.HandleUpdateTodo)
	//todos.Get("/:id", handlers.HandleGetOneTodo)
	//todos.Delete("/:id", handlers.HandleDeleteTodo)
}
