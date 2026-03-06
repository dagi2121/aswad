import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PRICING_PACKAGES = [
  {
    title: "Starter Branding Package",
    price: "2,500 ETB",
    description: "Best for small startups",
    features: [
      "1 Professional Logo Design",
      "1 Promotional Poster",
      "3 Social Media Post Designs",
      "3 Logo revisions",
      "High-resolution files (PNG + JPG)",
      "Delivery: 3-4 days"
    ],
    color: "orange",
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Business Branding Package",
    price: "5,000 ETB",
    description: "Best for growing businesses",
    features: [
      "2 Logo Concepts",
      "2 Professional Posters",
      "6 Social Media Post Designs",
      "Social media profile picture + cover",
      "Unlimited minor revisions",
      "Delivery: 4-6 days"
    ],
    color: "green",
    gradient: "from-emerald-600 to-green-800",
    popular: true
  },
  {
    title: "Premium Branding Package",
    price: "8,500 ETB",
    description: "Best for serious brands and companies",
    features: [
      "3 Logo Concepts",
      "3 Professional Posters",
      "10 Social Media Designs",
      "Profile picture + cover design",
      "Brand color palette + typography guide",
      "Source files (AI / PSD)"
    ],
    color: "red",
    gradient: "from-red-700 to-orange-800"
  }
];

export const ADD_ONS = [
  {
    title: "Extra Poster",
    price: "800 ETB",
    icon: "Image"
  },
  {
    title: "Extra Social Media Post",
    price: "250 ETB",
    icon: "Share2"
  },
  {
    title: "Logo Animation",
    price: "1,200 ETB",
    icon: "Video"
  },
  {
    title: "Source File",
    price: "500 ETB",
    icon: "FileCode"
  }
];

export const CONTACT_INFO = {
  phone: "9344 80929",
  email: "malefya88@gmail.com",
  paymentMethods: ["Telebirr", "CBE Birr", "Bank Transfer"]
};

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Rose Podcast",
    category: "Branding",
    description: "Complete brand identity for 'Rose Podcast', focusing on insights and entertainment. Features a stylized microphone logo, a fresh green color palette, and modern Poppins typography. The project includes logo variations, social media templates, business cards, and merchandise design.",
    image: "https://picsum.photos/seed/rosepodcast/800/600",
    tags: ["Brand Identity", "Logo Design", "Social Media Kit", "Stationery"]
  },
  {
    id: 2,
    title: "Urban Coffee",
    category: "Packaging",
    description: "Sustainable coffee packaging design for a local roastery.",
    image: "https://picsum.photos/seed/coffee/800/600",
    tags: ["Packaging", "Illustration"]
  },
  {
    id: 3,
    title: "TechFlow App",
    category: "UI/UX",
    description: "Modern user interface design for a productivity application.",
    image: "https://picsum.photos/seed/techflow/800/600",
    tags: ["App Design", "User Interface"]
  }
];
