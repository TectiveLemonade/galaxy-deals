const { geocodeZipcode } = require('./utils/geocoding');

async function testGeocoding() {
  try {
    console.log('Testing zipcode 90210...');
    const result = await geocodeZipcode('90210');
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGeocoding();