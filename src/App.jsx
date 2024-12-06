import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Settings, Book } from "lucide-react";
import Sidebar from "./components/shared/Sidebar";
import SidebarItem from "./components/shared/SidebarItem";

import BooksPage from "./pages/dashboard/BooksPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar>
            <SidebarItem
              icon={<Book size={20} />}
              text="Books List"
              to="/dashboard/books"
            />
            <SidebarItem
              icon={<Settings size={20} />}
              text="Settings"
              to="/dashboard/settings"
            />
          </Sidebar>
        </div>

        <div className="flex-1 p-4">
          <Routes>
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/books" element={<BooksPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
