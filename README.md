# ShortLink - URL Shortener Service

## Brief

ShortLink is a simple URL shortening service where users can submit long URLs to get shortened URLs. When visiting the shortened URL, users are redirected to the original long URL.

For example:
- **Input**: `https://indicina.co`
- **Shortened**: `http://short.est/GeAi9K`
- **Redirection**: Visiting `http://short.est/GeAi9K` redirects the user to `https://indicina.co`

## Features

1. **Short URL Creation**: 
   - Users can create a shortened URL by submitting a long URL through a form.
   - The backend generates a unique short URL and returns it to the user.

2. **Decoding**:
   - Users can decode a short URL to retrieve the original long URL.
   - The backend will decode the short URL and return the original long URL.

3. **Listing Page**:
   - Users can view a list of all created URLs, including:
     - The original long URL
     - The corresponding short URL
     - Additional metadata (e.g., creation date, number of visits, etc.)

4. **Search Functionality**:
   - Users can search for long URLs by entering at least three characters.
   - The system will return matching results for easy access to previously created URLs.

5. **URL Statistics**:
   - **Click Count**: Tracks the number of times a short URL has been clicked.
   - **Last Accessed**: Displays the timestamp when the short URL was last accessed.
   - **Date-Time Accessed**: Lists all timestamps when the short URL was accessed.
   - **Access Logs**: Logs detailed information about each access, including:
     - **IP Address**: The IP address of the user who accessed the short URL.
     - **Browser**: The browser used by the user.
     - **Location**: Geolocation information such as city, country, and coordinates.
     - **Timestamp**: The exact time when the short URL was accessed.
     - **Country**: The country from which the link is accessed

6. **Redirection**:
   - Users who visit a short URL are automatically redirected to the original long URL.
   - When a user accesses a short URL (e.g., `http://short.est/GeAi9K`), they are redirected to the corresponding long URL (e.g., `https://indicina.co`).

## API Endpoints
### 1. `POST /api/v1/encode`
- **Description**: Encode a long URL into a shortened URL.
- **Request Body**:
  ```json
  {
    "longUrl": "https://indicina.co"
  }
### Response:
- **Status Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "longUrl": "https://indicina.co",
    "shortUrl": "http://localhost:3008/_4wWQM",
    "urlPath": "_4wWQM",
    "createdAt": "2025-05-09T00:57:43.328Z",
    "updatedAt": "2025-05-09T00:57:43.328Z",
    "statistic": {
      "clickCount": 0,
      "lastAccessed": null,
      "dateTimeAccessed": [],
      "accessLogs": []
    }
  }
### 2. `POST /api/v1/decode`
- **Description**: Decode a short URL to retrieve the original long URL.
- **Request Body**:
  ```json
  {
    "shortUrl": "http://localhost:3008/2GX2YZ"
  }
### Response:
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
    {
    "shortUrl": "http://localhost:3008/2GX2YZ",
    "encodedUrl": "https://indicina.co"
    }
### 3. `GET /api/v1/:{url_path}`
- **Description**: Redirect a user from a short URL to the original long URL.
- **Request**:
  - Users can visit a short URL in their browser, for example: `http://localhost:3008/{url_path}` (where `{url_path}` is a unique identifier for the short URL).
  
- **Redirection Process**:
  - When a user accesses a short URL (e.g., `http://localhost:3008/GeAi9K`), they will be automatically redirected to the corresponding long URL (e.g., `https://indicina.co`).

- **Response**:
  - **Status Code**: `301 Moved Permanently` or `302 Found` (depending on implementation)
  - The user will be redirected to the `encodedUrl`, which is the original long URL.
  
- **Example**:
  - If the short URL `http://localhost:3008/GeAi9K` exists and corresponds to the long URL `https://indicina.co`, the user will be redirected from `http://localhost:3008/GeAi9K` to `https://indicina.co`.

### 4. `GET /api/v1/statistic/:{url_path}`
- **Description**: Returns basic stats of the url.
### Response:
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
    {
    "longUrl": "https://indicina.co",
    "shortUrl": "http://localhost:3008/2GX2YZ",
    "urlPath": "2GX2YZ",
    "createdAt": "2025-05-09T00:20:49.799Z",
    "updatedAt": "2025-05-09T00:23:11.794Z",
    "statistic": {
        "clickCount": 1,
        "lastAccessed": "2025-05-09T00:23:11.794Z",
        "dateTimeAccessed": [
            "2025-05-09T00:23:11.794Z"
        ],
        "accessLogs": [
            {
                "timestamp": "2025-05-09T00:23:11.794Z",
                "browser": "PostmanRuntime/7.43.4",
                "metro": 0,
                "area": 1000,
                "timezone": "Australia/Sydney",
                "city": "",
                "ll": [
                    -33.494,
                    143.2104
                ],
                "country": "AU",
                "region": ""
                }
            ]
        }
    }

### 5. `GET /api/v1?{search}=t9ohG`
- **Description**: Returns a list of url, with an optional search query.
### Response:
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
    [
        {
            "longUrl": "https://indicina.co",
            "shortUrl": "http://localhost:3008/2GX2YZ",
            "urlPath": "2GX2YZ",
            "createdAt": "2025-05-09T00:20:49.799Z",
            "updatedAt": "2025-05-09T00:20:49.799Z",
            "statistic": {
                "clickCount": 0,
                "lastAccessed": null,
                "dateTimeAccessed": [],
                "accessLogs": []
            }
        }
    ]
    
# Technologies
The API is built with the following technologies.      
- Express (Typescript)
- Express Inversify
- Node.js
- In-memory storage

## Prerequisites
You need to have the following installed
- Git 
- Node.js (>=14.x)
- Yarn 


## Running Locally
- Clone the [repository](https://github.com/abrahamemmanuel/short-url-generator.git) to your local machine
- Navigate into the project directory and run 
   ```bash
  yarn install
  ```
  This will install all the npm packages.
- In the root directory of the project create a **.env** file and copy the values from **.env.sample** and set the values of the variables correctly. 
- NB: You can pass random strings to the env variables, however the BASE_URL must be correctly set
- To run locally after setting the environment variables correctly.
  - To run in development mode
  ```bash
  yarn build
  yarn start:dev
  ```  
 - To watch files changes
  ```bash
  yarn watch
  ```  
## Running tests
- to run tests run 
  ```bash
  yarn test
  ```

## Documentation
Find documentation of the API  endpoints [here](https://documenter.getpostman.com/view/5744463/2sB2j978hx)
