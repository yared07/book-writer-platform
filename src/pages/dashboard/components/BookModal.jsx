// components/BookModal.js

import { motion } from "framer-motion";
import { TextInput } from "../../../components/form/TextInput";
import { ImageInput } from "../../../components/form/ImageInput";
import PropTypes from "prop-types";
export const BookModal = ({
  isOpen,
  onClose,
  isEditing,
  selectedBook,
  newBook,
  setNewBook,
  errors,
  handleSaveBook,
}) => {
  if (!isOpen) return null;
  console.log(selectedBook);
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Book" : "Add New Book"}
        </h2>
        <TextInput
          label="Book Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          error={errors.title}
          placeholder="Enter book title"
        />
        <TextInput
          label="Description"
          value={newBook.description}
          onChange={(e) =>
            setNewBook({ ...newBook, description: e.target.value })
          }
          error={errors.description}
          placeholder="Enter book description"
        />
        <ImageInput
          label="Cover Image"
          onChange={(image) => setNewBook({ ...newBook, coverImage: image })}
          error={errors.coverImage}
        />
        <div className="mt-4">
          <button onClick={handleSaveBook} className="btn btn-primary mr-2">
            Save
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

BookModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // for checking modal open state
  onClose: PropTypes.func.isRequired, // for closing the modal
  isEditing: PropTypes.bool.isRequired, // for editing state
  selectedBook: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
  }), // selectedBook is optional, for editing use
  newBook: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
  }).isRequired, // required fields for adding or editing
  setNewBook: PropTypes.func.isRequired, // function to update newBook state
  errors: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
  }).isRequired, // error messages for form validation
  handleSaveBook: PropTypes.func.isRequired, // function to save the book
};
