import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // ✅ import AuthContext

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext); // ✅ use logout from context
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);

  const [editUser, setEditUser] = useState({});
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const fetchAllFiles = async () => {
    try {
      const res = await axios.get('https://cautallyfiles-backend.onrender.com/api/files/allfiles', {
        withCredentials: true,
      });
      const filesArray = Array.isArray(res.data) ? res.data : res.data.files || [];
      setFiles(filesArray);
    } catch (err) {
      console.error('Error fetching files:', err);
      setFiles([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://cautallyfiles-backend.onrender.com/api/admin/users', {
        withCredentials: true,
      });
      const usersArray = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchAllFiles();
    fetchUsers();
  }, []);

  const handleDownload = async (id) => {

  try {
    const res = await axios.get(`https://cautallyfiles-backend.onrender.com/api/files/download/${id}`, {
      withCredentials: true,
    });
    
    // Assuming the download URL is in res.data.downloadUrl
    const downloadUrl = res.data.downloadUrl;
    
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      console.error('Download URL not found in response');
    }
    
  } catch (error) {
    console.error('Error downloading file:', error);
  }

  };

  const handleChange = (id, field, value) => {
    setEditUser((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const updates = editUser[id];
    try {
      if (updates?.username || updates?.password) {
        await axios.put(`https://cautallyfiles-backend.onrender.com/api/admin/user/${id}`, updates, {
          withCredentials: true,
        });
      }
      if (updates?.role) {
        await axios.put(
          `https://cautallyfiles-backend.onrender.com/api/admin/user/${id}/role`,
          { role: updates.role },
          { withCredentials: true }
        );
      }
      fetchUsers();
      setEditUser((prev) => ({ ...prev, [id]: {} }));
    } catch (err) {
      console.error('Error saving user updates:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`https://cautallyfiles-backend.onrender.com/api/admin/user/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
    setAddUserError('');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      setAddUserError('All fields are required.');
      return;
    }
    try {
      await axios.post('https://cautallyfiles-backend.onrender.com/api/auth/register', newUser, {
        withCredentials: true,
      });
      alert('User added successfully!');
      setNewUser({ username: '', password: '', role: 'user' });
      setShowAddUser(false);
      fetchUsers();
    } catch (err) {
      setAddUserError(err.response?.data?.message || 'Failed to add user.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 space-y-10">
      {/* Top bar with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

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
                      onClick={() => handleDownload(file.id)}
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Management</h2>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showAddUser ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {showAddUser && (
          <form
            onSubmit={handleAddUser}
            className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg shadow"
          >
            {addUserError && <p className="text-red-500 text-sm">{addUserError}</p>}
            <div>
              <label className="block mb-1 text-gray-700">Username (email)</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleNewUserChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Add User
            </button>
          </form>
        )}

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


