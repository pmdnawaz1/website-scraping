## Puppeteer Web Scraping Server

This is a Node.js application that uses [Puppeteer](https://github.com/puppeteer/puppeteer) to scrape data from a website. The server is built using Express and it scrapes hotel room information based on city, check-in date, and checkout date.

### Prerequisites

Before you get started, make sure you have Node.js installed on your system. You can download and install Node.js from [https://nodejs.org/](https://nodejs.org/).

### Installation

1. Clone this repository or download the files to your local machine.

2. Navigate to the project directory in your terminal.

3. Install the required dependencies by running:

   ```
   npm install
   ```

### Usage

1. Start the server by running:

   ```
   node server.js
   ```

   The server will start on port 3000 by default.

2. Make POST requests to the `/scrape` endpoint with the following JSON payload:

   ```json
   {
     "searchValue": "CityName",
     "checkinDate": "YYYY-MM-DD",
     "checkoutDate": "YYYY-MM-DD"
   }
   ```

   Replace `"CityName"`, `"YYYY-MM-DD"`, and `"YYYY-MM-DD"` with the city name, check-in date, and checkout date, respectively.

3. The server will use Puppeteer to scrape the hotel room information for the specified city and dates. It will return the maximum number of persons per room and the number of available rooms in the response.

### Data Source

The server relies on data stored in a `data.json` file to map city names to their respective city codes. Make sure the `data.json` file is present in the same directory as the server script and is correctly formatted.

### Error Handling

The server handles errors gracefully and will return a JSON response with an error message in case of any issues during scraping.

### Note

Make sure to adapt the code and URL as needed for your specific use case. This example is based on a specific website and may require adjustments to work with other websites.

### License

This project is open-source and available under the MIT License. You are free to modify and distribute it as needed.
