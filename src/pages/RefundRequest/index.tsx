import clsx from "clsx";
import logoUrl from "../../assets/images/icons/Side_logo.png";
import illustrationUrl from "../../assets/images/icons/Skart-Banner-homepage.png";
import { ArrowRight, CheckCircle, Cross, Phone, CreditCard, Building2, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { refundRequestApi } from "../../AllServices/config.service";
import { useAlert } from "../../ContextProvider/AlertContext";
import LoadingIcon from "../../base-components/LoadingIcon";

const Main = () => {
  const { showAlert } = useAlert();
  const { unique_id } = useParams();
  const [mobileNumber, setMobileNumber] = useState("")
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [errors, setErrors] = useState({
    accountHolderName: "",
    mobileNumber: "",
    accountNumber: "",
    ifscCode: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCloseTab = () => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  };

  const validateMobileNumber = (value: string) => {
    if (!value.trim()) return "Mobile number is required";
    if (!/^\d{10}$/.test(value))
      return "Mobile number must contain 10 digits";
    return "";
  };

  const validateAccountNumber = (value: string) => {
    if (!value.trim()) return "Account number is required";
    if (value.length < 9 || value.length > 18)
      return "Account number must be 9-18 digits";
    if (!/^\d+$/.test(value)) return "Account number must contain only digits";
    return "";
  };

  const validateAccountHolderName = (value: string) => {
    if (!value.trim()) return "Account holder name is required";
    if (!/^[A-Za-z\s]+$/.test(value))
      return "Account holder name must contain only letters and spaces";
    if (value.trim().length < 3)
      return "Account holder name must be at least 3 characters long";
    return "";
  };



  const handleAccountHolderNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Allow only letters and spaces while typing
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setAccountHolderName(value);

    if (errors.accountHolderName) {
      setErrors((prev) => ({
        ...prev,
        accountHolderName: validateAccountHolderName(value),
      }));
    }
  };

  const validateIfscCode = (value: string) => {
    if (!value.trim()) return "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase()))
      return "Please enter a valid IFSC code (e.g., SBIN0001234)";
    return "";
  };

  const handleMobileNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setMobileNumber(value);

    if (errors.mobileNumber) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: validateMobileNumber(value),
      }));
    }
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setAccountNumber(value);
    if (errors.accountNumber) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: validateAccountNumber(value),
      }));
    }
  };

  const handleIfscCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setIfscCode(value);
    if (errors.ifscCode) {
      setErrors((prev) => ({ ...prev, ifscCode: validateIfscCode(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountHolderError = validateAccountHolderName(accountHolderName)
    const mobileError = validateMobileNumber(mobileNumber)
    const accountError = validateAccountNumber(accountNumber);
    const ifscError = validateIfscCode(ifscCode);

    setErrors({
      accountHolderName: accountHolderError,
      mobileNumber: mobileError,
      accountNumber: accountError,
      ifscCode: ifscError,
    });

    if (mobileError || accountError || accountHolderError || ifscError) {
      return;
    }

    try {
      setLoading(true);
      const res = await refundRequestApi(unique_id, {
        account_holder_name: accountHolderName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        mobile_number: mobileNumber
      });

      if (res?.status == 200) {
        showAlert(res?.data?.message);
        if (!accountError && !ifscError) {
          // Simulate submission
          setIsSubmitted(true);
          setTimeout(() => {
            handleCloseTab();
            setIsSubmitted(false);
            setMobileNumber("")
            setAccountNumber("");
            setAccountHolderName("");
            setIfscCode("");
          }, 3000);
        }
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <div
          className={clsx([
            "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
            "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
            "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
          ])}
        >
          <div className="container relative z-10 sm:px-10">
            <div className="block grid-cols-2 gap-4 xl:grid">
              <div className="flex-col hidden min-h-screen xl:flex">
                <a href="" className="flex items-center pt-5 -intro-x">
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    className="w-[50%]"
                    src={logoUrl}
                    style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
                  />
                </a>
                <div className="my-auto">
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    className="w-3/4 -mt-36 -intro-x"
                    src={illustrationUrl}
                  />
                  <div className="mt-7 text-2xl font-medium leading-tight text-white -intro-x">
                    sKart Global Express Pvt Ltd
                  </div>
                  <div className="mt-7 text-md text-white -intro-x text-opacity-70 dark:text-slate-400">
                    sKart Global Express Pvt Ltd is a next-gen tech-driven
                    express and
                    <br /> e-commerce Logistics solution provider.
                  </div>
                </div>
              </div>

              <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                <div className="w-full border mx-auto my-auto bg-white rounded-2xl shadow-2xl xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:w-3/4 lg:w-2/4 xl:w-auto max-w-md">
                  <div className="bg-white  p-12  px-12  text-center w-full max-w-lg rounded-2xl shadow-xl">
                    <div className="mb-6 w-full">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 w-full">
                        Refund Request Submitted!
                      </h2>
                      <p className="text-gray-600 w-full">
                        Your refund request has been successfully submitted.
                        We'll process it within 3-5 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-[50%]"
                  src={logoUrl}
                  style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
                />
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-3/4 -mt-36 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-7 text-2xl font-medium leading-tight text-white -intro-x">
                  sKart Global Express Pvt Ltd
                </div>
                <div className="mt-7 text-md text-white -intro-x text-opacity-70 dark:text-slate-400">
                  sKart Global Express Pvt Ltd is a next-gen tech-driven express
                  and
                  <br /> e-commerce Logistics solution provider.
                </div>
              </div>
            </div>

            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full border mx-auto my-auto bg-white rounded-2xl shadow-2xl xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:w-3/4 lg:w-2/4 xl:w-auto max-w-md">
                {unique_id == "00000" ? (
                  <>
                    <div className="bg-white  p-12  px-28  text-center w-full max-w-md rounded-2xl shadow-xl">
                      <div className="bg-red-500 w-20 h-20 mx-auto mb-5 flex justify-center items-center rounded-full text-3xl font-bold">
                        <Cross className="w-8 h-8 text-white -rotate-45 stroke-2.5" />
                      </div>
                      <h1 className="text-red-500 text-2xl mb-2 font-bold">
                        Link Expired !!!
                      </h1>

                      <button
                        className="mt-6 bg-mustard text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-300"
                        onClick={handleCloseTab}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Header */}
                    <div className=" bg-mustard px-8 py-6  rounded-t-2xl shadow-t-2xl ">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-8 h-8 text-white" />
                        <div>
                          <h1 className="text-2xl font-bold text-white">
                            Cashbooking Refund Request
                          </h1>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Enter Your Banking Details
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Please provide your account details to process the
                          refund
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mobile Number Field */}
                        <div>
                          <label
                            htmlFor="mobileNumber"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            Mobile Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="mobileNumber"
                              value={mobileNumber}
                              onChange={handleMobileNumberChange}
                              placeholder="Enter your mobile number"
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.mobileNumber
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                }`}
                              maxLength={10}
                            />
                          </div>
                          {errors.mobileNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.mobileNumber}
                            </p>
                          )}
                        </div>
                        {/* Account Number Field */}
                        <div>
                          <label
                            htmlFor="accountNumber"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            Account Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="accountNumber"
                              value={accountNumber}
                              onChange={handleAccountNumberChange}
                              placeholder="Enter your account number"
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.accountNumber
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                }`}
                              maxLength={18}
                            />
                          </div>
                          {errors.accountNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.accountNumber}
                            </p>
                          )}
                        </div>

                        {/* Account Holder Name Field */}
                        <div>
                          <label
                            htmlFor="accountHolderName"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            Account Holder Name{" "}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="accountHolderName"
                              value={accountHolderName}
                              onChange={handleAccountHolderNameChange}
                              placeholder="Enter account holder name"
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.accountHolderName
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                }`}
                              maxLength={50}
                            />
                          </div>
                          {errors.accountHolderName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.accountHolderName}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Name as per bank records
                          </p>
                        </div>

                        {/* IFSC Code Field */}
                        <div>
                          <label
                            htmlFor="ifscCode"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            IFSC Code
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="ifscCode"
                              value={ifscCode}
                              onChange={handleIfscCodeChange}
                              placeholder="e.g., SBIN0001234"
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.ifscCode
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                }`}
                              maxLength={11}
                            />
                          </div>
                          {errors.ifscCode && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.ifscCode}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Find your IFSC code on your bank statement or
                            checkbook
                          </p>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full text-xl text-white font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 group ${loading ? "bg-gray-400" : "bg-mustard"
                            }`}
                        >
                          <span>Submit Refund Request</span>
                          {loading ? (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          ) : (
                            <ArrowRight className="w-6 h-6 stroke-2.5 group-hover:translate-x-1 transition-transform" />
                          )}
                        </button>
                      </form>

                      {/* Security Notice */}
                      {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                          🔒 Your banking details are encrypted and secure. We
                          never store your account information.
                        </p>
                      </div> */}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
