import { LayoutDashboard, Settings, Book, Home } from "lucide-react";
import Sidebar from "./components/shared/Sidebar";
import SidebarItem from "./components/shared/SidebarItem";

function App() {
  return (
    <main>
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          alert
        />
        <SidebarItem icon={<Home size={20} />} text="Home" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<Book size={20} />} text="Books List" />
      </Sidebar>
    </main>
  );
}

export default App;
