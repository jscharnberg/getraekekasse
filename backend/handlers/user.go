package handlers

import (
	"fmt"
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

type jwt struct {
	Token string `json:"token"`
}

func GetSpecUser(c *fiber.Ctx) error {
	var json jwt

	if err := c.BodyParser(&json); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}
	userID := helpers.DecodeToken()

	var foundUser models.User

	coll := database.GetCollection("user")

	err := coll.FindOne(c.Context(), bson.M{"userid": userID}).Decode(&foundUser)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "User was not found"})
	}

	return c.JSON(&fiber.Map{
		"userid":     foundUser.UserID,
		"firstname":  foundUser.FirstName,
		"lastname":   foundUser.LastName,
		"accbalance": foundUser.AccBalance,
	})
}

func CreateUser(c *fiber.Ctx) error {
	var person models.CreateUser
	if err := c.BodyParser(&person); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}

	//person.Username = fmt.Sprintf("%f %l", person.FirstName, person.LastName)
	usernameWithoutSpace := strings.ToLower(person.FirstName + person.LastName)
	fmt.Println(usernameWithoutSpace)
	coll := database.GetCollection("user")

	res, err := coll.InsertOne(c.Context(), person)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"internal server error": err.Error()})
	}

	// return the inserted todo
	return c.Status(200).JSON(fiber.Map{"inserted_id": res.InsertedID})
}
