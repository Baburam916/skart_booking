import React, { useRef, useState } from "react";
import CommonModal from "../../../components/CommonModal";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { uploadShipperInvoiceApi } from "../../../AllServices/config.service";

interface InvoiceUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: (url: string) => void;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const InvoiceUploadModal: React.FC<InvoiceUploadModalProps> = ({
  open,
  onClose,
  onUploaded,
}) => {
  const { showAlert } = useAlert();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setFileName("No file chosen");
    setUploading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    if (!allowed.includes(selected.type)) {
      showAlert("Only JPG, PNG, GIF, WEBP or PDF files are allowed.", "warning");
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      showAlert(`File size must not exceed ${MAX_FILE_SIZE_MB} MB.`, "warning");
      return;
    }
    setFile(selected);
    setFileName(selected.name);
  };

  const handleSubmit = async () => {
    if (!file) {
      showAlert("Please select a file first.", "warning");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("shipper_invoice", file);
    try {
      const response = await uploadShipperInvoiceApi(formData);
      if (response?.data?.status === 200) {
        const url = response.data?.shipper_url ?? "";
        onUploaded(url);
        reset();
        onClose();
      } else {
        showAlert("Error while uploading Shipper Invoice", "error");
        setFileName("No file chosen");
      }
    } catch (err) {
      console.log(err);
      showAlert("Error while uploading Shipper Invoice", "error");
      setFileName("No file chosen");
    } finally {
      setUploading(false);
    }
  };

  const modalTitle = <span>Upload Invoice</span>;

  const modalBody = (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-yellow-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0-3 3m3-3 3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
        </svg>
        <p className="text-slate-500 text-sm text-center">
          Tap to browse or drag &amp; drop
          <br />
          <span className="text-xs text-slate-400">JPG · PNG · PDF &nbsp;|&nbsp; Max {MAX_FILE_SIZE_MB} MB</span>
        </p>
        {file && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-mustard font-medium max-w-full">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="truncate">{fileName}</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );

  const modalFooter = (
    <div className="flex items-center justify-end gap-2 w-full">
      <button
        type="button"
        onClick={handleClose}
        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || uploading}
        className="px-5 py-2 rounded-lg bg-mustard text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Uploading...
          </>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );

  return (
    <CommonModal
      open={open}
      setOpen={handleClose}
      title={modalTitle}
      description={modalBody}
      footer={modalFooter}
      size="md"
      gridColumns={1}
    />
  );
};

export default InvoiceUploadModal;
