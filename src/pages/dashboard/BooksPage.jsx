import { useState } from "react";
import { motion } from "framer-motion"; // For animations

// Using random image URLs for public images
const booksData = [
  {
    id: 1,
    title: "The Great Gatsby",
    description: "A classic novel about the American Dream.",
    coverImage:
      "data:image/jpeg;base64,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",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    description: "A gripping, heart-wrenching story about racial injustice.",
    coverImage: "https://picsum.photos/250/250?random=2",
  },
  {
    id: 3,
    title: "1984",
    description: "A dystopian novel set in a totalitarian regime.",
    coverImage: "https://picsum.photos/250/250?random=3",
  },
  {
    id: 4,
    title: "Moby Dick",
    description: "A thrilling tale of obsession and revenge on the high seas.",
    coverImage: "https://picsum.photos/250/250?random=4",
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    description: "A story of love and social standing in 19th-century England.",
    coverImage: "https://picsum.photos/250/250?random=5",
  },
  {
    id: 6,
    title: "War and Peace",
    description:
      "A sweeping historical novel about Napoleon's invasion of Russia.",
    coverImage: "https://picsum.photos/250/250?random=6",
  },
];

export default function BooksPage() {
  const [books, setBooks] = useState(booksData);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-indigo-700 mb-6">
        Books List
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {books.map((book) => (
          <motion.div
            key={book.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-indigo-800">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{book.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
