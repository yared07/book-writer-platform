import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const [currUser, setCurrUser] = useState(null);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [newCollaboratorRole, setNewCollaboratorRole] =
    useState("Collaborator");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [curCollab, setCurCollab] = useState(null);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    // Decode the token to extract user info (e.g., user ID)
    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub; // Assuming 'userId' is in the token
    } catch (error) {
      console.error("Error decoding token:", error);
      return;
    }

    // Fetch user details with the decoded user ID
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(`http://localhost:5001/users/${userId}`, config)
      .then((response) => {
        setCurrUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, []); // Only run on mount

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail) {
      console.error("Email is required.");
      return;
    }

    if (!currUser) {
      console.error("User not loaded yet.");
      return;
    }

    // Ensure currUser.collaborators is an array
    const collaborators = currUser.collaborators || [];

    // Check if email already exists in current user's collaborators
    const emailExists = collaborators.some(
      (collaborator) => collaborator?.email === newCollaboratorEmail
    );

    if (emailExists) {
      console.error("Collaborator with this email already exists.");
      return;
    }

    const newCollaborator = {
      email: newCollaboratorEmail,
      role: newCollaboratorRole,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Update the user in the DB (this is just an example API call)
    axios
      .put(
        `http://localhost:5001/users/${currUser.id}`,
        { collaborators: [...currUser.collaborators, newCollaborator] },
        config
      )
      .then((response) => {
        setCurrUser(response.data); // Update the state with the new user data
        setNewCollaboratorEmail(""); // Clear email field
        setNewCollaboratorRole("Collaborator"); // Reset role
      })
      .catch((error) => {
        console.error("Error updating collaborator:", error);
      });
  };

  const handleEditCollaborator = (email) => {
    const collaborator = currUser.collaborators.find(
      (collab) => collab.email === email
    );
    console.log("email ", collaborator);
    setCurCollab(collaborator);
    setModalOpen(true);
  };

  const handleSaveEdit = () => {
    // Update the role of the selected collaborator
    console.log(curCollab, "cur coalb");
    const updatedCollaborators = currUser.collaborators.map((collaborator) =>
      collaborator?.email === curCollab?.email
        ? { ...collaborator, role: curCollab?.role }
        : collaborator
    );

    console.log(updatedCollaborators);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Update the user in the DB (this is just an example API call)
    axios
      .put(
        `http://localhost:5001/users/${currUser.id}`,
        { collaborators: updatedCollaborators },
        config
      )
      .then((response) => {
        setCurrUser(response.data); // Update the state with the new user data
        setModalOpen(false); // Close the modal
      })
      .catch((error) => {
        console.error("Error saving collaborator edit:", error);
      });
  };

  console.log("Current Collaborators: ", currUser, currUser?.collaborators);

  return (
    <div className="p-8 min-h-screen overflow-y-scroll">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Collaborator Management
      </h1>

      <div className="space-y-6">
        <h2 className="text-xl text-indigo-600 mb-4">Manage Collaborators</h2>

        {/* Form to add new collaborator */}
        <div className="space-y-4 p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-indigo-700 text-lg">Add a Collaborator</h3>
          <input
            className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder="Collaborator Email"
            value={newCollaboratorEmail}
            onChange={(e) => setNewCollaboratorEmail(e.target.value)}
          />
          <select
            value={newCollaboratorRole}
            onChange={(e) => setNewCollaboratorRole(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Collaborator">Collaborator</option>
            <option value="Author">Author</option>
          </select>
          <button
            onClick={handleAddCollaborator}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Collaborator
          </button>
        </div>

        {/* Collaborator List */}
        <div className="mt-8 overflow-y-auto" style={{ maxHeight: "400px" }}>
          <h3 className="text-lg text-indigo-700">Collaborators List</h3>
          <table className="w-full mt-4 table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-400 text-white">
              <tr>
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currUser?.collaborators?.map((collaborator, index) => (
                <tr key={collaborator?.email} className="text-indigo-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{collaborator?.email}</td>
                  <td className="px-4 py-2">{collaborator?.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        handleEditCollaborator(collaborator?.email)
                      }
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for editing collaborator */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-indigo-700 text-lg">
                Edit Collaborator Role
              </h3>
              <input
                className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={curCollab.email || null}
                disabled
                placeholder="Email"
              />
              <select
                value={curCollab.role || null}
                onChange={(e) =>
                  setCurCollab({ ...curCollab, role: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Collaborator">Collaborator</option>
                <option value="Author">Author</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handleSaveEdit}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
