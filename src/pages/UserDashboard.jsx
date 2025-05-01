import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [myFiles, setMyFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);

  // Fetch all files (from all users)
  const fetchAllFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files/allfiles', {
        withCredentials: true,  // ✅ Assuming cookie-based auth
      });
      console.log('[UserDashboard] Fetched all files:', response.data);

      const fetchedFiles = Array.isArray(response.data.files) ? response.data.files : [];
      setAllFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching all files:', err);
    }
  };

  // Fetch user's own files
  const fetchMyFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files/myfiles', {
        withCredentials: true,  // ✅ Assuming cookie-based auth
      });
      console.log('[UserDashboard] Fetched my files:', response.data);

      const fetchedFiles = Array.isArray(response.data.files) ? response.data.files : [];
      setMyFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching my files:', err);
    }
  };

  // Upload file handler
  const handleFileUpload = async () => {
    if (!fileToUpload) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[UserDashboard] File upload response:', response.data);

      const newFile = response.data.file;

      if (newFile) {
        setMyFiles((prev) => [...prev, newFile]);
        setAllFiles((prev) => [...prev, newFile]);  // Optionally add to allFiles too
      } else {
        console.warn('Unexpected upload response format:', response.data);
        fetchMyFiles();  // fallback: re-fetch my files
        fetchAllFiles(); // refresh all files too
      }

      setFileToUpload(null);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileToUpload(file);
  };

  // Download file handler
  const handleDownload = async (fileUrl, filename = 'downloaded_file') => {
    try {
      const response = await axios.get(fileUrl, {
        withCredentials: true,
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  // On component mount, fetch both sets of files
  useEffect(() => {
    fetchAllFiles();
    fetchMyFiles();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>

        {/* Upload File Section */}
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

        {/* My Files Table */}
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
                      onClick={() => handleDownload(file.fileurl, file.filename)}
                      className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* All Files Table */}
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
                      onClick={() => handleDownload(file.fileurl, file.filename)}
                      className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
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
