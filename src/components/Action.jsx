import PropTypes from "prop-types";

const Action = ({ handleClick, type, className }) => {
  return (
    <div className={className} onClick={handleClick}>
      {type}
    </div>
  );
};

Action.propTypes = {
  handleClick: PropTypes.func.isRequired, // handleClick must be a function and is required
  type: PropTypes.string.isRequired, // type must be a string and is required
  className: PropTypes.string, // className must be a string, but it's optional
};

export default Action;
