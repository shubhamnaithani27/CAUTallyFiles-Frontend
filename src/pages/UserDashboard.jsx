import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // ✅ adjust path if needed

const UserDashboard = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [myFiles, setMyFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const { logout } = useContext(AuthContext); // ✅ get logout

  const fetchAllFiles = async () => {
    try {
      const response = await axios.get('https://cautallyfiles-backend.onrender.com/api/files/allfiles', {
        withCredentials: true,
      });
      const fetchedFiles = Array.isArray(response.data.files) ? response.data.files : [];
      setAllFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching all files:', err);
    }
  };

  const fetchMyFiles = async () => {
    try {
      const response = await axios.get('https://cautallyfiles-backend.onrender.com/api/files/myfiles', {
        withCredentials: true,
      });
      const fetchedFiles = Array.isArray(response.data.files) ? response.data.files : [];
      setMyFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching my files:', err);
    }
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await axios.post('https://cautallyfiles-backend.onrender.com/api/files/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newFile = response.data.file;
      if (newFile) {
        setMyFiles((prev) => [...prev, newFile]);
        setAllFiles((prev) => [...prev, newFile]);
      } else {
        fetchMyFiles();
        fetchAllFiles();
      }

      setFileToUpload(null);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileToUpload(file);
  };

  const handleDownload = async (id) => {
    
    try {
      const res = await axios.get(`https://cautallyfiles-backend.onrender.com/api/files/download/${id}`, {
        withCredentials: true,
      });
      
 
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

  useEffect(() => {
    fetchAllFiles();
    fetchMyFiles();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Dashboard</h2>
          <button
            onClick={logout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <div className="mb-6 text-right">
          <input
            type="file"
            onChange={handleFileChange}
            className="border px-4 py-2 rounded-md"
            accept="*/*"
          />
          <button
            onClick={handleFileUpload}
            className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={!fileToUpload}
          >
            Upload File
          </button>
        </div>

        {/* My Files */}
        <h3 className="text-xl font-semibold mb-4">My Files</h3>
        <table className="w-full table-auto border-collapse mb-8">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Serial No.</th>
              <th className="border px-4 py-2 text-left">File Name</th>
              <th className="border px-4 py-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {myFiles.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">No files uploaded yet</td>
              </tr>
            ) : (
              myFiles.map((file, index) => (
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

        {/* All Files */}
        <h3 className="text-xl font-semibold mb-4">All Files</h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Serial No.</th>
              <th className="border px-4 py-2 text-left">File Name</th>
              <th className="border px-4 py-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {allFiles.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">No files found</td>
              </tr>
            ) : (
              allFiles.map((file, index) => (
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
    </div>
  );
};

export default UserDashboard;
