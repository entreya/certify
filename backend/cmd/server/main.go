package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	mux.HandleFunc("GET /oauth/google", func(w http.ResponseWriter, r *http.Request) {
		clientID := os.Getenv("GOOGLE_CLIENT_ID")
		redirectURI := os.Getenv("GOOGLE_REDIRECT_URL")
		state := "KLOP"
		googleLoginURL := fmt.Sprintf(
			"https://accounts.google.com/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=openid%%20email%%20profile&state=%s",
			clientID, redirectURI, state,
		)
		// User ko Google ke page par redirect kar do
		http.Redirect(w, r, googleLoginURL, http.StatusTemporaryRedirect)

	})

	mux.HandleFunc("GET /oauth/google/callback", func(w http.ResponseWriter, r *http.Request) {
		errorCode := r.URL.Query().Get("error")
		if errorCode == "access_denied" {
			frontendURL := os.Getenv("FRONTEND_URL") // e.g. "http://localhost:5173"
			http.Redirect(w, r, frontendURL+"?error=access_denied", http.StatusTemporaryRedirect)
			return
		}

		code := r.URL.Query().Get("code")
		if code == "" {
			http.Error(w, "Code not found", http.StatusBadRequest)
			return
		}

		formData := url.Values{}
		formData.Set("code", code)
		formData.Set("client_id", os.Getenv("GOOGLE_CLIENT_ID"))
		formData.Set("client_secret", os.Getenv("GOOGLE_CLIENT_SECRET"))
		formData.Set("redirect_uri", os.Getenv("GOOGLE_REDIRECT_URL"))
		formData.Set("grant_type", "authorization_code")

		// send request to Google's token endpoint
		resp, err := http.PostForm("https://oauth2.googleapis.com/token", formData)
		if err != nil {
			http.Error(w, "Failed to exchange code for token: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "Google returned non-ok status: "+resp.Status, http.StatusBadRequest)
			return
		}

		var tokenRes struct {
			AccessToken  string `json:"access_token"`
			IDToken      string `json:"id_token"`
			RefreshToken string `json:"refresh_token"`
			TokenType    string `json:"token_type"`
			Expiry       int    `json:"expires_in"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
			http.Error(w, "Failed to decode token response", http.StatusInternalServerError)
			return
		}

		log.Printf("Token response: %+v\n", tokenRes)

		// fetch user info from Google's UserInfo endpoint
		userInfoReq, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v1/userinfo", nil)
		if err != nil {
			http.Error(w, "Failed to create user info request: "+err.Error(), http.StatusInternalServerError)
			return
		}

		userInfoReq.Header.Set("Authorization", "Bearer "+tokenRes.AccessToken)
		userInfoReq.Header.Set("Accept", "application/json")

		userInfoResp, err := http.DefaultClient.Do(userInfoReq)
		if err != nil {
			http.Error(w, "Failed to fetch user info: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer userInfoResp.Body.Close()

		if userInfoResp.StatusCode != http.StatusOK {
			http.Error(w, "Google returned non-ok status for user info: "+userInfoResp.Status, http.StatusBadRequest)
			return
		}

		var userInfoRes struct {
			ID      string `json:"id"`
			Email   string `json:"email"`
			Name    string `json:"name"`
			Picture string `json:"picture"`
		}

		if err := json.NewDecoder(userInfoResp.Body).Decode(&userInfoRes); err != nil {
			http.Error(w, "Failed to decode user info response", http.StatusInternalServerError)
			return
		}

		// set the session cookie and redirect to the dashboard
		cookie := &http.Cookie{
			Name:     "session_id",
			Value:    tokenRes.RefreshToken,
			Path:     "/",
			Domain:   os.Getenv("COOKIE_DOMAIN"),
			Secure:   os.Getenv("ENV") == "production",
			HttpOnly: true,
		}

		http.SetCookie(w, cookie)

		redirectURL := fmt.Sprintf("%s?name=%s", os.Getenv("FRONTEND_URL"), url.QueryEscape(userInfoRes.Name))
		http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)

	})

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  10 * time.Second,
	}

	log.Printf("Server started at port %s", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}

}
