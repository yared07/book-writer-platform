import PropTypes from "prop-types";

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  error,
}) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 w-full rounded ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired, // The label text for the input
  value: PropTypes.string.isRequired, // The value of the input field
  onChange: PropTypes.func.isRequired, // The callback function to handle input changes
  placeholder: PropTypes.string, // Optional placeholder text
  error: PropTypes.string, // Optional error message
};
