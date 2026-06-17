export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  language?: string;
  subscription?: UserSubscription;
}

export interface UserSubscription {
  planId: 'basic' | 'standard' | 'premium';
  planName: string;
  price: number;
  maxQuestionsPerDay: number;
  maxPhotosTotal: number;
  questionsAskedToday: number;
  photosUploadedToday: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string; // ISO string
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
  language: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  age: number;
  location: string;
  habit: string;
  duration: string;
  reviewText: string;
  rating: number;
  beforeImg: string;
  afterImg: string;
  status: string; // "Quit tobacco & whitened teeth"
}
