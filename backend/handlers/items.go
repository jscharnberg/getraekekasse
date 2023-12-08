package handlers

import (
	"context"
	"fmt"
	"getraenkekasse/database"
	"getraenkekasse/models"
	"net/http"
	"reflect"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetItems(c *fiber.Ctx) error {
	coll := database.GetCollection("items")

	cursor, err := coll.Find(context.Background(), bson.M{})
	if err != nil {
		fmt.Println("Fehler beim Abrufen der Dokumente:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Fehler beim Abrufen der Dokumente",
		})
	}
	defer cursor.Close(context.Background())

	var results []interface{}
	for cursor.Next(context.Background()) {
		var result map[string]interface{}
		if err := cursor.Decode(&result); err != nil {
			fmt.Println(err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "Fehler beim Verarbeiten der Dokumente",
			})
		}
		results = append(results, result)
	}

	if err := cursor.Err(); err != nil {
		fmt.Println(err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Fehler beim Abrufen der Dokumente",
		})
	}

	return c.JSON(results)
}

func GetSpecItem(c *fiber.Ctx) error {
	itemID := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(itemID)
	var foundItem models.Item

	coll := database.GetCollection("items")
	fmt.Println(objID)
	err = coll.FindOne(c.Context(),
		bson.M{"_id": objID}).Decode(&foundItem)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "Item was not found"})
	}

	return c.Status(200).JSON(foundItem)
}

func CreateItem(c *fiber.Ctx) error {
	var item models.CreateItem
	if err := c.BodyParser(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ungültige Anfrage",
		})
	}

	coll := database.GetCollection("items")

	res, err := coll.InsertOne(c.Context(), item)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"internal server error": err.Error()})
	}

	// return the inserted todo
	return c.Status(200).JSON(fiber.Map{"inserted_id": res.InsertedID})
}

func UpdateItem(c *fiber.Ctx) error {
	// Holen Sie die ID der Ressource aus dem URL-Parameter
	id := c.Params("id")

	// Konvertieren Sie die ID in ein BSON-Objekt
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Ungültige ID",
		})
	}
	var foundItem models.Item

	coll := database.GetCollection("items")
	fmt.Println(objID)
	err = coll.FindOne(c.Context(),
		bson.M{"_id": objID}).Decode(&foundItem)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "Item was not found"})
	}

	var requestBody struct {
		ItemName string  `json:"itemname"`
		Stock    int     `json:"stock"`
		Price    float64 `json:"price"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Ungültige Anfrage",
		})
	}

	// Holen Sie die zu aktualisierende Ressource aus der Datenbank
	coll = database.GetCollection("items")

	filter := bson.M{"_id": objID}
	update := bson.M{}

	// Aktualisieren Sie die Felder basierend auf den Werten im requestBody
	if requestBody.ItemName != "" {
		update["itemname"] = requestBody.ItemName
	}
	if requestBody.Stock != 0 {
		update["stock"] = requestBody.Stock
	}
	if requestBody.Price != 0 {
		update["price"] = requestBody.Price
	}

	if foundItem.Stock >= 0 {
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
	} else {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Zu wenige Items im Lager",
		})
	}
}

func DeleteItem(c *fiber.Ctx) error {
	itemIDString := c.Params("id")

	objectID, err := primitive.ObjectIDFromHex(itemIDString)
	if err != nil {
		// Behandle den Fehler, wenn das userID keine gültige ObjectID ist
		return c.JSON(&fiber.Map{"error": "Invalid ObjectID"})
	}

	var foundItem models.Item

	coll := database.GetCollection("items")

	err = coll.FindOne(c.Context(),
		bson.M{"_id": objectID}).Decode(&foundItem)
	if err != nil {
		return c.JSON(&fiber.Map{"error": "Item was not found"})
	}

	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)
	res, err := coll.DeleteOne(ctx, bson.M{"_id": foundItem.ID})

	fmt.Println("DeleteOne Result TYPE:", reflect.TypeOf(res))

	if err != nil {
		fmt.Println("DeleteOne() ERROR:", err)
	}

	return c.Status(200).JSON(fiber.Map{"deleted_id": foundItem.ID})
}
