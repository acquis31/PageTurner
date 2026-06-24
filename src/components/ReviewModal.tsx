/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookReview, CurrentRead, GENRES, COVER_COLORS } from "../types";
import { X, Award, Star, Calendar, ThumbsUp, MessageSquare, BookOpen } from "lucide-react";
import React, { useState, useEffect } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Omit<BookReview, "id"> & { id?: string; sourceCurrentReadId?: string }) => void;
  transitionFromBook?: CurrentRead | null; // Prefills review from currently reading
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  transitionFromBook,
}: ReviewModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0].hex);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [recommendToOthers, setRecommendToOthers] = useState(true);
  const [error, setError] = useState("");

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Initialize form
  useEffect(() => {
    if (transitionFromBook) {
      setTitle(transitionFromBook.title);
      setAuthor(transitionFromBook.author);
      setGenre(transitionFromBook.genre);
      setCoverColor(transitionFromBook.coverColor);
      setRating(5);
      setReviewText("");
      setStartDate(transitionFromBook.startDate);
      setFinishDate(new Date().toISOString().split("T")[0]);
      setRecommendToOthers(true);
    } else {
      setTitle("");
      setAuthor("");
      setGenre(GENRES[0]);
      setCoverColor(COVER_COLORS[0].hex);
      setRating(5);
      setReviewText("");
      setStartDate("");
      setFinishDate(new Date().toISOString().split("T")[0]);
      setRecommendToOthers(true);
    }
    setError("");
  }, [transitionFromBook, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !author.trim()) {
      setError("Please provide both the book title and author.");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write a short review sharing your thoughts.");
      return;
    }

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      genre,
      coverColor,
      rating,
      reviewText: reviewText.trim(),
      startDate: startDate || undefined,
      finishDate,
      recommendToOthers,
      sourceCurrentReadId: transitionFromBook?.id // Pass down to archive the active read
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#faf7f2] border border-[#e4dec9] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e4dec9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#c2593f]" />
            <h2 className="text-lg font-serif font-bold text-stone-900">
              {transitionFromBook ? "Finish Book & Write Review" : "Write a New Book Review"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-sans font-medium">
              {error}
            </div>
          )}

          {transitionFromBook && (
            <div className="p-3 bg-[#4a6b5d]/5 border border-[#4a6b5d]/20 text-stone-700 rounded-xl text-xs font-sans flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4a6b5d] flex-shrink-0" />
              <span>
                Wonderful! You read all <strong>{transitionFromBook.totalPages} pages</strong> of <strong>{transitionFromBook.title}</strong>. Time to review your journey.
              </span>
            </div>
          )}

          {/* Book Details */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                required
                disabled={!!transitionFromBook}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Jane Eyre"
                className="w-full px-3.5 py-2 bg-white disabled:bg-stone-100 border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#c2593f] focus:outline-none placeholder-stone-400 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Author Name *
              </label>
              <input
                type="text"
                required
                disabled={!!transitionFromBook}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., Charlotte Brontë"
                className="w-full px-3.5 py-2 bg-white disabled:bg-stone-100 border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#c2593f] focus:outline-none placeholder-stone-400 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Genre / Category
              </label>
              <select
                disabled={!!transitionFromBook}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 bg-white disabled:bg-stone-100 border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#c2593f] focus:outline-none font-sans"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Completion Date *
              </label>
              <input
                type="date"
                required
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#c2593f] focus:outline-none font-mono"
              />
            </div>
          </div>

          {!transitionFromBook && (
            /* Cover Color Picker - only if not prefilled */
            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-2">
                Book Cover Canvas Theme
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {COVER_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color.hex}
                    onClick={() => setCoverColor(color.hex)}
                    title={color.name}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${color.bg} ${color.border} border-2 hover:scale-110 active:scale-95`}
                  >
                    {coverColor === color.hex && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/70 flex flex-col items-center">
            <span className="text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-2">
              Your Personal Rating
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating ?? rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-serif font-semibold text-stone-600 mt-2">
              {rating === 1 && "Disappointed — Hard to finish"}
              {rating === 2 && "Fair — Had potential but fell short"}
              {rating === 3 && "Good — An enjoyable, worthwhile read"}
              {rating === 4 && "Great — Highly engaging and recommended"}
              {rating === 5 && "Masterpiece — Exceptional, a new favorite!"}
            </span>
          </div>

          {/* Recommendation Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-150">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-[#c2593f]" />
              <div>
                <p className="text-xs font-sans font-semibold text-stone-800">
                  Recommend to others
                </p>
                <p className="text-[10px] text-stone-500 font-sans">
                  Flag this book as a highly recommended recommendation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRecommendToOthers(!recommendToOthers)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                recommendToOthers ? "bg-[#c2593f]" : "bg-stone-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  recommendToOthers ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Your Written Review *
            </label>
            <textarea
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What made this story special? Share your critical thoughts, themes, emotional resonance, and takeaways..."
              rows={4}
              className="w-full px-3.5 py-2.5 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#c2593f] focus:outline-none placeholder-stone-400 font-serif italic"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4dec9] bg-white -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-sans font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c2593f] hover:bg-[#9d432d] text-white text-sm font-sans font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              Archive & Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
