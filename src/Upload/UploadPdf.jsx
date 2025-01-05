import * as React from 'react';
import crypto from 'crypto-js';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

const UploadTwoPDFs = () => {
  const [pdf1, setPdf1] = useState(null);
  const [pdf2, setPdf2] = useState(null);
  const [hash1, setHash1] = useState([]);
  const [hash2, setHash2] = useState([]);
  const [message, setMessage] = useState('');

  const generatePageHashes = async (file) => {
    const pdfData = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const pageHashes = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str).join(' '); // Extract text from page
      const hash = crypto.SHA256(text).toString(); // Generate hash of the text content
      pageHashes.push(`Page ${i}: ${hash}`);
    }

    return pageHashes;
  };

  const handleFile1Change = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdf1(file);
      const fileHashes = await generatePageHashes(file);
      setHash1(fileHashes);
    }
  };

  const handleFile2Change = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdf2(file);
      const fileHashes = await generatePageHashes(file);
      setHash2(fileHashes);
    }
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (!pdf1 || !pdf2) {
      setMessage('Please select both PDF files.');
      return;
    }
    setMessage('PDF files uploaded successfully!');
    console.log('PDF 1 Hashes:', hash1);
    console.log('PDF 2 Hashes:', hash2);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Two PDF Files</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select First PDF</label>
          <input type="file" accept=".pdf" onChange={handleFile1Change} className="block w-full p-2 border border-gray-300 rounded-md" />
          {hash1.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <p className="font-semibold">Hashes for PDF 1:</p>
              {hash1.map((h, i) => (
                <p key={i}>{h}</p>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Select Second PDF</label>
          <input type="file" accept=".pdf" onChange={handleFile2Change} className="block w-full p-2 border border-gray-300 rounded-md" />
          {hash2.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <p className="font-semibold">Hashes for PDF 2:</p>
              {hash2.map((h, i) => (
                <p key={i}>{h}</p>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Upload PDFs
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default UploadTwoPDFs;
