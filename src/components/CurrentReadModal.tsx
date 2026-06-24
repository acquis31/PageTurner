/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentRead, GENRES, COVER_COLORS } from "../types";
import { X, Book, Bookmark, Layers, Calendar, Edit2 } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CurrentReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<CurrentRead, "id"> & { id?: string }) => void;
  editingBook?: CurrentRead | null;
}

export default function CurrentReadModal({
  isOpen,
  onClose,
  onSubmit,
  editingBook,
}: CurrentReadModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [totalPages, setTotalPages] = useState(300);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0].hex);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Initialize with editingBook if present
  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setGenre(editingBook.genre);
      setTotalPages(editingBook.totalPages);
      setCurrentPage(editingBook.currentPage);
      setStartDate(editingBook.startDate);
      setCoverColor(editingBook.coverColor);
      setNotes(editingBook.notes || "");
    } else {
      // Reset form
      setTitle("");
      setAuthor("");
      setGenre(GENRES[0]);
      setTotalPages(300);
      setCurrentPage(0);
      setStartDate(new Date().toISOString().split("T")[0]);
      setCoverColor(COVER_COLORS[0].hex);
      setNotes("");
    }
    setError("");
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !author.trim()) {
      setError("Please provide both the book title and author.");
      return;
    }

    if (totalPages <= 0) {
      setError("Total pages must be a number greater than 0.");
      return;
    }

    if (currentPage < 0) {
      setError("Current page cannot be negative.");
      return;
    }

    if (currentPage > totalPages) {
      setError("Current page cannot be greater than the book's total pages.");
      return;
    }

    onSubmit({
      id: editingBook?.id,
      title: title.trim(),
      author: author.trim(),
      genre,
      totalPages,
      currentPage,
      startDate,
      coverColor,
      notes: notes.trim(),
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
            <Book className="w-5 h-5 text-[#4a6b5d]" />
            <h2 className="text-lg font-serif font-bold text-stone-900">
              {editingBook ? "Edit Currently Reading Book" : "Add Currently Reading Book"}
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

          {/* Book Details */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., East of Eden"
                className="w-full px-3.5 py-2 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none placeholder-stone-400 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Author Name *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., John Steinbeck"
                className="w-full px-3.5 py-2 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none placeholder-stone-400 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Genre / Category
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none font-sans"
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
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Reading Progress Counters */}
          <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-150">
            <div>
              <label className="block text-xs font-sans font-bold text-stone-600 uppercase tracking-wider mb-1">
                Total Pages
              </label>
              <input
                type="number"
                min={1}
                required
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-stone-600 uppercase tracking-wider mb-1">
                Current Page
              </label>
              <input
                type="number"
                min={0}
                required
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Cover Color Picker */}
          <div>
            <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-2">
              Book Cover Canvas Theme
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3" id="cover-colors-grid">
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

          {/* Journal / Notes */}
          <div>
            <label className="block text-xs font-sans font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Initial Thoughts & Marginalia (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record any quotes, bookmarks, page highlights, or current reading goals..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-[#e4dec9] rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-[#4a6b5d] focus:outline-none placeholder-stone-400 font-serif italic"
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
              className="px-5 py-2 bg-[#4a6b5d] hover:bg-[#395348] text-white text-sm font-sans font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {editingBook ? "Save Changes" : "Place on Shelf"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
