package main

import "fmt"

const boilingF = 212.0

func init() {
	fmt.Println("同一个包main.go文件")
}

func main() {
	var f = boilingF
	var c = (f - 32) * 5 / 9
	fmt.Printf("boiling point = %g℉ or %g℃\n", f, c)
	test()
}