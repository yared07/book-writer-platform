import { useState } from "react";
import PropTypes from "prop-types";
import { TextInput } from "../../../components/form/TextInput";
import Action from "../../../components/Action";
import { ChevronDown, ChevronUp } from "lucide-react";

export const Section = ({ section, handleInsertNode }) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleNewSection = () => {
    setShowInput(true);
    setExpand(!expand);
  };

  const onAddMainSection = () => {
    setExpand(true);
    setShowInput(false);
    handleInsertNode(section.id, input);
    setInput("");
  };

  return (
    <div className="ml-4 border-l pl-4">
      {section.id === 1 ? (
        <div className="mb-4 flex flex-row  w-full gap-2  items-center  ">
          <TextInput
            label="New Subsection"
            onChange={(e) => setInput(e.target.value)}
            pl
            aceholder="Enter New Subsection"
            value={input}
          />
          <Action
            className="bg-indigo-700 text-white w-36 h-10 mt-2 flex justify-center items-center font-semibold"
            type="Add Main Section"
            handleClick={onAddMainSection}
          />
        </div>
      ) : (
        <div className="bg-indigo-50 my-2 p-2 rounded-md">
          <span className="font-semibold"> {section.title} </span>
          <div className="flex  gap-5">
            {editMode ? (
              <>
                <Action className="text-sm" type="Save" />
                <Action
                  className="text-sm"
                  type="Cancel"
                  handleClick={() => setEditMode(false)}
                />
              </>
            ) : (
              <>
                <Action
                  className="text-sm flex flex-row justify-center items-center gap-1"
                  type={
                    <>
                      {expand ? (
                        <ChevronUp size={10} />
                      ) : (
                        <ChevronDown size={10} />
                      )}{" "}
                      subsection
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
      )}

      {/* Recursively render subsections */}
      <div className={`${expand ? "block" : "hidden"}`}>
        {showInput && (
          <div className="flex flex-row gap-2 items-center pl-5 ">
            <TextInput
              label="New Subsection"
              onChange={(e) => setInput(e.target.value)}
              pl
              aceholder="Enter New Subsection"
              value={input}
            />
            <Action
              className="text-sm"
              type="Add subsection "
              handleClick={onAddMainSection}
            />
            <Action
              className="text-sm"
              type="Cancel"
              handleClick={() => {
                setShowInput(false);
              }}
            />
          </div>
        )}
        {section.subsections?.map((sub) => {
          return (
            <Section
              key={sub.id}
              section={sub}
              handleInsertNode={handleInsertNode}
            />
          );
        })}
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
