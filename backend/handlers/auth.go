package handlers

import (
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func Login(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}

	var foundUser models.User

	coll := database.GetCollection("user")

	err := coll.FindOne(c.Context(),
		bson.M{"userid": user.UserID}).Decode(&foundUser)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "User was not found"})
	}

	token, err := helpers.GenerateUserTokens(*&foundUser.UserID)

	return c.Status(200).JSON(&fiber.Map{
		"token": token,
	})
}

func AdminLogin(c *fiber.Ctx) error {
	var admin models.Admin
	if err := c.BodyParser(&admin); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}

	var foundAdmin models.Admin

	coll := database.GetCollection("admin")

	err := coll.FindOne(c.Context(),
		bson.M{"username": admin.Username}).Decode(&foundAdmin)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Benutzer nicht gefunden",
		})
	}

	isVerified := helpers.Verify(foundAdmin.Password, admin.Password)

	if !isVerified {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Falsches Passwort",
		})
	}

	token, err := helpers.GenerateAdminTokens(foundAdmin.Username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Fehler beim Generieren des Tokens",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": token,
	})
}
