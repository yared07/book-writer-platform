import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [currUser, setCurrUser] = useState(null);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [newCollaboratorPassword, setNewCollaboratorPassword] = useState("");
  const [newCollaboratorRole, setNewCollaboratorRole] =
    useState("Collaborator");
  const isCollaborator = localStorage.getItem("account") === "collaborate";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub; // Assuming 'userId' is in the token
    } catch (error) {
      console.error("Error decoding token:", error);
      return;
    }

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
  }, []);

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail || !newCollaboratorPassword) {
      console.error("Email and password are required.");
      return;
    }

    if (!currUser) {
      console.error("User not loaded yet.");
      return;
    }

    const collaborators = currUser.collaborators || [];

    const emailExists = collaborators.some(
      (collaborator) => collaborator.email === newCollaboratorEmail
    );

    if (emailExists) {
      console.error("Collaborator with this email already exists.");
      toast.error("Email already exist");
      return;
    }

    const newCollaborator = {
      email: newCollaboratorEmail,
      password: newCollaboratorPassword, // New password field
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

    axios
      .put(
        `http://localhost:5001/users/${currUser.id}`,
        { newCollaborator },
        config
      )
      .then((response) => {
        setCurrUser(response.data); // Update the state with the new user data
        setNewCollaboratorEmail(""); // Clear email field
        setNewCollaboratorPassword(""); // Clear password field
        setNewCollaboratorRole("Collaborator"); // Reset role
        toast.success("Collaborator added successfully.");
      })
      .catch((error) => {
        console.error("Error updating collaborator:", error);
      });
  };

  console.log("Current Collaborators: ", currUser?.collaborators);

  return (
    <div className="p-8 min-h-screen overflow-y-scroll">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Collaborator Management
      </h1>

      <div className="space-y-6">
        <h2 className="text-xl text-indigo-600 mb-4">Manage Collaborators</h2>

        {/* Form to add new collaborator */}
        <div
          className={`space-y-4 p-6 bg-white shadow-md rounded-lg ${
            isCollaborator ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h3 className="text-indigo-700 text-lg">Add a Collaborator</h3>
          <input
            className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder="Collaborator Email"
            value={newCollaboratorEmail}
            onChange={(e) => setNewCollaboratorEmail(e.target.value)}
            disabled={isCollaborator}
          />
          <input
            className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Collaborator Password"
            value={newCollaboratorPassword}
            onChange={(e) => setNewCollaboratorPassword(e.target.value)}
            disabled={isCollaborator}
          />
          <select
            value={newCollaboratorRole}
            onChange={(e) => setNewCollaboratorRole(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isCollaborator}
          >
            <option value="Collaborator">Collaborator</option>
            <option value="Author">Author</option>
          </select>
          <button
            onClick={handleAddCollaborator}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            disabled={isCollaborator}
          >
            Add Collaborator
          </button>
        </div>

        {/* Collaborator List */}
        <div className="mt-8 overflow-y-scroll">
          <h3 className="text-lg text-indigo-700">Collaborators List</h3>
          <table className="w-full mt-4 table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-400 text-white">
              <tr>
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Password</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currUser?.collaborators?.map((collaborator, index) => (
                <tr key={collaborator.index} className="text-indigo-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{collaborator.email}</td>
                  <td
                    className={`px-4 py-2 ${
                      isCollaborator ? "filter blur-sm" : ""
                    }`}
                  >
                    {collaborator.password}
                  </td>
                  <td className="px-4 py-2">{collaborator.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditCollaborator(collaborator.email)}
                      className={`bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 ${
                        isCollaborator ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
