package models

import (
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	Username   string             `json:"username" bson:"username"`
	FirstName  string             `json:"firstname" bson:"firstname"`
	LastName   string             `json:"lastname" bson:"lastname"`
	UserID     int                `json:"userid" bson:"userid"`
	AccBalance float32            `json:"accbalance" bson:"accbalance"`
}

type CreateUser struct {
	Username   string  `json:"username" bson:"username"`
	UserID     int     `json:"userid" bson:"userid"`
	FirstName  string  `json:"firstname" bson:"firstname"`
	LastName   string  `json:"lastname" bson:"lastname"`
	AccBalance float32 `json:"accbalance" bson:"accbalance"`
}

type LoginUser struct {
	UserID int `json:"userid" bson:"userid"`
	jwt.StandardClaims
}
