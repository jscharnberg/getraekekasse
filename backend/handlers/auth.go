package handlers

import (
	"fmt"
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func Login(c *fiber.Ctx) error {
	fmt.Println("start")
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}

	var foundUser models.User

	coll := database.GetCollection("user")

	err := coll.FindOne(c.Context(), bson.M{"userid": user.UserID}).Decode(&foundUser)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "User was not found"})
	}

	token, err := helpers.GenerateAllTokens(*&foundUser.UserID)

	return c.JSON(&fiber.Map{
		"token": token,
	})
}
