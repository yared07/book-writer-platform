import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { TextInput } from "../../../components/form/TextInput";
import Action from "../../../components/Action";
import { ChevronDown, ChevronUp } from "lucide-react";

export const Section = ({ section, handleInsertNode, handleEditNode }) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(true);
  const isCollaborator = localStorage.getItem("account") === "collaborate";

  const inputRef = useRef(null);
  const handleNewSection = () => {
    setShowInput(true);
    setExpand(!expand);
  };

  const onAddMainSection = () => {
    if (editMode) {
      handleEditNode(section.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      setShowInput(false);
      handleInsertNode(section.id, input);
      setInput("");
    }
    setEditMode(false);
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  return (
    <div className="ml-4 border-l pl-6">
      {/* Main Section */}
      {section.id === 1 ? (
        <div className="mb-4 flex gap-2 items-center bg-white rounded-lg shadow-lg p-4">
          <TextInput
            label="New Subsection"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter New Subsection"
            value={input}
            className="w-full"
            disabled={isCollaborator}
          />
          <Action
            className={`w-36 h-10 mt-2 flex justify-center items-center font-semibold rounded-md shadow-lg  transition-opacity ${
              isCollaborator
                ? "bg-indigo-300 text-white opacity-50 cursor-not-allowed"
                : "bg-indigo-700 text-white"
            }`}
            type="Add Main Section"
            handleClick={onAddMainSection}
            disabled={isCollaborator}
          />
        </div>
      ) : (
        <div className="bg-white my-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-center">
            <span
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              className="font-semibold text-xl text-gray-800"
            >
              {section.title}
            </span>
            <div className="flex gap-3 items-center">
              {editMode ? (
                <>
                  <Action
                    className="text-sm"
                    type="Save"
                    handleClick={onAddMainSection}
                  />
                  <Action
                    className="text-sm"
                    type="Cancel"
                    handleClick={() => {
                      if (inputRef.current)
                        inputRef.current.innerText = section.title;
                      setEditMode(false);
                    }}
                  />
                </>
              ) : (
                <>
                  <Action
                    className="text-sm flex items-center gap-1"
                    type={
                      <>
                        {expand ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                        Subsection
                      </>
                    }
                    handleClick={handleNewSection}
                  />
                  <Action
                    className="text-sm"
                    type="Edit"
                    handleClick={() => setEditMode(true)}
                  />
                  <Action className="text-sm" type="Delete" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input for New Subsection */}
      {showInput && (
        <div className="flex gap-2 items-center pl-6">
          <TextInput
            label="New Subsection"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter New Subsection"
            value={input}
            className="w-full"
            disabled={isCollaborator}
          />
          <div className="flex gap-2">
            <Action
              className="bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-md p-1"
              type="Add Subsection"
              handleClick={onAddMainSection}
              disabled={isCollaborator}
            />
            <Action
              className="text-sm font-semibold text-gray-600 p-1 bg-gray-200 rounded-md"
              type="Cancel"
              handleClick={() => setShowInput(false)}
            />
          </div>
        </div>
      )}

      {/* Recursively Render Subsections */}
      <div className={`${expand ? "block" : "hidden"} pl-6`}>
        {section.subsections?.map((sub) => (
          <Section
            key={sub.id}
            section={sub}
            handleInsertNode={handleInsertNode}
            handleEditNode={handleEditNode}
          />
        ))}
      </div>
    </div>
  );
};

// Define PropTypes
Section.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    subsections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string,
        subsections: PropTypes.array,
      })
    ),
  }).isRequired,
};
