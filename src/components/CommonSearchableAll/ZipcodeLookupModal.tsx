import React, { Fragment, useEffect, useState } from "react";
import { MapPin, X, Search, CheckCircle2, AlertCircle, Loader2, ClipboardCheck } from "lucide-react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";

const ZIPCODE_LOOKUP_API =
  "https://n8n.srv965283.hstgr.cloud/webhook/95872eb4-2dcd-411c-9f4e-aef74c687ab6";

interface LookupResult {
  message?: string;
  zipcode?: string;
  city?: string;
}

interface ZipcodeLookupModalProps {
  open: boolean;
  onClose: () => void;
  countryName?: string;
  mode?: "zipcode" | "city";
  zipcodeValue?: string;
  cityValue?: string;
  onApply: (result: LookupResult) => void;
}

const ZipcodeLookupModal: React.FC<ZipcodeLookupModalProps> = ({
  open,
  onClose,
  countryName,
  mode = "zipcode",
  zipcodeValue,
  cityValue,
  onApply,
}) => {
  const isCityMode = mode === "city";
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setAddress("");
      setLoading(false);
      setResult(null);
      setError("");
    }
  }, [open]);

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter an address to search.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const parts = [address.trim()];
      if (isCityMode && zipcodeValue === "0000" && cityValue) {
        parts.push(`city = ${cityValue}`);
      }
      if (zipcodeValue) parts.push(`zipcode = ${zipcodeValue}`);
      if (countryName) {
        parts.push(zipcodeValue ? `country = ${countryName}` : countryName);
      }
      const finalAddress = parts.join(", ");
      const res = await fetch(ZIPCODE_LOOKUP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: finalAddress }),
      });
      if (!res.ok) throw new Error(`Lookup failed (status ${res.status}).`);
      const raw = await res.text();
      let data: LookupResult | null = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }
      if (!data?.zipcode) {
        throw new Error(
          data?.message || "No zipcode could be found for this address. Please refine it and try again."
        );
      }
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while looking up the zipcode.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setResult(null);
    setError("");
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-[80]" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel className="w-full max-w-[440px] rounded-2xl overflow-hidden shadow-2xl border border-amber-100 bg-white">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-mustard to-amber-500 px-5 py-4 sm:px-6 sm:py-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 text-white/80 hover:text-white hover:bg-white/15 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-base leading-tight">
                      {isCityMode ? "City Lookup" : "Zipcode Lookup"}
                    </h3>
                    <p className="text-white/85 text-xs mt-0.5">
                      {isCityMode
                        ? "Can't find a city? Search it by address."
                        : "Can't find a zipcode? Search it by address."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-5 sm:px-6 sm:py-6 bg-white">
                {!result ? (
                  <div className="flex flex-col gap-3">
                    {countryName && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 w-fit">
                        <MapPin className="w-3 h-3" />
                        Country: {countryName}
                      </div>
                    )}

                    <label className="text-xs font-semibold text-slate-600">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (error) setError("");
                      }}
                      rows={4}
                      placeholder="e.g. Flat No. 302, Shree Krishna Apartments, MG Road, Andheri East, Mumbai, Maharashtra, 400069"
                      className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-shadow ${
                        error ? "border-red-300 ring-1 ring-red-200" : "border-slate-200"
                      }`}
                    />
                    <p className="text-[11px] text-slate-400 -mt-1">
                      Note: Write your full address including address 1, address 2, city, state, zipcode & country.
                    </p>

                    {error && (
                      <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={loading}
                      className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-mustard text-white font-semibold text-sm py-2.5 hover:opacity-90 active:opacity-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          {isCityMode ? "Search City" : "Search Zipcode"}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">
                          {isCityMode ? "City Found" : "Zipcode Found"}
                        </p>
                        <p className="text-xs text-slate-500">{result?.message || "Lookup completed successfully."}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`rounded-xl border px-3 py-3 flex flex-col gap-0.5 ${
                          isCityMode
                            ? "border-slate-200 bg-slate-50"
                            : "border-amber-200 bg-amber-50"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide ${
                            isCityMode ? "text-slate-500" : "text-amber-600"
                          }`}
                        >
                          Zipcode
                        </span>
                        <span className="text-lg font-bold text-slate-800 tracking-wide">
                          {result?.zipcode}
                        </span>
                      </div>
                      <div
                        className={`rounded-xl border px-3 py-3 flex flex-col gap-0.5 ${
                          isCityMode
                            ? "border-amber-200 bg-amber-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide ${
                            isCityMode ? "text-amber-600" : "text-slate-500"
                          }`}
                        >
                          City
                        </span>
                        <span className="text-lg font-bold text-slate-800 capitalize truncate">
                          {result?.city || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSearchAgain}
                        className="flex-1 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm py-2.5 hover:bg-slate-50 transition-colors"
                      >
                        Search Again
                      </button>
                      <button
                        type="button"
                        onClick={() => onApply(result)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-mustard text-white font-semibold text-sm py-2.5 hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        {isCityMode ? "Use This City" : "Use This Zipcode"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

export default ZipcodeLookupModal;