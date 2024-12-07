import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
export const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/dashboard/books/${book.id}`);
  };
  return (
    <motion.div
      key={book.id}
      className="bg-white shadow-lg rounded-lg h-96 overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl"
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
      <div className="p-2">
        <h2 className="text-lg font-semibold text-indigo-800">{book.title}</h2>
        <p className="text-sm text-gray-600 mt-2">{book.description}</p>

        <button
          onClick={handleViewDetail}
          className="absolute bottom-2 right-2 text-xs bg-gray-200 text-black px-2 py-1 rounded-lg hover:bg-indigo-700 transition opacity-70 hover:opacity-100"
        >
          See Detail
        </button>
      </div>
    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string.isRequired,
  }).isRequired,
};
