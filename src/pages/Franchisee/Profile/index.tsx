import React, { useEffect, useRef, useState } from "react";
import {
  FormInput,
  FormLabel,
  FormSwitch,
  FormTextarea,
  InputGroup,
} from "../../../base-components/Form";
import {
  Phone,
  Mail,
  MapPin,
  Coins,
  ListChecks,
  Shield,
  Wallet,
} from "lucide-react";
import Button from "../../../base-components/Button";
import {
  getCountryApi,
  editProfileSendOtpApi,
  editProfileVerifyOtpApi,
  getCurrencyApi,
  getFranchiseeDetailsApi,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import CommonModal from "../../../components/CommonModal";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Lucide from "../../../base-components/Lucide";
import { downloadAttachment } from "../../../utils";

const main = () => {
  const { showAlert } = useAlert();
  const { franchiseeId } = useFranchisee();
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    secondaryMobile: "",
    secondaryEmail: "",
    address: "",
    two_fac_auth: 0,
    emails: {
      ops: "",
      cs: "",
      finance: "",
      info: "",
      promo: "",
      auth: "",
    },
  });
  const [otpModal, setOtpModal] = useState(false);
  const refs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(60);
  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;
  const [sendOtpSpinner, setSendOtpSpinner] = useState(false);
  const [verifyOtpSpinner, setVerifyOtpSpinner] = useState(false);
  const [resendOtpSpinner, setResendOtpSpinner] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [countryIcon, setCountryIcon] = useState({});
  const [pincode, setPincode] = useState();
  const fetchData = async () => {
    try {
      const res = await getFranchiseeDetailsApi(franchiseeId);
      if (res?.status == 200) {

        setCountryIcon(res?.data?.data[0]?.billing_address)
        countryData(res?.data?.data[0]?.billing_address)
        const allData = res?.data?.data[0];
        setData(allData);
        setFormData((prev) => ({
          ...prev,
          address: allData?.communication_address?.address || "",
          secondaryMobile: allData?.contacts?.[1]?.mobile_no || "",
          secondaryEmail: allData?.secondary_email || "",
          two_fac_auth: allData?.two_fac_auth || 0,
          emails: {
            ops: allData?.emails?.ops || allData?.email_id || "",
            cs: allData?.emails?.cs || allData?.email_id || "",
            finance: allData?.emails?.finance || allData?.email_id || "",
            info: allData?.emails?.info || allData?.email_id || "",
            promo: allData?.emails?.promo || allData?.email_id || "",
            auth: allData?.emails?.auth || allData?.email_id || "",
          },
        }));
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  const countryData = async (data: any) => {
    try {
      const res = await getCountryApi();
      if (res?.status == 200) {
        const singleCountry = res?.data?.data?.find((elem: any) => elem?.country_name?.toLowerCase() == data?.country_name?.toLowerCase());
        setCountryIcon(singleCountry?.country_code || 'IN')
        setPincode(singleCountry?.isd_code || '91')
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error?.message)
    }



  }

  const handleSendOtp = async () => {
    if (
      !formData?.address &&
      !formData?.secondaryMobile &&
      !formData?.secondaryEmail
    ) {
      showAlert(
        "Please provide at least one of the following: Address, Secondary Mobile or Secondary Email.",
        "warning"
      );
      return;
    }

    try {
      const res = await editProfileSendOtpApi({
        franchisee_id: franchiseeId || "",
        address: formData?.address || "",
        number: formData?.secondaryMobile || "",
        secondary_email: formData?.secondaryEmail || "",
        two_fac_auth: formData?.two_fac_auth || 0,
        emails: formData?.emails,
      });
      if (res?.status == 200) {
        setOtpModal(true);
        setStartTimer(true);
        setTimer(300);
        showAlert(res?.data?.message);
      } else if (res?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setSendOtpSpinner(false);
      setVerifyOtpSpinner(false);
      setResendOtpSpinner(false);
    }
  };
  const handleVerifyOtp = async () => {
    setVerifyOtpSpinner(true);
    try {
      const res = await editProfileVerifyOtpApi({
        franchisee_id: franchiseeId || "",
        otp: otp?.join(""),
      });
      if (res?.status == 200) {
        showAlert(res?.data?.message);
        fetchData();
        setOtpModal(false);
      } else if (res?.status == 203) {
        showAlert(res?.data?.message, "error");
      } else if (res?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setVerifyOtpSpinner(false);
    }
  };

  const handleChange = (index: any, event: any) => {
    const newOTP = [...otp];
    newOTP[index] = event.target.value;
    setOtp(newOTP);
    if (event.target.value && index < otp.length - 1) {
      refs.current[index + 1].focus();
    }
  };
  const handleKeyPress = (index: any, event: any) => {
    if (event.key === " ") {
      event.preventDefault();
      return;
    }
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1].focus();
    }

    if (
      (event.key === "Enter" || event.key === "NumpadEnter") &&
      index == otp.length - 1 &&
      otp.join("").length == 6
    ) {
      handleVerifyOtp();
    }
  };
  const checklength = () => {
    const data = otp?.filter((item) => {
      if (item) {
        return item;
      }
    });
    return data?.length == 4;
  };

  const ModalDescription = (
    <>
      <p className="text-center">Enter 4-digit OTP</p>
      <div className="flex justify-center mt-4">
        <div className="flex space-x-4">
          {otp?.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyPress(index, e)}
              className="w-10 h-10 shadow-lg  text-center text-primary  border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              ref={(input) => (refs.current[index] = input)}
            />
          ))}
        </div>
      </div>

      <div className="pt-6 px-12 text-center">
        {startTimer ? (
          <p>
            RESEND OTP IN: {minutes < 10 ? `0${minutes}` : minutes}:
            {remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
          </p>
        ) : (
          <Button
            className="w-full bg-mustard text-white"
            onClick={() => {
              setResendOtpSpinner(true);
              handleSendOtp();
            }}
            disabled={resendOtpSpinner}
          >
            Resend OTP
            {resendOtpSpinner && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>
        )}
      </div>
    </>
  );

  const ModalFooter = (
    <>
      <Button
        className="bg-mustard text-white"
        disabled={!checklength(otp) || verifyOtpSpinner}
        onClick={handleVerifyOtp}
      >
        Verify
        {verifyOtpSpinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </>
  );

  useEffect(() => {
    if (!otpModal) {
      setOtp(["", "", "", ""]);
    }
  }, [otpModal]);

  useEffect(() => {
    if (timer == 0) {
      setStartTimer(false);
      // setResendOtp(true);
      setTimer(60);
    } else {
      if (startTimer) {
        //   setResendOtp(false);
        const value = setInterval(() => {
          if (timer > 0) {
            setTimer((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);
        return () => clearInterval(value);
      }
    }
  }, [timer, startTimer]);

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
    fetchData();
  }, []);
  useEffect(() => {
  }, [])
  return (
    <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-lg px-8 py-4 my-4">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-center text-mustard">
          My Profile
        </h1>
      </div>

      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="grid grid-cols-2 gap-4">
        <h1 className="text-2xl font-semibold  ">
          Company Name :{" "}
          <span className="text-mustard">{data?.franchisee_name}</span>
        </h1>

        <div className="flex justify-end gap-4 my-4 w-full">
          <Button
            className="bg-mustard text-white  flex items-center justify-center space-x-2 py-2 rounded-md"
            onClick={() =>
              downloadAttachment(
                "https://skartnew-dev.s3.ap-southeast-1.amazonaws.com/T%26C/1747808227508-KnowYourCustomer.docx",
                "KYC Form"
              )
            }
          >
            <Lucide icon="Contact" className="h-5 stroke-2.5 text-white mr-2" />
            KYC Form
          </Button>
          <Button
            className="bg-mustard text-white  flex items-center justify-center space-x-2 py-2 rounded-md"
            onClick={() =>
              downloadAttachment(
                "https://skartnew-dev.s3.amazonaws.com/T%26C/1747808212576-Skart_Authority.pdf",
                "Authorization Letter"
              )
            }
          >
            <Lucide
              icon="FolderKey"
              className="h-5 stroke-2.5 text-white mr-2"
            />
            Authorization Letter
          </Button>
        </div>
      </div>

      {/* Mobile Numbers Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Phone className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Mobile Number</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel
              htmlFor="primaryMobile"
              className="block text-sm font-medium"
            >
              Primary Mobile Number :
            </FormLabel>

            <InputGroup>
              <InputGroup.Text
                id="mobile_number"
                className="flex items-center justify-center"
              >
                <img
                  src={`https://flagsapi.com/${countryIcon}/flat/32.png`}
                  aria-disabled
                  alt="india-flag"
                  className="mr-1 w-6 h-5"
                />
                +{pincode}
              </InputGroup.Text>
              <FormInput
                id="mobile_number"
                type="text"
                value={data?.contacts?.[0]?.mobile_no || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300  transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-0"
              />
            </InputGroup>
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="secondaryMobile"
              className="block text-sm font-medium"
            >
              Secondary Mobile Number :
            </FormLabel>

            <InputGroup>
              <InputGroup.Text
                id="mobile_number2"
                className="flex items-center justify-center"
              >
                <img
                  src={`https://flagsapi.com/${countryIcon}/flat/32.png`}
                  alt="india-flag"
                  className="mr-1 w-6 h-5"
                />
                +{pincode}
              </InputGroup.Text>
              <FormInput
                id="mobile_number2"
                type="tel"
                value={formData?.secondaryMobile || ""}
                maxLength={10}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    secondaryMobile: e.target.value.replace(/[^0-9.]/g, ""),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-0"
                placeholder="Enter secondary mobile number"
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Email Addresses Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Mail className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Email Address</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel
              htmlFor="primaryEmail"
              className="block text-sm font-medium"
            >
              Primary Email Address :
            </FormLabel>
            <FormInput
              id="primaryEmail"
              type="email"
              value={data?.email_id || ""}
              // onChange={handleChange}
              disabled
              placeholder="Enter primary email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="secondaryEmail"
              className="block text-sm font-medium"
            >
              Secondary Email Address:
            </FormLabel>
            <FormInput
              id="secondaryEmail"
              type="email"
              value={formData.secondaryEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  secondaryEmail: e.target.value,
                }))
              }
              placeholder="Enter secondary email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              required
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            />

            {/* Error Message */}
            {formData?.secondaryEmail &&
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                formData?.secondaryEmail
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Currency Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Wallet className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Currency</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel htmlFor="currency" className="block text-sm font-medium">
              Selected Currency :
            </FormLabel>
            <FormInput
              id="currency"
              type="text"
              value={
                currencyData?.find((item) => item?.id == data?.currency)
                  ?.currency || "N.A."
              }
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2"></div>
        </div>
      </div>

      {/* G.S.T Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Coins className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">G.S.T</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel
              htmlFor="primaryEmail"
              className="block text-sm font-medium"
            >
              G.S.T Status :
            </FormLabel>
            <FormInput
              id="primaryEmail"
              type="gst_status"
              value={
                data?.gst_status == 1
                  ? "Registered"
                  : data?.gst_status == 2
                    ? "Un-Registered"
                    : ""
              }
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {data?.gst_status == 1 && (
            <div className="space-y-2">
              <FormLabel
                htmlFor="primaryEmail"
                className="block text-sm font-medium"
              >
                G.S.T Number :
              </FormLabel>
              <FormInput
                id="primaryEmail"
                type="gstin"
                value={data?.gstin || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Billing Address Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <ListChecks className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Billing Address</h2>
        </div>
        <div className="space-y-2">
          <FormLabel htmlFor="address" className="block text-sm font-medium">
            G.S.T Address :
          </FormLabel>
          <FormInput
            id="address"
            type="text"
            value={
              `${data?.billing_address?.address}, ${data?.billing_address?.address2}, ${data?.billing_address?.city}, ${data?.billing_address?.state}, ${data?.billing_address?.pincode}` ||
              ""
            }
            disabled
            className="border border-gray-300"
          />
        </div>
      </div>

      {/* Communication Address Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <MapPin className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Communication Address</h2>
        </div>
        <div className="space-y-2">
          <FormLabel htmlFor="address" className="block text-sm font-medium">
             Full Address <span className="text-red-500">*</span> : 
          </FormLabel>
          <FormTextarea
            id="address"
            value={formData?.address || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            placeholder="Enter your complete address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Email Addresses Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Mail className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Customize Emails</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <FormLabel
              htmlFor="opsEmail"
              className="block text-sm font-medium whitespace-nowrap"
            >
              Operation Email Address :
            </FormLabel>
            <FormInput
              id="opsEmail"
              type="email"
              value={formData?.emails?.ops || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emails: {
                    ...prev.emails,
                    ops: e.target.value,
                  },
                }))
              }
              placeholder="Enter Operation email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {/* Error Message */}
            {formData?.emails?.ops &&
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                formData?.emails?.ops
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="csEmail"
              className="block text-sm font-medium whitespace-nowrap"
            >
              Customer Service Email Address :
            </FormLabel>
            <FormInput
              id="csEmail"
              type="email"
              value={formData?.emails?.cs || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emails: {
                    ...prev.emails,
                    cs: e.target.value,
                  },
                }))
              }
              placeholder="Enter Customer Service Email Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData?.emails?.cs &&
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                formData?.emails?.cs
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="financeEmail"
              className="block text-sm font-medium whitespace-nowrap"
            >
              Finance Email Address :
            </FormLabel>
            <FormInput
              id="financeEmail"
              type="email"
              value={formData?.emails?.finance || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emails: {
                    ...prev.emails,
                    finance: e.target.value,
                  },
                }))
              }
              placeholder="Enter Finance email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData?.emails?.finance &&
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                formData?.emails?.finance
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="infoEmail"
              className="block text-sm font-medium whitespace-nowrap"
            >
              Informative Email Address :
            </FormLabel>
            <FormInput
              id="infoEmail"
              type="email"
              value={formData?.emails?.info || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emails: {
                    ...prev.emails,
                    info: e.target.value,
                  },
                }))
              }
              placeholder="Enter Informative email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData?.emails?.info &&
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                formData?.emails?.info
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="promoEmail"
              className="block text-sm font-medium whitespace-nowrap"
            >
              Promotional Email Address :
            </FormLabel>
            <FormInput
              id="promoEmail"
              type="email"
              value={formData?.emails?.promo || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emails: {
                    ...prev.emails,
                    promo: e.target.value,
                  },
                }))
              }
              placeholder="Enter Promotional email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData?.emails?.promo &&
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                formData?.emails?.promo
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
          </div>
          <div className="space-y-2">
            <FormLabel
              htmlFor="authEmail"
              className="block text-sm font-medium whitespace-nowrap"
            >
              Authentication Email Address :
            </FormLabel>
            <FormInput
              id="authEmail"
              type="email"
              value={formData?.emails?.auth || ""}
              // onChange={(e) =>
              //   setFormData((prev) => ({
              //     ...prev,
              //     emails: {
              //       ...prev.emails,
              //       auth: e.target.value,
              //     },
              //   }))
              // }
              disabled
              placeholder="Enter Authentication email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Two Factor Authentication Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Shield className="w-5 h-5 stroke-2.5 text-mustard" />
          <h2 className="text-mustard">Two Factor Authentication</h2>
        </div>
        <div className="space-y-2">
          <div className="mt-2">
            <FormSwitch>
              <FormSwitch.Label htmlFor="checkbox-switch-7" className="mr-4">
                Enable Two Factor Authentication :
              </FormSwitch.Label>
              <FormSwitch.Input
                id="checkbox-switch-7"
                type="checkbox"
                className="text-mustard"
                checked={formData?.two_fac_auth}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    two_fac_auth: e.target.checked ? 1 : 0,
                  }));
                }}
              />
            </FormSwitch>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-mustard text-white"
          onClick={() => {
            setSendOtpSpinner(true);
            handleSendOtp();
          }}
          disabled={sendOtpSpinner}
        >
          UPDATE
        </Button>
      </div>

      {otpModal && (
        <CommonModal
          open={otpModal}
          setOpen={setOtpModal}
          title={"OTP VERIFICATION"}
          description={ModalDescription}
          footer={ModalFooter}
          sticky={true}
          size="md"
        />
      )}
    </div>
  );
};

export default main;