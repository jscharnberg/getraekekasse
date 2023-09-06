package handlers

import (
	"context"
	"fmt"
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"
	"reflect"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

type jwt struct {
	Token string `json:"token"`
}

func GetSpecUser(c *fiber.Ctx) error {
	jwt := c.Params("jwt")

	userID := helpers.DecodeToken(jwt)

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

	coll := database.GetCollection("user")

	res, err := coll.InsertOne(c.Context(), person)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"internal server error": err.Error()})
	}

	// return the inserted todo
	return c.Status(200).JSON(fiber.Map{"inserted_id": res.InsertedID})
}

func DeleteUser(c *fiber.Ctx) error {
	userIDString := c.Params("id")

	userID, err := strconv.Atoi(userIDString)
	if err != nil {
		fmt.Println("Error during conversion")
	}

	var foundUser models.User

	coll := database.GetCollection("user")

	err = coll.FindOne(c.Context(),
		bson.M{"userid": userID}).Decode(&foundUser)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "User was not found"})
	}

	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)
	res, err := coll.DeleteOne(ctx, bson.M{"_id": foundUser.ID})

	fmt.Println("DeleteOne Result TYPE:", reflect.TypeOf(res))

	if err != nil {
		fmt.Println("DeleteOne() ERROR:", err)
	}

	return c.Status(200).JSON(fiber.Map{"deleted_id": foundUser.ID})
}
