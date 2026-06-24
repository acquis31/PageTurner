/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentRead, BookReview, COVER_COLORS } from "../types";
import { BookOpen, Calendar, Edit, Star, ThumbsUp, Trash2, Plus, Minus, CheckCircle } from "lucide-react";
import React, { useState } from "react";

interface BookCardProps {
  key?: string;
  type: "current" | "review";
  book: any; // Can be CurrentRead or BookReview
  onUpdateProgress?: (id: string, newPage: number) => void;
  onFinish?: (book: CurrentRead) => void;
  onDelete: (id: string, type: "current" | "review") => void;
  onEdit?: (book: CurrentRead) => void;
}

export default function BookCard({
  type,
  book,
  onUpdateProgress,
  onFinish,
  onDelete,
  onEdit
}: BookCardProps) {
  const isCurrent = type === "current";
  const currentBook = book as CurrentRead;
  const reviewBook = book as BookReview;

  // Local state for inline quick progress update
  const [quickPage, setQuickPage] = useState<number>(currentBook.currentPage || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Days since started math
  const getDaysSinceStarted = (startDateStr: string) => {
    const start = new Date(startDateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Started today" : `${diffDays} days on desk`;
  };

  // Find cover text color configuration
  const bgHexColor = book.coverColor || "#c2593f";
  
  // Calculate percentage progress
  const progressPercent = isCurrent
    ? Math.min(100, Math.round((currentBook.currentPage / currentBook.totalPages) * 100))
    : 100;

  const handleProgressChangeSubmit = () => {
    if (onUpdateProgress) {
      const pageNum = Math.max(0, Math.min(currentBook.totalPages, quickPage));
      onUpdateProgress(currentBook.id, pageNum);
      setIsUpdating(false);
    }
  };

  return (
    <div
      id={`book-card-${book.id}`}
      className="bg-white border border-[#e4dec9] rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 flex flex-col md:flex-row h-full"
    >
      {/* Visual Book Cover Column */}
      <div className="md:w-40 w-full flex-none relative p-4 flex items-center justify-center bg-stone-50 border-b md:border-b-0 md:border-r border-[#f3eee0]">
        {/* The tactile virtual book */}
        <div
          className="w-28 h-40 rounded-r-md shadow-lg relative overflow-hidden flex flex-col justify-between p-3 select-none transition-transform duration-300 hover:scale-[1.03] border-l-[4px] border-black/20"
          style={{ backgroundColor: bgHexColor }}
        >
          {/* Subtle spine shadow lines */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-white/10" />
          
          {/* Subtle gold foil border */}
          <div className="absolute inset-1.5 border border-white/15 rounded-sm pointer-events-none" />

          {/* Genre Label / Category */}
          <div className="z-10 bg-white/10 backdrop-blur-xs py-0.5 px-1.5 rounded-sm self-start max-w-full overflow-hidden">
            <p className="text-[9px] font-sans font-semibold tracking-wider text-white/90 uppercase truncate">
              {book.genre}
            </p>
          </div>

          {/* Book Title and Author on Cover */}
          <div className="z-10 mt-2 flex-grow flex flex-col justify-center">
            <h4 className="text-[11px] font-serif font-bold text-white text-center leading-tight line-clamp-3 tracking-wide">
              {book.title}
            </h4>
            <div className="w-6 h-[1px] bg-white/30 my-1 mx-auto" />
            <p className="text-[9px] font-sans font-medium text-white/80 text-center truncate italic">
              {book.author}
            </p>
          </div>

          {/* Cover Footer Accent */}
          <div className="z-10 flex justify-center pt-1 border-t border-white/10">
            <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase">
              RECORDS
            </span>
          </div>
        </div>
      </div>

      {/* Details/Content Column */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Title and Badge row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-sans font-semibold uppercase tracking-wider rounded border border-stone-200">
                  {book.genre}
                </span>
                {isCurrent && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-[#4a6b5d] bg-[#4a6b5d]/10 px-1.5 py-0.5 rounded">
                    <BookOpen className="w-3 h-3" />
                    Reading
                  </span>
                )}
                {!isCurrent && reviewBook.recommendToOthers && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-[#c2593f] bg-[#c2593f]/10 px-1.5 py-0.5 rounded">
                    <ThumbsUp className="w-3 h-3 text-[#c2593f]" />
                    Highly Recommended
                  </span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-stone-900 mt-2 hover:text-[#c2593f] transition-colors leading-tight">
                {book.title}
              </h3>
              <p className="text-sm font-sans text-stone-500 mt-0.5">
                by <span className="font-medium text-stone-700">{book.author}</span>
              </p>
            </div>

            {/* Trash option for absolute safety */}
            <button
              id={`delete-btn-${book.id}`}
              onClick={() => onDelete(book.id, type)}
              title={`Remove ${book.title}`}
              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-none"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Current Read Progress or Review Details */}
          {isCurrent ? (
            <div className="mt-4 bg-stone-50 border border-stone-100 rounded-lg p-3.5">
              <div className="flex justify-between items-center text-xs font-sans text-stone-600 mb-2">
                <span className="font-semibold text-stone-800">Reading Progress</span>
                <span className="font-mono">{progressPercent}% ({currentBook.currentPage} / {currentBook.totalPages} pages)</span>
              </div>
              
              {/* Progress track */}
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className="bg-[#4a6b5d] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Inline Progress Quick Changer */}
              {isUpdating ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-stone-500 font-sans">Current Page:</span>
                  <input
                    type="number"
                    value={quickPage}
                    min={0}
                    max={currentBook.totalPages}
                    onChange={(e) => setQuickPage(parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-white border border-[#e4dec9] rounded text-xs text-stone-900 font-mono text-center focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none"
                  />
                  <button
                    onClick={handleProgressChangeSubmit}
                    className="px-2 py-1 bg-[#4a6b5d] text-white text-xs font-sans font-semibold rounded hover:bg-[#395348] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setQuickPage(currentBook.currentPage);
                      setIsUpdating(false);
                    }}
                    className="px-2 py-1 bg-stone-200 text-stone-600 text-xs font-sans rounded hover:bg-stone-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1 border-t border-stone-200/50">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(currentBook.startDate)}</span>
                    <span className="text-stone-300">•</span>
                    <span>{getDaysSinceStarted(currentBook.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setQuickPage(currentBook.currentPage);
                        setIsUpdating(true);
                      }}
                      className="px-2.5 py-1 text-xs font-sans font-medium text-stone-600 border border-stone-300 rounded hover:bg-stone-100 transition-colors"
                    >
                      Log Page
                    </button>
                    {onFinish && (
                      <button
                        onClick={() => onFinish(currentBook)}
                        className="px-2.5 py-1 text-xs font-sans font-semibold text-white bg-[#c2593f] rounded hover:bg-[#9d432d] transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Finish & Review
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Notes display */}
              {currentBook.notes && (
                <div className="mt-3 text-xs text-stone-600 italic border-l-2 border-stone-300 pl-2 font-serif">
                  "{currentBook.notes}"
                </div>
              )}
            </div>
          ) : (
            // Finished Review Specific Render
            <div className="mt-4 space-y-3">
              {/* Stars display */}
              <div className="flex items-center gap-1 bg-amber-50/60 inline-flex px-2 py-1 rounded border border-amber-100">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= reviewBook.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-serif font-bold text-stone-800 ml-1">
                  {reviewBook.rating}.0 / 5.0
                </span>
              </div>

              {/* Review Text */}
              <blockquote className="text-sm font-serif text-stone-700 italic border-l-2 border-[#e4dec9] pl-3 py-1 bg-[#faf9f5]/50 rounded-r pr-2">
                "{reviewBook.reviewText}"
              </blockquote>

              {/* Finish date log */}
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
                <Calendar className="w-3.5 h-3.5" />
                <span>Completed: {formatDate(reviewBook.finishDate)}</span>
                {reviewBook.startDate && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span>Started: {formatDate(reviewBook.startDate)}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Button for Current Reads */}
        {isCurrent && onEdit && !isUpdating && (
          <div className="mt-4 flex justify-end">
            <button
              id={`edit-btn-${book.id}`}
              onClick={() => onEdit(currentBook)}
              className="text-xs text-stone-400 hover:text-[#4a6b5d] font-sans flex items-center gap-1 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit book info
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
