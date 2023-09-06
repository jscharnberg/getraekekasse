package models

import (
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	FirstName  string             `json:"firstname" bson:"firstname"`
	LastName   string             `json:"lastname" bson:"lastname"`
	UserID     int                `json:"userid" bson:"userid"`
	AccBalance float64            `json:"accbalance" bson:"accbalance"`
}

type CreateUser struct {
	UserID     int     `json:"userid" bson:"userid"`
	FirstName  string  `json:"firstname" bson:"firstname"`
	LastName   string  `json:"lastname" bson:"lastname"`
	AccBalance float64 `json:"accbalance" bson:"accbalance"`
}

type LoginUser struct {
	UserID int `json:"userid" bson:"userid"`
	jwt.StandardClaims
}
