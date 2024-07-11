# Art Tinder - Backend

This is sandbox project I build to do some libraries learning as well as reference for some internal discussions.

## How to start?

- Install Node 20 and Docker with Docker Compose
- Run `npm install`
- Apply migrations by running `npm run migrate`
- Copy `.env.example` to `.env` and adjust settings based on your local environment
- Start docker compose services (or configure them locally)
- Start Art Tinder by running `npm run start`

## API

### Auth

If request doesn't have `Authorization` header server will add `Authorization` header with JWT token in response. Pass
it back when making requests to keep same user auth. If you don't pass it system will create new session on each
request.

### Methods

------------------------------------------------------------------------------------------

#### Public-facing

<details>
 <summary><code>GET</code> <code><b>/api/voting/list-to-vote</b></code> <code>(provides next 10 art entities for voting)</code></summary>

##### Parameters

> None

##### Responses

> | http code | content-type                     | response |
> |-----------|----------------------------------|----------|
> | `200`     | `application/json;charset=UTF-8` | JSON     |

##### Example Response

> ```json
> {
>   "status": "ok",
>   "items": [
>     {
>       "id": "8d84ddc3-51c1-49f3-ba55-afee1b88bd87",
>       "name": "test 1",
>       "rating": 0,
>       "votes": 2,
>       "created_at": "2024-07-10T07:22:07.423Z",
>       "imageUrl": "http://localhost:9000/art/8d84ddc3-51c1-49f3-ba55-afee1b88bd87.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=u7Sj6ya7nmc6TTnKQ1U2%2F20240710%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240710T081452Z&X-Amz-Expires=180&X-Amz-SignedHeaders=host&X-Amz-Signature=42e3718b1371045b4a7ca4a596740df12760ccbfbbaefab0da8bd2f67d32c93b"
>     }
>   ]
> }
> ```

</details>

<details>
 <summary><code>POST</code> <code><b>/api/voting/vote</b></code> <code>(voting for art)</code></summary>

##### Parameters

> | name          | type     | data type | description                                    |
> |---------------|----------|-----------|------------------------------------------------|
> | `art_id`      | required | uuid      | UUID of the art user voting for                |
> | `is_positive` | required | boolean   | `true` if voting up and `false` if voting down |

##### Responses

> | http code | content-type                     | response |
> |-----------|----------------------------------|----------|
> | `200`     | `application/json;charset=UTF-8` | JSON     |

##### Example Response

> ```json
> {
>   "status": "ok",
>   "entity": {
>     "id": "8d84ddc3-51c1-49f3-ba55-afee1b88bd87",
>     "name": "test 1",
>     "rating": 0,
>     "votes": 3,
>     "created_at": "2024-07-10T07:22:07.423Z"
>   }
> }
> ```

</details>

------------------------------------------------------------------------------------------

#### Admin

Auth required before calling any endpoints but `/api/auth/login`

<details>
 <summary><code>POST</code> <code><b>/api/auth/login</b></code> <code>(login as admin)</code></summary>

Response will contain new `Authorization` header that you should use for protected api.

##### Parameters

> | name       | type     | data type | description    |
> |------------|----------|-----------|----------------|
> | `login`    | required | string    | Admin login    |
> | `password` | required | string    | Admin password |

##### Responses

> | http code | content-type                     | response |
> |-----------|----------------------------------|----------|
> | `200`     | `application/json;charset=UTF-8` | JSON     |
> | `400`     | `text/html;charset=UTF-8`        | HTML     |
> | `403`     | `application/json;charset=UTF-8` | JSON     |

</details>

<details>
 <summary><code>POST</code> <code><b>/api/art/list</b></code> <code>(list of all art entities)</code></summary>

##### Parameters

> None

##### Responses

> | http code | content-type                     | response |
> |-----------|----------------------------------|----------|
> | `200`     | `application/json;charset=UTF-8` | JSON     |

##### Example Response

> ```json
> {
>   "status": "ok",
>   "items": [
>     {
>       "id": "8d84ddc3-51c1-49f3-ba55-afee1b88bd87",
>       "name": "test 1",
>       "rating": 0,
>       "votes": 2,
>       "created_at": "2024-07-10T07:22:07.423Z",
>       "imageUrl": "http://localhost:9000/art/8d84ddc3-51c1-49f3-ba55-afee1b88bd87.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=u7Sj6ya7nmc6TTnKQ1U2%2F20240710%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240710T081452Z&X-Amz-Expires=180&X-Amz-SignedHeaders=host&X-Amz-Signature=42e3718b1371045b4a7ca4a596740df12760ccbfbbaefab0da8bd2f67d32c93b"
>     }
>   ]
> }
> ```

</details>

<details>
 <summary><code>POST</code> <code><b>/api/art/create</b></code> <code>(create and upload new art)</code></summary>

Must be `Content-Type: multipart/form-data`

##### Parameters

> | name   | type     | data type | description     |
> |--------|----------|-----------|-----------------|
> | `name` | required | string    | Name of the art |
> | `file` | required | file      | JPG File        |

##### Responses

> | http code | content-type                     | response |
> |-----------|----------------------------------|----------|
> | `200`     | `application/json;charset=UTF-8` | JSON     |

##### Example Response

> ```json
> {
>   "status": "ok",
>   "item": {
>     "id": "8d84ddc3-51c1-49f3-ba55-afee1b88bd87",
>     "name": "test 1",
>     "rating": 0,
>     "votes": 0,
>     "created_at": "2024-07-10T07:22:07.423Z",
>     "imageUrl": "http://localhost:9000/art/8d84ddc3-51c1-49f3-ba55-afee1b88bd87.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=u7Sj6ya7nmc6TTnKQ1U2%2F20240710%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240710T081452Z&X-Amz-Expires=180&X-Amz-SignedHeaders=host&X-Amz-Signature=42e3718b1371045b4a7ca4a596740df12760ccbfbbaefab0da8bd2f67d32c93b"
>   }
> }
> ```

</details>

<details>
 <summary><code>POST</code> <code><b>/api/art/delete</b></code> <code>(delete art by id)</code></summary>

##### Parameters

> | name     | type     | data type | description        |
> |----------|----------|-----------|--------------------|
> | `art_id` | required | string    | UUID of art entity |

##### Responses

> | http code | content-type                     | response |
> |-----------|----------------------------------|----------|
> | `200`     | `application/json;charset=UTF-8` | JSON     |

##### Example Response

> ```json
> {
>   "status": "ok"
> }
> ```

</details>
