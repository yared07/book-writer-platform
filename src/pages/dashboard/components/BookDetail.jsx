import { useParams } from "react-router-dom";
import { Section } from "./Section";
import { useState, useEffect } from "react";
import axios from "axios";
import useNode from "../../../hooks/useNode";
import toast from "react-hot-toast";

export const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookSections, setBookSections] = useState({});
  const { insertNode, editNode } = useNode();

  const handleInsertNode = (folderId, item) => {
    const finalStructure = insertNode(bookSections, folderId, item);
    setBookSections(finalStructure);
  };

  const handleEditNode = (folderId, value) => {
    const finalStructure = editNode(bookSections, folderId, value);
    setBookSections(finalStructure);
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .put(
        `http://localhost:5001/books/${id}`,
        {
          ...book,
          sections: bookSections,
        },
        config
      )
      .then(() => {
        toast.success("changes saved successful!", {
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.error("Error saving book sections:", error);
        toast.error("Fail to save changes");
        alert("Failed to save changes. Please try again.");
      });
  };

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`http://localhost:5001/books/${id}`, config)
      .then((response) => {
        setBook(response.data);
        if (response.data.sections) {
          setBookSections(response.data.sections);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="p-6 w-full h-screen overflow-y-scroll">
      <div className="max-w-4xl mx-auto overflow-x-scroll">
        <h1 className="text-3xl font-semibold text-indigo-700 mb-6">
          {book.title}
        </h1>

        {/* Render Sections */}
        <div className="border-t pt-6 space-y-6">
          {bookSections && (
            <Section
              section={bookSections}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
            />
          )}
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSaveChanges}
          className="mt-6 px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
