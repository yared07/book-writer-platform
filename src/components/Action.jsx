import PropTypes from "prop-types";

const Action = ({ handleClick, type, className, disabled }) => {
  return (
    <button disabled={disabled} className={className} onClick={handleClick}>
      {type}
    </button>
  );
};

Action.propTypes = {
  handleClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Action;
