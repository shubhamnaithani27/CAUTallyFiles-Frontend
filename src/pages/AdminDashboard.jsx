import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);

  // Editable fields state
  const [editUser, setEditUser] = useState({});

  // Fetch all user files
  const fetchAllFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/files/allfiles', {
        withCredentials: true,
      });
      console.log('Files response:', res.data);  // ✅ Debugging log
      // Safely access files array
      const filesArray = Array.isArray(res.data)
        ? res.data
        : res.data.files || [];
      setFiles(filesArray);
    } catch (err) {
      console.error('Error fetching files:', err);
      setFiles([]);  // Set empty array if error
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        withCredentials: true,
      });
      console.log('Users response:', res.data);  // ✅ Debugging log
      const usersArray = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];
      setUsers(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);  // Set empty array if error
    }
  };

  useEffect(() => {
    fetchAllFiles();
    fetchUsers();
  }, []);

  // Handle download
  const handleDownload = async (url) => {
    try {
      const res = await axios.get(url, {
        withCredentials: true,
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'downloaded_file';
      link.click();
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  // Handle input changes for edit
  const handleChange = (id, field, value) => {
    setEditUser((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Save changes to user
  const handleSave = async (id) => {
    const updates = editUser[id];
    try {
      if (updates?.username || updates?.password) {
        await axios.put(`http://localhost:5000/api/admin/user/${id}`, updates, {
          withCredentials: true,
        });
      }
      if (updates?.role) {
        await axios.put(
          `http://localhost:5000/api/admin/user/${id}/role`,
          { role: updates.role },
          {
            withCredentials: true,
          }
        );
      }
      fetchUsers(); // Refresh data
      setEditUser((prev) => ({ ...prev, [id]: {} }));
    } catch (err) {
      console.error('Error saving user updates:', err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 space-y-10">
      {/* Box 1 – User Files */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">All User Files</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Serial No.</th>
              <th className="border px-4 py-2 text-left">Filename</th>
              <th className="border px-4 py-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(files) || files.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  No files found
                </td>
              </tr>
            ) : (
              files.map((file, index) => (
                <tr key={file.id || index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{file.filename}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDownload(file.fileurl)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Box 2 – User Management */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Password</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const current = editUser[user.id] || {};
              return (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      defaultValue={user.username}
                      onChange={(e) =>
                        handleChange(user.id, 'username', e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="password"
                      placeholder="••••••"
                      onChange={(e) =>
                        handleChange(user.id, 'password', e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      defaultValue={user.role}
                      onChange={(e) =>
                        handleChange(user.id, 'role', e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
