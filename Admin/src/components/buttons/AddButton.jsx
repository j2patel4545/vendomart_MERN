import "./AnimatedButton.css";

const AddButton = ({ label = "Add Item", onClick }) => {
  return (
    <button type="button" className="button" onClick={onClick}>
      <span className="button__text">{label}</span>
      <span className="button__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </button>
  );
};

export default AddButton;
