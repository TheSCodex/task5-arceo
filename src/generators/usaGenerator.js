import { faker } from "@faker-js/faker";
import seedrandom from "seedrandom";
import { v4 as uuidv4 } from 'uuid';

export function generateUSAData(seed, pageNumber) {
  const combinedSeed = `${seed}-${pageNumber}`;
  const rng = seedrandom(combinedSeed);

  faker.seed(rng.int32());

  const data = [];

  for (let i = 0; i < 20; i++) {
    const name = generateName();
    const address = generateAddress();
    const phone = generatePhone();
    const identifier = generateUniqueId();
    data.push({ id: i + 1, name, address, phone, identifier });
  }

  return data;
}

function generateUniqueId() {
  return uuidv4();
}

function generateName() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return `${firstName} ${lastName}`;
}

function generateAddress() {
  const city = faker.location.city();
  const street = faker.location.street();
  const buildingNumber = faker.location.buildingNumber();
  return `${buildingNumber} ${street}, ${city}`;
}

function generatePhone() {
  return faker.phone.number({ style: 'international' });
}
