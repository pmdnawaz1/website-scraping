const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 3000;

function getCityCode(searchValue) {
	try {
		const filePath = path.join(__dirname, 'data.json');
		const data = fs.readFileSync(filePath, 'utf8');
		const cityData = JSON.parse(data);
		const uppercaseSearchValue = searchValue.toUpperCase();

		if (cityData.hasOwnProperty(uppercaseSearchValue)) {
			return cityData[uppercaseSearchValue];
		} else {
			return -1;
		}
	} catch (error) {
		console.error('Error:', error.message);
		return -1;
	}
}

app.post('/scrape', async (req, res) => {
	const { searchValue, checkinDate, checkoutDate } = req.body;
	try {
	  const browser = await puppeteer.launch();
	  const page = await browser.newPage();
  
	  const cityCode = getCityCode(searchValue);
  
	  const url = `https://tourism.ap.gov.in/hotellist?cityCode=${cityCode}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&adults=1&childs=0&unitCode=ALL#20`;
	  console.log({ url });
	  await page.goto(url, { timeout: 60000 });
  
	  await page.waitForSelector('.btn.btn-primary-inverse.tdc-rlts-item-price-btn');
	  await page.click('.btn.btn-primary-inverse.tdc-rlts-item-price-btn');
  
	  await page.waitForSelector('form');
  
	  await page.waitForSelector('#mat-input-0', {
		visible: true,
		timeout: 5000,
	  });
	  await page.click('#mat-input-0');
  
	  await page.focus('#mat-input-0');
	  await page.type('#mat-input-0', searchValue);
  
	  // Wait for the search results to load
	  await page.waitForSelector('.tdc-rlts-item-price');
  
	  // Get the maximum number of persons per room
	  const maxPerRoom = await page.evaluate(() => {
		const maxPerRoomElement = document.querySelector('.tdc-rlts-item-max-occupancy');
		return maxPerRoomElement ? maxPerRoomElement.textContent.trim() : null;
	  });
  
	  // Get the available rooms data
	  const availableRooms = await page.evaluate(() => {
		const availableRoomsElement = document.querySelector('.tdc-rlts-item-availability');
		return availableRoomsElement ? availableRoomsElement.textContent.trim() : null;
	  });
  
	  // Convert available rooms data to a number
	  const cleanedAvailableRooms = availableRooms.replace(/\D/g, '');
	  const parsedAvailableRooms = isNaN(Number(cleanedAvailableRooms)) ? null : Number(cleanedAvailableRooms);
  
	  const roomData = {
		maxPerRoom: maxPerRoom,
		availableRooms: parsedAvailableRooms,
	  };
  
	  res.json(roomData);
  
	  await page.evaluate(() => {
		window.location.reload(true);
	  });
  
	  await browser.close();
	} catch (error) {
	  console.error('Error:', error.message);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
});  

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
