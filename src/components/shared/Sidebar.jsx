import PropTypes from "prop-types";
import { useState } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import { LogOut } from "lucide-react"; // Assuming you're using lucide-react for the icon
import { useAuth } from "../../hooks/useAuth";
export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const { logoutUser, user } = useAuth(); // Access the logoutUser function from useAuth

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        <div className="flex ">
          <div className="border-t flex text-xs justify-center items-center">
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
                <h4 className="font-semibold">{user ? user.email : "User"}</h4>
                <span className="text-xs text-gray-600">
                  {user ? user.email : "No email"}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div
            className="p-4 flex items-center space-x-2 cursor-pointer"
            onClick={logoutUser}
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};
