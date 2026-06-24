/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentRead, BookReview } from "./types";

export const INITIAL_CURRENT_READS: CurrentRead[] = [
  {
    id: "cr-1",
    title: "The Shadow of the Wind",
    author: "Carlos Ruiz Zafón",
    genre: "Fiction",
    totalPages: 487,
    currentPage: 214,
    coverColor: "#522b5b", // Royal Plum
    startDate: "2026-06-18",
    notes: "Loving the gothic atmosphere of Barcelona's Cemetery of Forgotten Books. Daniel Sempere's quest is deeply compelling and beautifully written."
  },
  {
    id: "cr-2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    totalPages: 320,
    currentPage: 185,
    coverColor: "#dca134", // Warm Amber
    startDate: "2026-06-21",
    notes: "Remarkably practical frameworks for behavior change. Currently implementing the 'habit stacking' formula to improve my morning writing routine."
  }
];

export const INITIAL_REVIEWS: BookReview[] = [
  {
    id: "rev-1",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    coverColor: "#c2593f", // Clay Red
    rating: 5,
    reviewText: "A beautiful, allegorical fable about following your personal legend. Santiago's journey from the Spanish pastures to the Egyptian deserts is packed with timeless wisdom. 'When you want something, all the universe conspires in helping you to achieve it'—a gorgeous read that I will keep returning to.",
    startDate: "2026-06-01",
    finishDate: "2026-06-08",
    recommendToOthers: true
  },
  {
    id: "rev-2",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    coverColor: "#4a6b5d", // Sage Green
    rating: 4,
    reviewText: "An extremely ambitious sweep of human history, from ancient hominids to the high-tech modern era. The author's central thesis—that human cooperation is driven by our unique ability to believe in shared imaginations like money, nations, and human rights—is absolutely fascinating. A masterclass in big-history storytelling.",
    startDate: "2026-05-15",
    finishDate: "2026-05-30",
    recommendToOthers: true
  }
];
