import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { commongetrequest } from "../../../AllServices/services";

export default function AffiliateLoadingPage() {
  const { id } = useParams(); // AF001 from URL
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(5);
  const progressInterval = useRef<any>();

  // ✅ Check sessionStorage to see if this affiliate link is already validated
  const alreadyValidated = sessionStorage.getItem(`affiliate_${id}`) === "true";

  useEffect(() => {
    if (alreadyValidated) {
      // If already validated, go straight to register
      navigate("/register");
      return;
    }

    smoothProgress();
    validateAffiliate();

    // cleanup
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const smoothProgress = () => {
    let value = 5;
    progressInterval.current = setInterval(() => {
      value += Math.random() * 12;
      if (value < 90) {
        setProgress(Math.floor(value));
      } else {
        clearInterval(progressInterval.current);
      }
    }, 300);
  };

  const validateAffiliate = async () => {
    try {
      const response = await commongetrequest(`admin/affiliate/refer/${id}`);

      if (response?.status === 200) {
        setProgress(100);
        setStatus("success");

        // ✅ Mark as validated in sessionStorage
        sessionStorage.setItem(`affiliate_${id}`, "true");

        // Navigate to register
        navigate("/register");
      } else {
        setStatus("error");
        setErrorMsg("This affiliate link is invalid or expired.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg("This affiliate link is invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="w-[90%] max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#ffcc00] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>

            <div className="mt-8 w-full bg-yellow-800/40 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-[#ffcc00] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✖</div>
            <p className="text-red-400 font-semibold text-lg mb-3">
              Invalid Link
            </p>
            <p className="text-yellow-100/60 text-sm mb-6">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-xl bg-[#ffcc00] text-black font-semibold hover:bg-yellow-400 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
