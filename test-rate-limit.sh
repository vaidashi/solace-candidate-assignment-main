#!/bin/bash

for i in {1..70}; do 
  curl -w "Request $i: %{http_code}\n" -o /dev/null -s http://localhost:3000/api/advocates
done