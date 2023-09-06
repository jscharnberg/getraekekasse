package helpers

import (
	"fmt"
	"getraenkekasse/models"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateAllTokens(userId int) (signedToken string, err error) {
	claims := &models.LoginUser{
		UserID: userId,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("SECRET_KEY"))

	if err != nil {
		fmt.Println(err)
		return
	}

	return token, err
}
