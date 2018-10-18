# KPS Contest

## Installation

Installation

```
npm install
```

## Start

```
npm start
```

Afterwards please open [http://localhost:8080](http://localhost:8080).

# Multiple interpretations of the contest description
It was not clear to me what the <b>distance in Pixels</b> means in the contest description.

There are <b>different kind of metrics</b> as described in the following:
#### Chebyshev-metric:  
  ```|| (x1, x2) - (y1, y2) || = Math.max(Math.abs(x1 -y1), Math.abs(x2 - y2))```
  
  If pixels are diagonal to each other, the distance between them is counted as 1:
  ```
  _ x
  x _
  ```
  The distance between the 'x'-pixels in this metric is 1 because 1 Pixel left and 1 Pixel up.
  The maximum of 1 and 1 is: 1. 
  
#### Euclidean metric:

 ```|| (x1, x2) - (y1, y2) || = Math.sqrt((x1 -y1)**2 + (x2 - y2)**2)```
  ```
  _ x
  x _
  ```
  The distance between the 'x'-pixels in this metric is Math.sqrt(2) (or the rounded value: 1) using Pythagoras theorem.
  
#### Manhattan metric:
 ```|| (x1, x2) - (y1, y2) || = Math.abs(x1 -y1) + Math.abs(x2 -y2)```
  ```
  _ x
  x _
  ```
  The distance between the 'x'-pixels in this metric is 2 because 1 Pixel right and 1 Pixel up results in: 1 + 1.
 
### Solution
So in order to provide a safe solution, I have implemented all 3 possibilities by making the metric configurable the src/config.ts

The <b>METRIC</b> in the config.ts may have one of the following values:
* Chebyshev <-- default value
* Euclidean
* Manhattan 

Further configuration, if needed:
* SHIP_SPEED_PX_PER_SEC
* UPDATE_LOOP_INTERVAL_MS 