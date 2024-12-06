import PropTypes from "prop-types";
export const ImageInput = ({ label, onChange, error }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result); // Pass the base64 string to the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={`border p-2 w-full rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

ImageInput.propTypes = {
  label: PropTypes.string.isRequired, // The label text for the input
  onChange: PropTypes.func.isRequired, // The callback function to handle the file change (base64 data)
  error: PropTypes.string, // Optional error message
};
