package handlers

import (
	"context"
	"fmt"
	"getraenkekasse/database"
	"getraenkekasse/helpers"
	"getraenkekasse/models"
	"net/http"
	"reflect"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type jwt struct {
	Token string `json:"token"`
}

func GetAllUsers(c *fiber.Ctx) error {
	coll := database.GetCollection("user")

	cursor, err := coll.Find(c.Context(), bson.M{})
	if err != nil {
		return c.JSON(&fiber.Map{"error": "Error finding users"})
	}
	defer cursor.Close(c.Context())

	var users []models.User
	if err := cursor.All(c.Context(), &users); err != nil {
		return c.JSON(&fiber.Map{"error": "Error decoding users"})
	}

	return c.JSON(users)
}

func GetSpecUser(c *fiber.Ctx) error {
	jwt := c.Params("jwt")

	userID := helpers.DecodeUserToken(jwt)

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
	opts := options.FindOne().SetSort(bson.D{{"userid", -1}}) // Sortiert nach userid in absteigender Reihenfolge

	var lastUser models.CreateUser
	if err := coll.FindOne(context.Background(), bson.D{}, opts).Decode(&lastUser); err != nil {
		if err != mongo.ErrNoDocuments {
			return c.Status(500).JSON(fiber.Map{"error": "Datenbankfehler"})
		}
		// Wenn keine Dokumente vorhanden sind, setze die userID auf 0 oder einen Startwert
		lastUser.UserID = 0
	}

	// Inkrementiere die userid für den neuen Benutzer
	person.UserID = lastUser.UserID + 1

	// Füge den neuen Benutzer mit der aktualisierten userid ein
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
	update["accbalance"] = requestBody.AccBalance

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

	// userID, err := strconv.Atoi(userIDString)
	// if err != nil {
	// 	fmt.Println("Error during conversion")
	// }

	objectID, err := primitive.ObjectIDFromHex(userIDString)
	if err != nil {
		// Behandle den Fehler, wenn das userID keine gültige ObjectID ist
		return c.JSON(&fiber.Map{"error": "Invalid ObjectID"})
	}

	var foundUser models.User

	coll := database.GetCollection("user")

	err = coll.FindOne(c.Context(),
		bson.M{"_id": objectID}).Decode(&foundUser)
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
