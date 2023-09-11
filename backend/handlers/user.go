package handlers

import (
	"context"
	"fmt"
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"
	"net/http"
	"reflect"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
		"_id":        foundUser.ID,
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

func UpdateUser(c *fiber.Ctx) error {
	// Holen Sie die ID der Ressource aus dem URL-Parameter
	id := c.Params("id")

	//Konvertieren Sie die ID in ein BSON-Objekt
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Ungültige ID",
		})
	}

	// Dekodieren Sie den JSON-Body der Anfrage in eine Datenstruktur
	var requestBody struct {
		FirstName  string  `json:"firstname" bson:"firstname"`
		LastName   string  `json:"lastname" bson:"lastname"`
		UserID     int     `json:"userid" bson:"userid"`
		AccBalance float64 `json:"accbalance" bson:"accbalance"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Ungültige Anfrage",
		})
	}

	// Holen Sie die zu aktualisierende Ressource aus der Datenbank
	coll := database.GetCollection("user")

	filter := bson.M{"_id": objID}
	update := bson.M{}

	// Aktualisieren Sie die Felder basierend auf den Werten im requestBody
	if requestBody.FirstName != "" {
		update["firstname"] = requestBody.FirstName
	}
	if requestBody.LastName != "" {
		update["lastname"] = requestBody.LastName
	}
	if requestBody.UserID != 0 {
		update["userid"] = requestBody.UserID
	}
	if requestBody.AccBalance != 0 {
		update["accbalance"] = requestBody.AccBalance
	}

	updateData := bson.M{"$set": update}
	_, err = coll.UpdateOne(context.TODO(), filter, updateData)
	if err != nil {
		fmt.Println(err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Fehler beim Aktualisieren der Ressource",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Ressource erfolgreich aktualisiert",
	})
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
