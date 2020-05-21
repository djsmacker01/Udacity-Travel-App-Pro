import request from '../-mocks-/trip';

const trip = {
  city: 'Paris',
  countryCode: 'FR',
  country: 'France'
};

const handleSave = async () => {
  const response = await request(trip);
  return response;
}

it('Return an array that contain trip object', async function() {
  const response = await saveContent();
  expect(response[0].country).toEqual('France');
})