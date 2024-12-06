import { useEffect, useState } from "react";
import { BookCard } from "./components/BookCard";
import { FaEdit } from "react-icons/fa";
import { BookModal } from "./components/BookModal";
import axios from "axios";

const booksData = [
  {
    id: 1,
    title: "The Great Gatsby",
    description: "A classic novel about the American Dream.",
    coverImage: "https://picsum.photos/250/250?random=1",
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    description: "",
    coverImage: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((response) => {
        const fetchedBooks = response.data;
        const mergedBooks = [...booksData, ...fetchedBooks];
        setBooks(mergedBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleAddBook = () => {
    setNewBook({ title: "", description: "", coverImage: "" });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setNewBook({
      title: book.title,
      description: book.description,
      coverImage: book.coverImage,
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSaveBook = () => {
    const newErrors = {};
    if (!newBook.title) newErrors.title = "Title is required.";
    if (!newBook.description)
      newErrors.description = "Description is required.";
    if (!newBook.coverImage) newErrors.coverImage = "Cover image is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const saveOrUpdateBook = isEditing
      ? axios.put(`http://localhost:5000/books/${selectedBook.id}`, newBook)
      : axios.post("http://localhost:5000/books", newBook);

    saveOrUpdateBook
      .then((response) => {
        if (isEditing) {
          setBooks(
            books.map((book) =>
              book.id === selectedBook.id ? response.data : book
            )
          );
        } else {
          setBooks([...books, response.data]);
        }
        setModalOpen(false);
      })
      .catch((err) => console.error("Error saving book:", err));
  };

  return (
    <div className="p-6 w-full">
      <div className="w-full flex flex-row justify-between p-2">
        <h1 className="text-3xl font-semibold text-indigo-700 mb-6">
          Books List
        </h1>

        <button
          onClick={handleAddBook}
          className="px-8 bg-indigo-600 text-xl text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Add Book
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {books.map((book) => (
          <div className="relative group" key={book.id}>
            <BookCard book={book} />
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => handleEditBook(book)}
                className="text-white bg-indigo-600 p-2 rounded-full"
              >
                <FaEdit size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        isEditing={isEditing}
        selectedBook={selectedBook}
        newBook={newBook}
        setNewBook={setNewBook}
        errors={errors}
        handleSaveBook={handleSaveBook}
      />
    </div>
  );
}
