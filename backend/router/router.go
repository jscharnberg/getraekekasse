package router

import (
	"getraenkekasse/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {

	app.Get("/health", handlers.HandleHealthCheck)

	//user group
	user := app.Group("/user")
	user.Get("/", handlers.GetAllUsers)
	user.Get("/:jwt", handlers.GetSpecUser)
	user.Post("/login", handlers.Login)
	user.Post("/", handlers.CreateUser)
	user.Patch("/:id", handlers.UpdateUser)
	user.Delete("/:id", handlers.DeleteUser)

	//items group
	items := app.Group("/items")
	items.Get("/", handlers.GetItems)
	items.Get("/:id", handlers.GetSpecItem)
	items.Post("/", handlers.CreateItem)
	items.Patch("/:id", handlers.UpdateItem)
	items.Delete("/:id", handlers.DeleteItem)

	//admin group
	admin := app.Group("/admin")
	admin.Get("/", handlers.GetSpecAdmin)
	admin.Post("/login", handlers.AdminLogin)
	admin.Post("/", handlers.CreateAdmin)
}
