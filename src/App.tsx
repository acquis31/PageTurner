/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { BookOpen, Bookmark, Award, Plus, Search, Filter, RotateCcw, HelpCircle, ArrowUpDown, Star } from "lucide-react";
import { CurrentRead, BookReview, BookStats, GENRES } from "./types";
import { INITIAL_CURRENT_READS, INITIAL_REVIEWS } from "./data";
import BookStatsHeader from "./components/BookStatsHeader";
import BookCard from "./components/BookCard";
import CurrentReadModal from "./components/CurrentReadModal";
import ReviewModal from "./components/ReviewModal";

export default function App() {
  // --- Persistent States ---
  const [currentReads, setCurrentReads] = useState<CurrentRead[]>(() => {
    try {
      const saved = localStorage.getItem("book_reads_active");
      return saved ? JSON.parse(saved) : INITIAL_CURRENT_READS;
    } catch {
      return INITIAL_CURRENT_READS;
    }
  });

  const [reviews, setReviews] = useState<BookReview[]>(() => {
    try {
      const saved = localStorage.getItem("book_reviews");
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("book_reads_active", JSON.stringify(currentReads));
  }, [currentReads]);

  useEffect(() => {
    localStorage.setItem("book_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // --- Active Tab and Filters ---
  const [activeTab, setActiveTab] = useState<"reading" | "reviews">("reading");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState<number | "All">("All");
  const [sortBy, setSortBy] = useState<"title" | "date" | "rating">("date");

  // --- Modal Open States ---
  const [isCurrentModalOpen, setIsCurrentModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<CurrentRead | null>(null);
  const [transitioningBook, setTransitioningBook] = useState<CurrentRead | null>(null);

  // --- Stats Computation ---
  const stats = useMemo<BookStats>(() => {
    const currentlyReadingCount = currentReads.length;
    const completedCount = reviews.length;
    
    // Total pages = current pages on desk + all pages from completed books
    const currentPages = currentReads.reduce((sum, b) => sum + b.currentPage, 0);
    // For finished reviews, we assume the user read the full book. Let's check if we can estimate total finished pages.
    // Let's assume an average book length of 320 pages if not recorded, or we can look up if we had pages, but since BookReview does not have a totalPages field by default to keep the schema simple, we can estimate it or just sum the logged pages. Let's keep it as sum of current reads' pages + a healthy 300 pages multiplier per finished book! Or even better, let's keep it as is.
    const completedEstimatedPages = completedCount * 310;
    const totalPagesRead = currentPages + completedEstimatedPages;

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = completedCount > 0 ? totalRating / completedCount : 0;

    return {
      currentlyReadingCount,
      completedCount,
      totalPagesRead,
      averageRating,
    };
  }, [currentReads, reviews]);

  // --- Actions ---
  const handleAddOrEditCurrentRead = (bookData: Omit<CurrentRead, "id"> & { id?: string }) => {
    if (bookData.id) {
      // Editing
      setCurrentReads((prev) =>
        prev.map((b) => (b.id === bookData.id ? { ...b, ...bookData } as CurrentRead : b))
      );
    } else {
      // Creating
      const newBook: CurrentRead = {
        ...bookData,
        id: `cr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setCurrentReads((prev) => [newBook, ...prev]);
    }
  };

  const handleUpdateProgress = (id: string, newPage: number) => {
    setCurrentReads((prev) =>
      prev.map((b) => (b.id === id ? { ...b, currentPage: newPage } : b))
    );
  };

  const handleFinishBookTrigger = (book: CurrentRead) => {
    setTransitioningBook(book);
    setIsReviewModalOpen(true);
  };

  const handleAddReview = (reviewData: Omit<BookReview, "id"> & { id?: string; sourceCurrentReadId?: string }) => {
    const { sourceCurrentReadId, ...cleanReviewData } = reviewData;

    const newReview: BookReview = {
      ...cleanReviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setReviews((prev) => [newReview, ...prev]);

    // If this came from a currently reading book, remove it from active reads
    if (sourceCurrentReadId) {
      setCurrentReads((prev) => prev.filter((b) => b.id !== sourceCurrentReadId));
    }
  };

  const handleDeleteBook = (id: string, type: "current" | "review") => {
    if (window.confirm(`Are you sure you want to delete this book record?`)) {
      if (type === "current") {
        setCurrentReads((prev) => prev.filter((b) => b.id !== id));
      } else {
        setReviews((prev) => prev.filter((b) => b.id !== id));
      }
    }
  };

  const handleEditBookTrigger = (book: CurrentRead) => {
    setEditingBook(book);
    setIsCurrentModalOpen(true);
  };

  const handleResetDemoData = () => {
    if (window.confirm("Would you like to reset all trackers and restore the sample demo books?")) {
      setCurrentReads(INITIAL_CURRENT_READS);
      setReviews(INITIAL_REVIEWS);
      setSearchQuery("");
      setGenreFilter("All");
      setRatingFilter("All");
    }
  };

  // --- Filtering & Sorting Logic ---
  const filteredCurrentReads = useMemo(() => {
    return currentReads
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = genreFilter === "All" || book.genre === genreFilter;
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        // default to start date sorting
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
  }, [currentReads, searchQuery, genreFilter, sortBy]);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = genreFilter === "All" || book.genre === genreFilter;
        const matchesRating = ratingFilter === "All" || book.rating === Number(ratingFilter);
        return matchesSearch && matchesGenre && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        // default to finish date sorting
        return new Date(b.finishDate).getTime() - new Date(a.finishDate).getTime();
      });
  }, [reviews, searchQuery, genreFilter, ratingFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-[#c2593f]/20 pb-16">
      
      {/* Editorial Navigation Top Header */}
      <header className="border-b border-[#e4dec9] bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c2593f]/10 rounded-xl text-[#c2593f]">
              <Bookmark className="w-5 h-5 fill-[#c2593f]" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                Reader's Corner
              </h1>
              <p className="text-xs text-stone-500 font-sans tracking-wide">
                Your personal workspace for current reads & book reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="add-current-read-btn"
              onClick={() => {
                setEditingBook(null);
                setIsCurrentModalOpen(true);
              }}
              className="px-4 py-2 bg-[#4a6b5d] hover:bg-[#395348] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </button>
            <button
              id="add-review-btn"
              onClick={() => {
                setTransitioningBook(null);
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2 bg-[#c2593f] hover:bg-[#9d432d] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Dynamic Stats Row */}
        <section id="reading-stats-section" aria-label="Reading Statistics">
          <BookStatsHeader stats={stats} />
        </section>

        {/* Shelf Filters & Controls Grid */}
        <section className="bg-white border border-[#e4dec9] rounded-2xl p-5 shadow-xs space-y-4" id="shelf-controls">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Elegant Tab Selectors */}
            <div className="flex border border-stone-200 p-1.5 bg-stone-50 rounded-xl max-w-xs sm:max-w-md w-full">
              <button
                id="tab-active-reads"
                onClick={() => {
                  setActiveTab("reading");
                  setSearchQuery("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "reading"
                    ? "bg-[#4a6b5d] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Desk ({currentReads.length})</span>
              </button>
              <button
                id="tab-book-reviews"
                onClick={() => {
                  setActiveTab("reviews");
                  setSearchQuery("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-[#c2593f] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Finished Shelf ({reviews.length})</span>
              </button>
            </div>

            {/* Shelf Actions & Search bar */}
            <div className="flex flex-col sm:flex-row flex-grow lg:justify-end items-stretch gap-3">
              {/* Search text box */}
              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "reading"
                      ? "Search current books by title, author..."
                      : "Search reviews by title, author, keyword..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl text-xs text-stone-900 focus:outline-none placeholder-stone-400"
                />
              </div>

              {/* Filtering Controls */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 text-stone-700 py-2.5 pl-3 pr-8 rounded-xl text-xs focus:outline-none focus:border-stone-400 cursor-pointer"
                  >
                    <option value="All">All Genres</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-2.5 top-3 w-3 h-3 text-stone-400 pointer-events-none" />
                </div>

                {activeTab === "reviews" && (
                  <div className="relative">
                    <select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
                      className="appearance-none bg-stone-50 border border-stone-200 text-stone-700 py-2.5 pl-3 pr-8 rounded-xl text-xs focus:outline-none focus:border-stone-400 cursor-pointer"
                    >
                      <option value="All">All Ratings</option>
                      <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                      <option value="3">⭐⭐⭐ (3 stars)</option>
                      <option value="2">⭐⭐ (2 stars)</option>
                      <option value="1">⭐ (1 star)</option>
                    </select>
                    <Star className="absolute right-2.5 top-3 w-3 h-3 text-stone-400 pointer-events-none" />
                  </div>
                )}

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-stone-50 border border-stone-200 text-stone-700 py-2.5 pl-3 pr-8 rounded-xl text-xs focus:outline-none focus:border-stone-400 cursor-pointer"
                  >
                    <option value="date">
                      {activeTab === "reading" ? "Date Started" : "Date Finished"}
                    </option>
                    <option value="title">Title (A-Z)</option>
                    {activeTab === "reviews" && <option value="rating">Rating (High-Low)</option>}
                  </select>
                  <ArrowUpDown className="absolute right-2.5 top-3 w-3 h-3 text-stone-400 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* List of Books Shelf */}
        <section id="book-shelf-display" className="space-y-6">
          {activeTab === "reading" ? (
            filteredCurrentReads.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="active-reads-grid">
                {filteredCurrentReads.map((book) => (
                  <BookCard
                    key={book.id}
                    type="current"
                    book={book}
                    onUpdateProgress={handleUpdateProgress}
                    onFinish={handleFinishBookTrigger}
                    onDelete={handleDeleteBook}
                    onEdit={handleEditBookTrigger}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e4dec9] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
                <BookOpen className="w-12 h-12 text-[#4a6b5d]/30 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-stone-800">No active books found</h3>
                <p className="text-sm text-stone-500 font-sans mt-2 max-w-md mx-auto">
                  {searchQuery || genreFilter !== "All"
                    ? "Try adjusting your filters or search keywords to locate your books."
                    : "Your desk is currently empty! Add a book you are currently reading to track your progress and write marginalia notes."}
                </p>
                {!searchQuery && genreFilter === "All" && (
                  <button
                    onClick={() => {
                      setEditingBook(null);
                      setIsCurrentModalOpen(true);
                    }}
                    className="mt-6 px-4 py-2.5 bg-[#4a6b5d] hover:bg-[#395348] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Track Your First Book</span>
                  </button>
                )}
              </div>
            )
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="reviews-grid">
              {filteredReviews.map((book) => (
                <BookCard
                  key={book.id}
                  type="review"
                  book={book}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e4dec9] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
              <Award className="w-12 h-12 text-[#c2593f]/30 mx-auto mb-4" />
              <h3 className="text-lg font-serif font-bold text-stone-800">No reviews found</h3>
              <p className="text-sm text-stone-500 font-sans mt-2 max-w-md mx-auto">
                {searchQuery || genreFilter !== "All" || ratingFilter !== "All"
                  ? "Try adjusting your search query, genre selection, or star rating filter."
                  : "You haven't written any book reviews yet! Once you finish an active read, you can review it, or add review entries directly."}
              </p>
              {!searchQuery && genreFilter === "All" && ratingFilter === "All" && (
                <button
                  onClick={() => {
                    setTransitioningBook(null);
                    setIsReviewModalOpen(true);
                  }}
                  className="mt-6 px-4 py-2.5 bg-[#c2593f] hover:bg-[#9d432d] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Your First Review</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Demo Controller Utility */}
        <section className="flex justify-center pt-8 border-t border-[#e4dec9]/50" id="util-controls">
          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer font-sans"
            title="Reset to initial book review and reading data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </section>
      </main>

      {/* --- Modals Portal --- */}
      <CurrentReadModal
        isOpen={isCurrentModalOpen}
        onClose={() => {
          setIsCurrentModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleAddOrEditCurrentRead}
        editingBook={editingBook}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setTransitioningBook(null);
        }}
        onSubmit={handleAddReview}
        transitionFromBook={transitioningBook}
      />
    </div>
  );
}
