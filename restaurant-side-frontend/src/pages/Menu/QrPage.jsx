import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Copy, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import qrService from "../../services/qr.service.js";

const QrPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [qrImage, setQrImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrLink = `http://localhost:5173/${restaurantId}`;

  useEffect(() => {
    qrService.generateQR(qrLink).then(setQrImage);
  }, [restaurantId]);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `dinear-qr-${restaurantId}.png`;
    link.click();
  };

  const printQR = () => {
    const win = window.open("");
    win.document.write(`<img src="${qrImage}" style="width:300px;" />`);
    win.print();
    win.close();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(qrLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center" style={{ backgroundColor: '#0C0F14' }}>
      
      {/* Back Button */}
      <div className="w-full max-w-4xl mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          style={{ 
            backgroundColor: '#1C222B',
            color: '#9AA0A6'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#E6E9EF'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9AA0A6'}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight" style={{ color: '#E6E9EF' }}>
            Restaurant QR Code
          </h1>
          <p className="text-sm" style={{ color: '#9AA0A6' }}>
            Share this QR code with your customers to access your digital menu
          </p>
        </div>

        {/* QR Card */}
        <div 
          className="mx-auto w-fit p-8 rounded-2xl"
          style={{ backgroundColor: '#1A1F25' }}
        >
          {/* QR Container */}
          <div className="space-y-6">
            
            {/* QR Image */}
            <div className="mx-auto w-fit">
              {qrImage ? (
                <div className="p-6 bg-white rounded-xl">
                  <img
                    src={qrImage}
                    className="w-64 h-64"
                    alt="QR Code"
                  />
                </div>
              ) : (
                <div 
                  className="w-64 h-64 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#1C222B' }}
                >
                  <div className="text-center space-y-3">
                    <div 
                      className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mx-auto"
                      style={{ borderColor: '#3D8BFF', borderTopColor: 'transparent' }}
                    ></div>
                    <p className="text-sm" style={{ color: '#9AA0A6' }}>
                      Generating QR Code...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Link */}
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#11151C' }}
            >
              <p className="text-xs mb-1 font-medium" style={{ color: '#9AA0A6' }}>
                Menu URL
              </p>
              <p 
                className="text-xs break-all font-mono"
                style={{ color: '#E6E9EF' }}
              >
                {qrLink}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={downloadQR}
                className="px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#3D8BFF',
                  color: '#E6E9EF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#52B7FF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D8BFF'}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              
              <button
                onClick={printQR}
                className="px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#1C222B',
                  color: '#E6E9EF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A313B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C222B'}
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              
              <button
                onClick={copyLink}
                className="px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 relative"
                style={{ 
                  backgroundColor: '#1C222B',
                  color: copied ? '#4CCB5A' : '#E6E9EF'
                }}
                onMouseEnter={(e) => {
                  if (!copied) e.currentTarget.style.backgroundColor = '#2A313B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1C222B';
                }}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPage;