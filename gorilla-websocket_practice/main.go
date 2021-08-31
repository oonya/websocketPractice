// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "http service address")

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "home.html")
}

func serveHome2(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/second" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "home2.html")
}

// components /ws/{wg_gp_id}
func main() {
	flag.Parse()

	// HubFactoryがメモリリークしないか調べたい
	// HubFactoryが増え続ける？ or GCされる
	hf := HubFactory{make(map[string]*Hub)}

	http.HandleFunc("/", serveHome)
	// ws/{chat_group_id}
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		factoryHub := hf.getHub("/ws")
		go factoryHub.run()
		serveWs(factoryHub, w, r)
	})

	http.HandleFunc("/second", serveHome2)
	http.HandleFunc("/ws2", func(w http.ResponseWriter, r *http.Request) {
		factoryHub := hf.getHub("/ws2")
		go factoryHub.run()
		serveWs(factoryHub, w, r)
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
