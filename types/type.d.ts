export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}

export interface MarkerData extends Driver {
  latitude: number;
  longitude: number;
  title: string;
  time?: number;
  price?: string;
}

export interface Ride {
  ride_id: number;
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number;
  fare_price: number;
  payment_status: string;
  driver_id: number;
  user_id: string;
  created_at: string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  clerk_id: string;
  created_at: string;
}

export interface PaystackResponse {
  authorization_url: string;
  reference: string;
  access_code: string;
}

export interface PaystackVerification {
  verified: boolean;
  amount: number;
  reference: string;
  paid_at: string;
}
