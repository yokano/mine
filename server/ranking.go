package mine

import (
    "fmt"
    "net/http"
    "strings"
    "appengine"
    "appengine/datastore"
)

func init() {
    http.HandleFunc("/register", register)
    http.HandleFunc("/get", get)
}

type RankData struct {
	Name string
	Time string
}

// Register player's time
func register(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	name := r.FormValue("name")
	time := r.FormValue("time")
	
	// Regist player's result
	result := RankData {
		Name: name,
		Time: time,
	}
	key := datastore.NewIncompleteKey(c, "ranking", nil)
	datastore.Put(c, key, &result)
	
	// Get and return rank with JSON
	q := datastore.NewQuery("ranking").Order("Time")
	allDatas := q.Run(c)
	dataNum,_ := q.Count(c)
	rankdata := new(RankData)
	for i := 0; i < dataNum; i++ {
		key,_ = allDatas.Next(rankdata)
		datastore.Get(c, key, &rankdata)
		if time >= rankdata.Time {
			fmt.Fprintf(w, "{\"rank\":%d}", i+1)
			break
		}
	}
	return
}

// Return all ranking datas
func get(w http.ResponseWriter, r *http.Request) {
	const(
		RETURN_NUM = 10
	)
	c := appengine.NewContext(r)
	
	q := datastore.NewQuery("ranking").Order("Time")
	allDatas := q.Run(c)
	rankdata := new(RankData)
	results := make([]string, RETURN_NUM)
	for i := 0; i < RETURN_NUM; i++ {
		key,_ := allDatas.Next(rankdata)
		datastore.Get(c, key, &rankdata)
		results[i] = fmt.Sprintf("{\"name\":\"%s\",\"time\":\"%s\"}", rankdata.Name, rankdata.Time)
	}
	
	fmt.Fprint(w, fmt.Sprintf("[%s]", strings.Join(results, ",")))
}
