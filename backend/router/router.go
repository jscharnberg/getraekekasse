package router

import (
	"getraenkekasse/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {

	app.Get("/health", handlers.HandleHealthCheck)

	app.Post("/test", handlers.Test)

	//user group
	user := app.Group("/user")
	user.Get("/:jwt", handlers.GetSpecUser)
	user.Post("/login", handlers.Login)
	user.Post("/new", handlers.CreateUser)
	user.Patch("/update/:id", handlers.UpdateUser)
	user.Delete("/delete/:id", handlers.DeleteUser)

	//items group
	items := app.Group("/items")
	items.Get("/", handlers.GetItems)
	items.Get("/:id", handlers.GetSpecItem)
	items.Post("/new", handlers.CreateItem)
	items.Patch("/update/:id", handlers.UpdateItem)

	//todos.Put("/:id", handlers.HandleUpdateTodo)
}
