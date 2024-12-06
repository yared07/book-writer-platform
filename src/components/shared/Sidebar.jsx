import PropTypes from "prop-types";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { useState } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen  ">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          {/* <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button> */}
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3"> {children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex">
          <img
            className="w-10 h-10 rounded-md"
            src="https://ui-avatars.com/api/?background=c7d2fe&color=370a3&bold=true"
            alt=""
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Yared Tadesse</h4>
              <span className="text-xs text-gray-600">
                tadesseyared@gmail.com
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};
