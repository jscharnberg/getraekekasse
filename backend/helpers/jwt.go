package helpers

import (
	"fmt"
	"getraenkekasse/models"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateUserTokens(userId int) (signedToken string, err error) {
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

func GenerateAdminTokens(username string) (signedToken string, err error) {
	claims := &models.LoginAdmin{
		Username: username,
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

func DecodeUserToken(tokenString string) (userID float64) {
	// Das JWT-Token parsen und verifizieren
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Hier sollte dein geheimer Schlüssel stehen, der für die Verifizierung des Tokens verwendet wird.
		// Dieser Schlüssel sollte sicher aufbewahrt werden und nicht öffentlich verfügbar sein.
		// Du solltest den Schlüssel sicher speichern und nicht hart kodiert im Code haben.
		secretKey := []byte("SECRET_KEY")

		return secretKey, nil
	})

	if err != nil {
		fmt.Println("Fehler beim Parsen des JWT-Tokens:", err)
		return
	}

	// Überprüfe, ob das Token gültig ist
	if !token.Valid {
		fmt.Println("Ungültiges JWT-Token")
		return
	}

	// Zugriff auf die Claims aus dem Token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("Fehler beim Zugriff auf die Claims")
		return
	}

	// Zugriff auf spezifische Claims
	userID, ok = claims["userid"].(float64)
	if !ok {
		fmt.Println("Fehler beim Zugriff auf UserID")
		return
	}

	return userID
}

func DecodeAdminToken(tokenString string) (username string) {
	// Das JWT-Token parsen und verifizieren
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Hier sollte dein geheimer Schlüssel stehen, der für die Verifizierung des Tokens verwendet wird.
		// Dieser Schlüssel sollte sicher aufbewahrt werden und nicht öffentlich verfügbar sein.
		// Du solltest den Schlüssel sicher speichern und nicht hart kodiert im Code haben.
		secretKey := []byte("SECRET_KEY")

		return secretKey, nil
	})

	if err != nil {
		fmt.Println("Fehler beim Parsen des JWT-Tokens:", err)
		return
	}

	// Überprüfe, ob das Token gültig ist
	if !token.Valid {
		fmt.Println("Ungültiges JWT-Token")
		return
	}

	// Zugriff auf die Claims aus dem Token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("Fehler beim Zugriff auf die Claims")
		return
	}

	// Zugriff auf spezifische Claims
	username, ok = claims["username"].(string)
	if !ok {
		fmt.Println("Fehler beim Zugriff auf UserID")
		return
	}

	return username
}
