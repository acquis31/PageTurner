/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CurrentRead {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  genre: string;
  coverColor: string; // Tailwind hex or color class suffix (e.g., '#2e4a3f')
  startDate: string; // ISO Date String YYYY-MM-DD
  notes?: string;
}

export interface BookReview {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  rating: number; // 1 to 5 stars
  reviewText: string;
  startDate?: string;
  finishDate: string; // ISO Date String YYYY-MM-DD
  recommendToOthers: boolean;
}

export interface BookStats {
  currentlyReadingCount: number;
  completedCount: number;
  totalPagesRead: number;
  averageRating: number;
}

export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery & Thriller",
  "Biography",
  "History",
  "Poetry",
  "Philosophy",
  "Self-Help",
  "Classic Literature",
  "Other"
];

export const COVER_COLORS = [
  { name: "Clay Red", bg: "bg-[#c2593f]", text: "text-white", border: "border-[#9d432d]", hex: "#c2593f" },
  { name: "Sage Green", bg: "bg-[#4a6b5d]", text: "text-white", border: "border-[#395348]", hex: "#4a6b5d" },
  { name: "Ocean Navy", bg: "bg-[#2d4059]", text: "text-white", border: "border-[#1d2b3d]", hex: "#2d4059" },
  { name: "Warm Amber", bg: "bg-[#dca134]", text: "text-amber-950", border: "border-[#b88223]", hex: "#dca134" },
  { name: "Royal Plum", bg: "bg-[#522b5b]", text: "text-white", border: "border-[#3c1d43]", hex: "#522b5b" },
  { name: "Dusty Rose", bg: "bg-[#b87d85]", text: "text-white", border: "border-[#9d626a]", hex: "#b87d85" },
  { name: "Charcoal Ink", bg: "bg-[#2d251d]", text: "text-[#faf7f2]", border: "border-[#1a1105]", hex: "#2d251d" },
  { name: "Forest Moss", bg: "bg-[#2b442b]", text: "text-white", border: "border-[#1e301e]", hex: "#2b442b" }
];
