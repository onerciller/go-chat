package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)



var clients = make(map[*websocket.Conn]bool) //client connect
var send = make(chan Message)           	  //channel


var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize:1024,
    CheckOrigin: func(r *http.Request) bool { return true },
}

type Message struct {
	Username string
	Message  string
}

func main() {
	file := http.FileServer(http.Dir("./public"))
	http.Handle("/", file)

	http.HandleFunc("/ws", handleConnections)

	go handleMessages()
	
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Println(err)
	}

}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	defer ws.Close()

	clients[ws] = true
	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println(err)
			delete(clients, ws)
			break
		}
		send <- msg
	}

}

func handleMessages() {
	for {
		msg := <-send
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}

}
