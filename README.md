# Store backend
- using express.js

## Exercise requirements:
---

Create a node.js application which can serve contents of [store.csv](./store.csv) through the json api.

API described below is not really something you would see in a real life, for sake of training there will be some illogical things.  

### Deployment link

https://shopping-cart-backend-eg.herokuapp.com/

### Setting Up

You will need a new `npm` project, but make sure you include everything from this directory in your project.

[Here](https://dev.to/asciidev/testing-a-nodeexpress-application-with-mocha--chai-4lho) is a great tutorial on how to create a simple express app.

### Useful libraries

 - [`express`](https://www.npmjs.com/package/express)
 - [`csvtojson`](https://www.npmjs.com/package/csvtojson)

### Submitting

Project has been deployed on [Heroku](https://store-nodejs-backend.herokuapp.com/)

### API Documentation
---

### Fetch configuration

`GET /config`

Config represents application status and configuration, where:

 - `servers` - array of servers which name will be used to make requests
 - `errorFrequency` - how many requests out of 10 will fail

Response must look like this:

```json
{
  "servers": [
    {
      "name": "alpha",
      "errorFrequency": 0
    },
    {
      "name": "beta",
      "errorFrequency": 14
    }
  ]
}
```

### Fetch all items

`GET /{server-name}/items`

Since there may be lots of files pagination must be implemented.

There may be two optional query parameters:

 - `page`, default value 0
 - `size`, default value 25

Request url may look like this:

 - `GET /alpha/items`
 - `GET /alpha/items?page=10`
 - `GET /alpha/items?page=10&size=100`
 - `GET /alpha/items?size=100`

Response must look like this:

```json
{
  "page": 5,
  "totalPages": 40,
  "totalItems": 1000,
  "items": [
    {
      "id": 1,
      "title": "Standardized Mite",
      "description": "Dermatophagoides pteronyssinus\",10.48,In hac habitasse platea dictumst. Etiam faucibus cursus urna.",
      "image": "data:image/...",
      "expectedDeliveryDate": "16/10/2019",
      "seller": "Antigen Laboratories, Inc.",
      "sellerImage": "https://robohash.org..."
    },
    ...
  ]
}
``` 

**NB!** - response must look exactly as this, make sure that casing is the same and you return exactly the same fields, price and quantity are left out on purpose.

### Fetch single item

`GET /{server-name}/items/{id}`

Returns single item specified by `id`, for example `GET /alpha/items/99`

Response must look like this:

```json
{
  "id": 1,
  "title": "Standardized Mite",
  "description": "Dermatophagoides pteronyssinus\",10.48,In hac habitasse platea dictumst. Etiam faucibus cursus urna.",
  "image": "data:image/...",
  "expectedDeliveryDate": "16/10/2019",
  "seller": "Antigen Laboratories, Inc.",
  "sellerImage": "https://robohash.org..."
}
```

### Fetch item quantity

`GET /{server-name}/items/{id}/quantity`

Returns item quantity specified by `id`, for example `GET /alpha/items/99/quantity`

Response must look like this:

```
15
```

### Fetch item price

`POST /{server-name}/items/{id}/calculate-price`

Returns total item price specified by `id`, for example `POST /alpha/items/99/calculate-price`

Request body:
```json
{
  "quantity": 1
}
```

Response must look like this:

```
99.00 EUR
```
