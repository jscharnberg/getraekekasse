package handlers

import "github.com/gofiber/fiber/v2"

// @Summary Show the status of server.
// @Description get the status of server.
// @Tags test
// @Accept */*
// @Produce plain
// @Success 200 "OK"
// @Router /test [get]
func Test(c *fiber.Ctx) error {
	return c.SendString("test")
}
