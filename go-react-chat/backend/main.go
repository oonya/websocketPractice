package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {

	flag.Parse()
	// hub := newHub()
	// go hub.run()
	hf := HubFactory{make(map[string]*Hub)}

	http.HandleFunc("/ws/1", func(w http.ResponseWriter, r *http.Request) {
		factoryHub := hf.getHub("/ws/1")
		go factoryHub.run()
		serveWs(factoryHub, w, r)
	})

	http.HandleFunc("/ws/2", func(w http.ResponseWriter, r *http.Request) {
		factoryHub := hf.getHub("/ws/2")
		go factoryHub.run()
		serveWs(factoryHub, w, r)
	})

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
