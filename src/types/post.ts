export interface IReadPostResponse {
  _id: string;
  title: string;
  content: string;
  category: Category;
  artist: Artist;
  status: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Artist {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
