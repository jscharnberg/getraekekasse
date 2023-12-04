package models

import (
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Admin struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	Username string             `json:"username" bson:"username"`
	Password string             `json:"password" bson:"password"`
}

type CreateAdmin struct {
	Username string `json:"username" bson:"username"`
	Password string `json:"password" bson:"password"`
}

type LoginAdmin struct {
	Username string `json:"username" bson:"username"`
	jwt.StandardClaims
}
