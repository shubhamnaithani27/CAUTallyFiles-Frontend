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
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
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
        headers: { Authorization: `Bearer ${token}` },
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
      if (updates.username || updates.password) {
        await axios.put(`http://localhost:5000/api/admin/user/${id}`, updates, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (updates.role) {
        await axios.put(`http://localhost:5000/api/admin/user/${id}/role`, { role: updates.role }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers(); // Refresh data
      setEditUser((prev) => ({ ...prev, [id]: {} }));
    } catch (err) {
      console.error('Error saving user updates:', err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
            {files.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">No files found</td>
              </tr>
            ) : (
              files.map((file, index) => (
                <tr key={file.id}>
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
        <h2 className="text-xl font-bold mb-4"> User Management</h2>
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
                      onChange={(e) => handleChange(user.id, 'username', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="password"
                      placeholder="••••••"
                      onChange={(e) => handleChange(user.id, 'password', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      defaultValue={user.role}
                      onChange={(e) => handleChange(user.id, 'role', e.target.value)}
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
// // This code is a React component for an admin dashboard that allows the admin to manage user files and user accounts. It includes features like file download, user editing, and user deletion.
// // The component uses Axios for API requests and React's useState and useEffect hooks for state management and side effects. The UI is styled using Tailwind CSS classes.

// import React, { useEffect, useState } from 'react';

// const AdminDashboard = () => {
//   const [files, setFiles] = useState([]);
//   const [users, setUsers] = useState([]);

//   const mockFiles = [
//     { id: 1, filename: 'a.pdf', fileurl: 'https://example.com/a.pdf' },
//     { id: 2, filename: 'b.txt', fileurl: 'https://example.com/b.txt' },
//   ];

//   const mockUsers = [
//     { id: 1, username: 'john@example.com', password: '123456', role: 'user' },
//     { id: 2, username: 'admin@example.com', password: 'admin123', role: 'admin' },
//   ];

//   useEffect(() => {
//     setFiles(mockFiles);
//     setUsers(mockUsers);
//   }, []);

//   const handleRoleChange = (id, newRole) => {
//     setUsers(users.map(user =>
//       user.id === id ? { ...user, role: newRole } : user
//     ));
//   };

//   const handleInputChange = (id, field, value) => {
//     setUsers(users.map(user =>
//       user.id === id ? { ...user, [field]: value } : user
//     ));
//   };

//   const handleDelete = (id) => {
//     setUsers(users.filter(user => user.id !== id));
//   };

//   return (
//     <div className="p-4 space-y-10">
//       <h2 className="text-2xl font-bold">Admin Dashboard</h2>

//       {/* Box 1: File Viewer */}
//       <div className="border p-4 rounded shadow">
//         <h3 className="text-lg font-semibold mb-2">User Files (Read-only)</h3>
//         <table className="w-full border text-left">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Filename</th>
//               <th>Download</th>
//             </tr>
//           </thead>
//           <tbody>
//             {files.map((file, index) => (
//               <tr key={file.id}>
//                 <td>{index + 1}</td>
//                 <td>{file.filename}</td>
//                 <td>
//                   <a
//                     href={file.fileurl}
//                     download
//                     className="text-blue-500 underline"
//                   >
//                     Download
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Box 2: User Management */}
//       <div className="border p-4 rounded shadow">
//         <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
//         <table className="w-full border text-left">
//           <thead>
//             <tr>
//               <th>User ID</th>
//               <th>Username</th>
//               <th>Password</th>
//               <th>Role</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>
//                   <input
//                     value={user.username}
//                     onChange={(e) => handleInputChange(user.id, 'username', e.target.value)}
//                     className="border px-2 py-1"
//                   />
//                 </td>
//                 <td>
//                   <input
//                     value={user.password}
//                     onChange={(e) => handleInputChange(user.id, 'password', e.target.value)}
//                     className="border px-2 py-1"
//                   />
//                 </td>
//                 <td>
//                   <select
//                     value={user.role}
//                     onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                     className="border px-2 py-1"
//                   >
//                     <option value="user">User</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </td>
//                 <td>
//                   <button
//                     onClick={() => handleDelete(user.id)}
//                     className="text-red-500 underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
