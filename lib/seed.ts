import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ROLE_KEY } from "@/lib/env";
import { faker } from '@faker-js/faker';
import { propertyImages, galleryImages } from "@/lib/seed-data";
import { Profile } from './data-types';
import fs from 'fs';

const supabaseUrl = SUPABASE_URL;
const supabaseRoleKey = SUPABASE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseRoleKey);

const PASSWORD = "testuser";

function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

function getRandomUser(profiles: Profile[]) {
  return profiles[Math.floor(Math.random() * profiles.length)].id;
};

export async function fetchEnumTypes(typeName: string) {
  const { data, error } = await supabase.rpc('get_enum_values', { enum_type: typeName });
  if (error) throw new Error(error.message);
  return data;
};

export async function fetchData(
  tableName: string, 
  options?: {
    sortedBy?: string;
    filter?: string;
    query?: string;
    limit?: number;
  }
) {
    let fetchQuery = supabase.from(tableName).select();
    if (options?.sortedBy) fetchQuery = fetchQuery.order(options.sortedBy);
    if (options?.filter && options?.filter !== 'All') fetchQuery.eq('type', options.filter);
    if (options?.query) fetchQuery.or(`name.ilike.%${options.query}%,address.ilike.%${options.query}%,type.ilike.%${options.query}%`);
    if (options?.limit) fetchQuery.limit(options.limit);
    const { data, error } = await fetchQuery;
    if (error) throw new Error(error.message);
    return data;
};

export async function fetchLatestData(tableName: string) {
  return fetchData(tableName, { sortedBy: 'created_at', limit: 5 })
}

async function resetDatabase() {
  const { error } = await supabase.rpc('truncate_tables');
  if (error) throw new Error(error.message);
  return 'Database Reset!';
}

const main = async () => {
  console.log(await resetDatabase());

  async function seedProfiles(amount: number) {
    fs.writeFileSync('./test-users.txt', 'Test Users:\n');
    for (let i = 0; i < amount; i++) {
      const email = faker.internet.exampleEmail();
  
      await supabase.auth.admin.createUser({
        email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: {
          avatar: faker.image.personPortrait()
        }
      });

      try {
        fs.appendFileSync('./test-users.txt', `Email: ${email}\nPassword: ${PASSWORD}\n\n`);
      } catch (err) {
        console.error(err);
      };   
    };
    console.log('Test Users Generated');
  };

  async function seedProperties(amount: number) {
    // const propertiesArray = [];
    for (let i = 0; i < amount; i++) {
      const property = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence({ min: 5, max: 20 }),
        address: faker.location.streetAddress(),
        price: parseFloat(faker.finance.amount({ dec: 2 })),
        area: faker.number.int({ max: 20000 }),
        bedrooms: faker.number.int({ min: 0, max: 8}),
        bathrooms: faker.number.int({ min: 0, max: 8}),
        rating: faker.number.float({ multipleOf: 0.5, min: 0.0, max: 5.0}),
        image: propertyImages[Math.floor(Math.random() * propertyImages.length)],
        geolocation: faker.location.nearbyGPSCoordinate().toString(),
        owner_id: getRandomUser(profileArray),
        type: getRandomSubset(fetchedTypes, 1, 3),
        facilities: getRandomSubset(fetchedFacilities, 0, 8)
      };
      await supabase.from('properties').insert([property]);
    };
    // console.log(propertiesArray);
  };

  async function seedGallery(propertyId: string) {
    const images = getRandomSubset(galleryImages, 1, 8);
    const { error } = await supabase.from('galleries').insert({property_id: propertyId, images: images});
    if (error) return (error);
  };

  async function seedReviews(propertyId: string, amount: number) {
    for (let i = 0; i < amount; i++) {
      const review = {
        review: faker.lorem.paragraph({ min: 1, max: 20 }),
        property_id: propertyId,
        reviewer_id: getRandomUser(profileArray),
        rating: faker.number.float({ multipleOf: 0.5, min: 0.0, max: 5.0}),
      };
      await supabase.from('reviews').insert([review]);
    };
  };

  // run seed of profiles
  await seedProfiles(20);
  const fetchedProfiles = await fetchData('profiles');
  const profileArray = fetchedProfiles?.map(profile => ({
      id: profile.id,
      avatar: profile.avatar,
      name: profile.name
  })) ?? [];
  console.log(`Seeded Users: ${fetchedProfiles.length}`)

  // run seed of properties
  const fetchedTypes = await fetchEnumTypes('type');
  const fetchedFacilities = await fetchEnumTypes('facilities');
  await seedProperties(50);

  const fetchedProperties = await fetchData('properties');
  console.log(`Seeded Properties: ${fetchedProperties.length}`);
  
  // run seed of galleries
  const addGallery = getRandomSubset(fetchedProperties, 1, fetchedProperties.length);
  for (let i = 0; i < addGallery.length; i++) {
    await seedGallery(addGallery[i].id);
  };
  console.log(`Seeded Properties to add Galleries: ${addGallery.length}`);

  const fetchedGalleries = await fetchData('galleries');
  console.log(`Seeded Galleries: ${fetchedGalleries.length}`);

  // run seed of reviews
  const addReviews = getRandomSubset(fetchedProperties, 1, fetchedProperties.length);
  for (let i = 0; i < addReviews.length; i++) {
    await seedReviews(addReviews[i].id, Math.floor(Math.random() * 10) + 1);
  };
  console.log(`Seeded Properties to add Reviews: ${addReviews.length}`);

  const fetchedReviews = await fetchData('reviews');
  console.log(`Seeded Reviews: ${fetchedReviews.length}`);
  
  // on success
  console.log('Database seeded successfully.');
  process.exit();
};

main();