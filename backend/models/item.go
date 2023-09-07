package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Item struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	ItemName string             `json:"itemname" bson:"itemname"`
	Stock    int                `json:"stock" bson:"stock"`
	Price    float64            `json:"price" bson:"price"`
}

type CreateItem struct {
	ItemName string  `json:"itemname" bson:"itemname"`
	Stock    int     `json:"stock" bson:"stock"`
	Price    float64 `json:"price" bson:"price"`
}

type JsonItem struct {
	ID string `json:"id" bson:"_id"`
}
