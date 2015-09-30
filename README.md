# Lambda Geojson Mapper

This is an [Amazon Lambda](http://aws.amazon.com/lambda/) function written in node.js that accepts an array of [encoded polylines](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) and returns a list of US counties that they intersect. The response also includes the US state for each county.

For example, you can turn this:

    ["cqepF~dgzUd@~BqDvA_C|@qCdAmBx@YLORg@sC[kB{Bz@yChAwEzAoC~@{@^m@P"]

into this:

    [
      {
        "county": "Washoe",
        "state": "Nevada",
        "id": "32031"
      }
    ]

This function depends uses county and state geojson data contained in this repo to do the geo lookup.

With [Amazon API Gateway](http://aws.amazon.com/api-gateway/), it's easy to expose this as an API microservice.  This could allow a website to access this function via a POST request.

This project uses [Amazon Lambda](http://aws.amazon.com/lambda/), [Amazon API Gateway](http://aws.amazon.com/api-gateway/) and [PostGIS](http://postgis.net/).

## Running locally

You can run the code locally With

  node local

This will test against the data in `sample-data/data.json`.

## Deploying

### Upload code to Amazon Lambda

Zip the project:

    node build

This will create a file called `process.zip` that you can upload to Amazon Lambda.

### Create an API Endpoint

If you want to be able to access this via HTTP POST, [create an Amazon API Gateway endpoint](http://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html).

If you want to be able to access this endpoint from the browser, [enable CORS](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html).  

## Example request

Add your Amazon API Gateway endpoint

    curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '["cqepF~dgzUd@~BqDvA_C|@qCdAmBx@YLORg@sC[kB{Bz@yChAwEzAoC~@{@^m@P","qq`nFvv~yU@{FcGAyKAkF?sCABdDA|F@rAw@AeA?iDAkHAuXI}DBIKc@@{ALiBZuAZ{Bt@sAj@kB~@yKpFyIrEcI~DyIpEkCtAqAp@IEGmM@sByB@iE?{IG]|@?xF?vB@xG?pHDn@pHwDtAs@"]' https://1vcbxgt3at.execute-api.us-east-1.amazonaws.com/prod

Response:

    [
      {
        "county": "Washoe",
        "state": "Nevada",
        "id": "32031"
      },
      {
        "county": "Carson City",
        "state": "Nevada",
        "id": "32510"
      }
    ]
