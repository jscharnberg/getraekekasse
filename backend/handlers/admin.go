package handlers

import (
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

// type jwt struct {
// 	Token string `json:"token"`
// }

func GetSpecAdmin(c *fiber.Ctx) error {
	jwt := c.Params("jwt")

	userID := helpers.DecodeAdminToken(jwt)

	var foundUser models.User

	coll := database.GetCollection("user")

	err := coll.FindOne(c.Context(), bson.M{"userid": userID}).Decode(&foundUser)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "User was not found"})
	}

	return c.JSON(&fiber.Map{
		"_id":        foundUser.ID,
		"userid":     foundUser.UserID,
		"firstname":  foundUser.FirstName,
		"lastname":   foundUser.LastName,
		"accbalance": foundUser.AccBalance,
	})
}

func CreateAdmin(c *fiber.Ctx) error {
	var person models.CreateAdmin
	if err := c.BodyParser(&person); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}

	hashedPassword, err := helpers.Hash(person.Password)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password could not be hashed",
		})
	}

	person.Password = hashedPassword

	coll := database.GetCollection("admin")

	res, err := coll.InsertOne(c.Context(), person)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"internal server error": err.Error()})
	}

	// return the inserted todo
	return c.Status(200).JSON(fiber.Map{"inserted_id": res.InsertedID})
}
