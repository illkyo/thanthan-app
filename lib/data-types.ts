export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  price: number;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  rating: number;
  image: string;
  geolocation: string | null;
  owner_id: string;
  type: string[] | [];
  facilities: string[] | [];
  created_at: string;
}

export interface Gallery {
  id: number;
  images: string[];
  property_id: string;
}

export interface Review {
  id: number;
  review: string;
  property_id: string;
  reviewer_id: string;
  rating: number;
  created_at: string;
}