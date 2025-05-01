// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const UserDashboard = () => {
//   const { token } = useContext(AuthContext);
//   const [files, setFiles] = useState([]);
//   const [fileToUpload, setFileToUpload] = useState(null);

//   // Fetch user files
//   const fetchFiles = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/files/myfiles', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setFiles(response.data);
//     } catch (err) {
//       console.error('Error fetching files:', err);
//     }
//   };

//   // Upload file handler
//   const handleFileUpload = async () => {
//     if (!fileToUpload) {
//       alert('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', fileToUpload);

//     try {
//       const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       // Once file is uploaded, fetch updated list
//       fetchFiles();
//       setFileToUpload(null); // Clear file after upload
//     } catch (err) {
//       console.error('Error uploading file:', err);
//     }
//   };

//   // Handle file selection (only allow one file at a time)
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFileToUpload(file); // Only one file allowed
//   };

//   // Download file handler (any user's files)
//   const handleDownload = async (fileUrl) => {
//     try {
//       const response = await axios.get(fileUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: 'blob',
//       });
//       const blob = new Blob([response.data], { type: 'application/octet-stream' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = 'downloaded_file';
//       link.click();
//     } catch (err) {
//       console.error('Error downloading file:', err);
//     }
//   };

//   // On component mount, fetch files
//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   return (
//     <div className="min-h-screen p-4 bg-gray-100">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>

//         {/* Upload File Button */}
//         <div className="mb-4 text-right">
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="border px-4 py-2 rounded-md"
//             accept="*/*" // Allow any type of file
//           />
//           <button
//             onClick={handleFileUpload}
//             className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
//             disabled={!fileToUpload} // Disable if no file is selected
//           >
//             Upload File
//           </button>
//         </div>

//         {/* Files Table */}
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2 text-left">Serial No.</th>
//               <th className="border px-4 py-2 text-left">File Name</th>
//               <th className="border px-4 py-2 text-left">Download</th>
//             </tr>
//           </thead>
//           <tbody>
//             {files.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="border px-4 py-2 text-center">No files uploaded yet</td>
//               </tr>
//             ) : (
//               files.map((file, index) => (
//                 <tr key={file.id}>
//                   <td className="border px-4 py-2">{index + 1}</td>
//                   <td className="border px-4 py-2">{file.filename}</td>
//                   <td className="border px-4 py-2">
//                     <button
//                       onClick={() => handleDownload(file.fileurl)}
//                       className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
//                     >
//                       Download
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;




// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const UserDashboard = () => {
//   const { token } = useContext(AuthContext);
//   const [files, setFiles] = useState([]);
//   const [fileToUpload, setFileToUpload] = useState(null);

//   // Fetch all files (from all users)
//   const fetchFiles = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/files/allfiles', {
//         headers: {
//           Authorization: `Bearer ${token}`, // Use the JWT token to authenticate
//         },
//       });
//       setFiles(response.data); // Set the response data to state
//     } catch (err) {
//       console.error('Error fetching files:', err);
//     }
//   };

//   // Upload file handler
//   const handleFileUpload = async () => {
//     if (!fileToUpload) {
//       alert('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', fileToUpload);

//     try {
//       const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       // Once file is uploaded, fetch the updated list of files
//       fetchFiles();
//       setFileToUpload(null); // Clear file after upload
//     } catch (err) {
//       console.error('Error uploading file:', err);
//     }
//   };

//   // Handle file selection (only allow one file at a time)
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFileToUpload(file); // Only one file allowed
//   };

//   // Download file handler (any user's files)
//   const handleDownload = async (fileUrl) => {
//     try {
//       const response = await axios.get(fileUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: 'blob',
//       });
//       const blob = new Blob([response.data], { type: 'application/octet-stream' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = 'downloaded_file'; // Change the filename if needed
//       link.click();
//     } catch (err) {
//       console.error('Error downloading file:', err);
//     }
//   };

//   // On component mount, fetch files
//   useEffect(() => {
//     fetchFiles();
//   }, []); // Only run once after the component mounts

//   return (
//     <div className="min-h-screen p-4 bg-gray-100">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>

//         {/* Upload File Button */}
//         <div className="mb-4 text-right">
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="border px-4 py-2 rounded-md"
//             accept="*/*" // Allow any type of file
//           />
//           <button
//             onClick={handleFileUpload}
//             className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
//             disabled={!fileToUpload} // Disable if no file is selected
//           >
//             Upload File
//           </button>
//         </div>

//         {/* Files Table */}
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2 text-left">Serial No.</th>
//               <th className="border px-4 py-2 text-left">File Name</th>
//               <th className="border px-4 py-2 text-left">Download</th>
//             </tr>
//           </thead>
//           <tbody>
//             {files.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="border px-4 py-2 text-center">
//                   No files uploaded yet
//                 </td>
//               </tr>
//             ) : (
//               files.map((file, index) => (
//                 <tr key={file.id}>
//                   <td className="border px-4 py-2">{index + 1}</td>
//                   <td className="border px-4 py-2">{file.filename}</td>
//                   <td className="border px-4 py-2">
//                     <button
//                       onClick={() => handleDownload(file.fileurl)} // Trigger file download on click
//                       className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
//                     >
//                       Download
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;





import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);

  // Mock file data
  const mockFiles = [
    { id: 1, filename: 'a.pdf', fileurl: 'https://example.com/a.pdf' },
    { id: 2, filename: 'b.txt', fileurl: 'https://example.com/b.txt' },
  ];

  useEffect(() => {
    setFiles(mockFiles);
  }, []);

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!newFile) return;
    const uploaded = {
      id: files.length + 1,
      filename: newFile.name,
      fileurl: URL.createObjectURL(newFile),
    };
    setFiles([...files, uploaded]);
    setNewFile(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Dashboard</h2>

      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="*"
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Upload File
        </button>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr>
            <th>#</th>
            <th>Filename</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file.id}>
              <td>{index + 1}</td>
              <td>{file.filename}</td>
              <td>
                <a
                  href={file.fileurl}
                  download
                  className="text-blue-500 underline"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;

