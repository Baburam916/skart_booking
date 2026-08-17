import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/icons/Side_logo.png";
import illustrationUrl from "../../assets/images/icons/Skart-Banner-homepage.png";

import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  InputGroup,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import Lucide from "../../base-components/Lucide";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import "../../assets/css/login.css";
import { LogIn, Lock, User, Phone, MapPin, Globe } from "lucide-react";
import scooterUrl from "../../assets/images/login/Skart-Banner.png";
import tyreUrl from "../../assets/images/login/tyre.png";
import ekartLineUrl from "../../assets/images/login/ekart-line2.gif";
import logintabbgIcon from "../../assets/images/login/logintabbg.gif";

//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import {
  directCustomerCheck,
  directCustomerRegistration,
  directCustomerSendOtp,
  directCustomerVerifyOtp,
  getLocalPincodeApi,
} from "../../AllServices/config.service";
import { useAlert } from "../../ContextProvider/AlertContext";
import LoadingIcon from "../../base-components/LoadingIcon";
import CommonModal from "../../components/CommonModal";
import PrivacyPolicy from "./privacy";
import PaymentPolicy from "./paymentpolicy";
import { BlobProvider } from "@react-pdf/renderer";
import {
  commongetrequest,
  commonpostrequest,
  universalpost,
} from "../../AllServices/services";

import CommonSearchableAll from "../../components/CommonSearchableAll/CommonSearchableAll";
const intselecteddata = {
  country_name: "",
  country_id: "",
};
const intselecteddata3 = {
  zipcode: "",
  city: "",
  city_area: "",
};
const intselecteddata2 = {
  zipcode: "",
  city: "",
};
const PrivacyPolicyPdf = () => (
  <BlobProvider document={<PrivacyPolicy />}>
    {({ url, loading }) =>
      loading ? (
        <button
          className="bg-gray-400 text-white p-2 rounded-lg text-center"
          disabled
        >
          Generating PDF...
        </button>
      ) : (
        <a
          href={url}
          target="_blank"
          download="PrivacyPolicy.pdf"
          rel="noopener noreferrer"
          onClick={() => {
            window.open(url, "_blank");
          }}
          className="bg-mustard text-white p-2 rounded-lg text-center"
        >
          Privacy Policy
        </a>
      )
    }
  </BlobProvider>
);
const PaymentPolicyPdf = () => (
  <BlobProvider document={<PaymentPolicy />}>
    {({ url, loading }) =>
      loading ? (
        <button
          className="bg-gray-400 text-white p-2 rounded-lg text-center"
          disabled
        >
          Generating PDF...
        </button>
      ) : (
        <a
          href={url}
          target="_blank"
          download="PaymentPolicy.pdf"
          onClick={() => {
            window.open(url, "_blank");
          }}
          rel="noopener noreferrer"
          className="bg-mustard text-white p-2 rounded-lg text-center"
        >
          Payment Policy
        </a>
      )
    }
  </BlobProvider>
);
import RegisterSuccessPage from "./RegisterSuccessPage";

function Main() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [step, setStep] = useState<number>(1);
  const [confirm, setConfirm] = useState(false);
  const initialState = {
    name: "",
    contact: "",
    email: "",
    gst_status: "1",
    gst_number: "",
    organization_name: "",
    organization_type: "",
    document_verification: false,
    address_1: "",
    address_2: "",
    pincode: "",
    city: "",
    state: "",
    currency_id: "",
    referred_by_code: "",
  };

  const [resgisteractive, setResgisteractive] = useState("india");

  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifiedemail, setVerifiedEmail] = useState<any>(false);
  const [verfytype, setVerifytype] = useState<any>("");
  const [selecteddata, setSelecteddata] = useState<any>(intselecteddata);
  const [registerForm, setRegisterForm] = useState(initialState);
  const [type, setType] = useState<any>(1);
  const [countrydata, setCountryData] = useState<any>([]);
  const [currencydata, setCurrencydata] = useState<any>([]);
  const [unserviceable, setUnserviceable] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [sendOtpSpinner, setSendOtpSpinner] = useState(false);
  const [verifyOtpSpinner, setVerifyOtpSpinner] = useState(false);
  const [resendOtpSpinner, setResendOtpSpinner] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const refs = useRef([]);
  const [disable, setDisable] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const emailRefs = useRef([]);
  const [emailOtp, setEmailOtp] = useState<any>(["", "", "", "", "", ""]);
  const [ref_id, setRef_id] = useState("");
  const [selecteddata3, setSelecteddata3] = useState<any>(intselecteddata3);
  const [selecteddata2, setSelecteddata2] = useState<any>(intselecteddata2);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(60);
  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;
  const [registerSpinner, setRegisterSpinner] = useState(false);
  const [searchParams] = useSearchParams();
  //  console.log(searchParams,"searchparams")
  const getCookie = (name: any) => {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  useEffect(() => {
    const token = getCookie("ref");
    setRegisterForm((pre: any) => ({
      ...pre,
      referred_by_code: token || "",
    }));
  }, []);
  const handleChange = (index: any, event: any) => {
    const newOTP = [...otp];
    newOTP[index] = event.target.value;
    setOtp(newOTP);

    if (event.target.value && index < otp.length - 1) {
      refs.current[index + 1].focus();
    }
  };
  const handleChangeemail = (index: any, event: any) => {
    const newOTP = [...emailOtp];
    newOTP[index] = event.target.value;
    setEmailOtp(newOTP);

    if (event.target.value && index < emailOtp.length - 1) {
      emailRefs.current[index + 1].focus();
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
  const handleKeyPressEmail = (index: any, event: any) => {
    if (event.key === " ") {
      event.preventDefault();
      return;
    }

    if (event.key === "Backspace" && !emailOtp[index] && index > 0) {
      emailRefs.current[index - 1].focus();
    }

    if (
      (event.key === "Enter" || event.key === "NumpadEnter") &&
      index == emailOtp.length - 1 &&
      emailOtp.join("").length == 6
    ) {
      handleVerifyOtp();
    }
  };

  const checklength = (otp: any) => {
    const data = otp?.filter((item) => {
      if (item) {
        return item;
      }
    });
    return data?.length == 6;
  };
  const verifytest = async (type: any, value: any) => {
    const obj: any = {};
    obj[type] = value;
    try {
      const res = await commonpostrequest("auth/check", obj);
      if (res?.response?.status == 400) {
        showAlert(res?.response?.data?.message, "warning");
        setRegisterForm((pre: any) => ({ ...pre, [type]: "" }));
      } else if (res?.response?.status == 406) {
        showAlert("Invalid Value", "warning");
        setRegisterForm((pre: any) => ({ ...pre, [type]: "" }));
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const handleSendOtp = async (check: any, forwhat?: any) => {
    if (sendOtpSpinner) {
      return;
    }

    if (type == 1) {
      if (!registerForm?.name) {
        showAlert("Name is required", "error");
        return;
      }

      if (!registerForm?.email) {
        showAlert("Email is required", "error");
        return;
      }

      if (!check) {
        setSendOtpSpinner(true);
      }
      try {
        const response = await directCustomerSendOtp({
          contact: registerForm?.contact,
          gst_status: registerForm?.gst_status,
          gst_number: registerForm?.gst_number,
        });
        if (response?.status == 200) {
          showAlert(response?.data?.message);
          setOtpModal(true);
          setTimer(60);
          setStartTimer(true);
          if (registerForm?.gst_status == 2) {
            setRef_id(response?.data?.data?.ref_id);
          } else {
            setRegisterForm((prev) => ({
              ...prev,
              organization_name: response?.data?.data?.TradeName || "",
              address_1:
                [
                  response?.data?.data?.AddrBnm,
                  response?.data?.data?.AddrBno,
                  response?.data?.data?.AddrFlno,
                ]
                  .filter(Boolean)
                  .join(", ") || "",
              address_2:
                [response?.data?.data?.AddrSt, response?.data?.data?.AddrLoc]
                  .filter(Boolean)
                  .join(", ") || "",
              pincode: response?.data?.data?.AddrPncd || "",
            }));
            handleCityState(response?.data?.data?.AddrPncd);
          }
        } else if (response?.response && response?.response?.status == 406) {
          showAlert(response?.response?.data?.errors[0]?.msg, "error");
        } else {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSendOtpSpinner(false);
        setResendOtpSpinner(false);
      }
    } else {
      if (!confirm) {
        showAlert("Please accept the terms & conditions", "warning");
        return;
      }
      if (!check) {
        setSendOtpSpinner(true);
      }
      if (forwhat == "email") {
        setVerifytype("email");
      } else {
        setVerifytype("phone");
      }
      try {
        const response = await commonpostrequest(`auth/send-otp`, {
          contact: registerForm?.contact,
          email: registerForm?.email,
        });
        if (response?.status == 200) {
          showAlert(response?.data?.message);
          setOtpModal(true);
          setTimer(60);
          setVerifytype(forwhat);
          setStartTimer(true);
        } else if (response?.response && response?.response?.status == 406) {
          showAlert(response?.response?.data?.errors[0]?.msg, "error");
        } else {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSendOtpSpinner(false);
        setResendOtpSpinner(false);
      }
    }
  };
  // console.log(registerForm,"regform")
  const handleVerifyOtp = async () => {
    setVerifyOtpSpinner(true);
    if (type == 1) {
      try {
        const response = await directCustomerVerifyOtp({
          otp: otp?.join(""),
          ref_id: ref_id,
          gst_status: registerForm?.gst_status,
          gst_number: registerForm?.gst_number,
        });
        if (response?.status == 200) {
          showAlert(response?.data?.message);
          if (registerForm?.gst_status == 2) {
            setRegisterForm((prev) => ({
              ...prev,
              address_1: response?.data?.address?.house || "",
              address_2:
                [
                  response?.data?.address?.street,
                  response?.data?.address?.po,
                  response?.data?.address?.dist,
                ]
                  .filter(Boolean)
                  .join(", ") || "",
              pincode: response?.data?.address?.pincode || "",
              document_verification: true,
            }));
            handleCityState(response?.data?.address?.pincode);
          } else {
            setRegisterForm((prev) => ({
              ...prev,
              document_verification: true,
            }));
          }
          setRef_id("");
          setOtpModal(false);
          setDisable(true);
          setVerified(true);
        } else if (response?.response && response?.response?.status == 406) {
          showAlert(response?.response?.data?.errors[0]?.msg, "error");
        } else {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setVerifyOtpSpinner(false);
      }
    } else {
      try {
        const response = await commonpostrequest("auth/register", {
          ...registerForm,
          is_overseas: 1,
          gst_status: 0,
          contact_otp: otp?.join(""),
          email_otp: emailOtp?.join(""),
        });
        if (response?.status == 200) {
          showAlert(response?.data?.message);
          setCaptchaValue("");
          setRegisterForm(initialState);
          setDisable(false);
          setConfirm(false);

          setType(1);
          setRegisterForm(initialState);
          setSelecteddata(intselecteddata);
          setSelecteddata2(intselecteddata2);
          setSelecteddata3(intselecteddata3);
          localStorage.removeItem("code");
          setVerified(false);
          setStep(1);
          setVerifiedEmail(false);
          setVerifytype("");
          navigate("/customer-login");
        } else if (response?.response?.status == 406) {
          showAlert(response?.response?.data?.errors[0]?.message, "error");
        } else if (response?.status == 201) {
          showAlert(response?.data?.message);
          setCaptchaValue("");
          setRegisterForm(initialState);
          setDisable(false);
          setConfirm(false);

          setType(1);
          setRegisterForm(initialState);
          setSelecteddata(intselecteddata);
          setSelecteddata2(intselecteddata2);
          setSelecteddata3(intselecteddata3);
          localStorage.removeItem("code");
          setVerified(false);
          setStep(1);
          setVerifiedEmail(false);
          setVerifytype("");
          navigate("/customer-login");
        } else if (response?.response?.status == 400) {
          showAlert(
            response?.response?.data?.msg ||
              response?.response?.data?.message ||
              response?.response?.data?.error ||
              response?.response?.data?.err,
            "error",
          );
        } else if (response?.status == 410) {
          setUnserviceable(true);
          setType(1);
          setRegisterForm(initialState);
          setSelecteddata(intselecteddata);
          setSelecteddata2(intselecteddata2);
          setSelecteddata3(intselecteddata3);
          localStorage.removeItem("code");
          setVerified(false);
          setStep(1);
          setDisable(false);
          setVerifiedEmail(false);
          setVerifytype("");
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
        } else {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
        }
      } catch (error) {
        showAlert("Something went wrong", "error");
        console.log(error);
      } finally {
        setDisable(false);
        setConfirm(false);
        setRegisterSpinner(false);
        setVerifyOtpSpinner(false);
      }
    }
    //     try {
    //       const response = await commonpostrequest(`auth/validate-otp`, {
    //         otp: otp?.join(""),
    //         email: registerForm?.email,
    //         contact: registerForm?.contact,
    //       });
    //       if (response?.status == 200) {
    //         showAlert(response?.data?.message);
    //         setRef_id("");
    //         // setVerifytype("")
    //         setOtpModal(false);
    //         if(verfytype=="email"){
    //  setVerifiedEmail(true);
    //      setVerifytype("");
    //         }else{
    //    setDisable(true);

    //    setVerified(true);
    //         }

    //       } else if (response?.response && response?.response?.status == 406) {
    //         showAlert(response?.response?.data?.errors[0]?.msg, "error");
    //       } else {
    //         showAlert(
    //           response?.data?.message ||
    //             response?.response?.data?.message ||
    //             response?.message,
    //           "error"
    //         );
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     } finally {
    //       setVerifyOtpSpinner(false);
    //     }
  };
  const checkvalidation = (e: any) => {
    return e.target.value.replace(/[^a-zA-Z\s'-]/g, "");
  };
  const handleCityState = async (pincode: any) => {
    if (!pincode) {
      return;
    }
    try {
      const response = await getLocalPincodeApi(pincode);
      if (response?.status == 200) {
        if (response?.data?.data?.length > 0) {
          setRegisterForm((prev) => ({
            ...prev,
            city: response?.data?.data[0]?.city,
            state: response?.data?.data[0]?.state,
            pos: `${response?.data?.data[0]?.state?.toUpperCase()}(${
              response?.data?.data[0]?.pos
            })`,
          }));
        } else {
          showAlert(
            "This pincode is not available. Enter a different pincode.",
            "warning",
          );
          setRegisterForm((prev) => ({
            ...prev,
            pincode: "",
          }));
        }
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleCancel = () => {
    setEmailOtp(["", "", "", "", "", ""]);
    setOtp(["", "", "", "", "", ""]);
    // refs.current.value=([])
    // emailRefs.current.value=([])
    setOpen(false);
  };

  const handleRegister = async () => {
    // console.log(registerForm);

    if (!confirm) {
      showAlert("Please accept the terms & conditions", "warning");
      return;
    }

    if (type == 1) {
      for (const key in registerForm) {
        if (key == "currency_id" || key == "referred_by_code") {
          continue;
        }
        if (
          registerForm?.gst_status != "1" &&
          (key == "gst_number" ||
            key == "organization_name" ||
            key == "organization_type" ||
            key == "referred_by_code" ||
            key == "currency_id")
        ) {
          continue;
        }

        if (registerForm.hasOwnProperty(key) && registerForm[key] == "") {
          if (
            (key == "currency_id" || key == "referred_by_code") &&
            type == 1
          ) {
            continue;
          }
          if (
            registerForm?.gst_status != "1" &&
            key == "gst_number" &&
            registerForm[key] == ""
          ) {
            showAlert(`Aadhar no. is required`, "error");
            return;
          } else {
            showAlert(`${key.replaceAll("_", " ")} is required`, "error");
            return;
          }
        }
      }
    }

    setRegisterSpinner(true);

    try {
      const response =
        type == 1
          ? await directCustomerRegistration({
              ...registerForm,
              is_overseas: 0,
              referred_by_code:
                getCookie("ref") || registerForm?.referred_by_code || "",
            })
          : await commonpostrequest("auth/register", {
              ...registerForm,
              is_overseas: 1,
            });
      if (response?.response?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.message, "error");
      } else if (response?.status == 201) {
        showAlert(response?.data?.message);
        setCaptchaValue("");
        setRegisterForm(initialState);
        setDisable(false);
        setConfirm(false);

        setType(1);
        setRegisterForm(initialState);
        setSelecteddata(intselecteddata);
        setSelecteddata2(intselecteddata2);
        setSelecteddata3(intselecteddata3);
        localStorage.removeItem("code");
        setVerified(false);
        setStep(1);
        setVerifiedEmail(false);
        setVerifytype("");
        navigate("/success", {
          state: {
            gmail: registerForm?.email,
          },
        });
      } else if (response?.status == 410) {
        setUnserviceable(true);
        setType(1);
        setRegisterForm(initialState);
        setSelecteddata(intselecteddata);
        setSelecteddata2(intselecteddata2);
        setSelecteddata3(intselecteddata3);
        localStorage.removeItem("code");
        setVerified(false);
        setStep(1);
        setDisable(false);
        setVerifiedEmail(false);
        setVerifytype("");
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
      console.log(error);
    } finally {
      setDisable(false);
      setConfirm(false);
      setRegisterSpinner(false);
    }
  };

  const handleCheck = async (data: any, key: string) => {
    if (data[key] == "") {
      return;
    } else {
      try {
        const response = await directCustomerCheck(data);
        if (response?.status == 200 || response?.status == 406) {
        } else if (response?.status == 400) {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
          setRegisterForm((pre: any) => ({ ...pre, contact: "" }));
        } else {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error",
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
  };

  const contentRef = useRef();

  const handleDownload = () => {
    const element = contentRef.current;

    const opt = {
      margin: 0.5,
      filename: "Privacy-Policy.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const blobUrl = URL.createObjectURL(pdf.output("blob"));
        window.open(blobUrl, "_blank");
      });
  };

  const Description = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          className="text-white bg-mustard p-2 rounded-lg text-center"
          to="https://skartnew-dev.s3.amazonaws.com/T%26C/1745397126397-Terms%20and%20Conditions%20--%20Digital%20sales.pdf"
          target="_blank"
          download="Terms&Conditions.pdf"
        >
          Terms & Conditions
        </Link>
        <Link
          className="text-white bg-mustard p-2 rounded-lg text-center"
          to="https://skartnew-dev.s3.ap-southeast-1.amazonaws.com/T%26C/1745405432754-sKart%20CODE%20OF%20CONDUCT.pdf"
          target="_blank"
          download="SkartCodeofConduct.pdf"
        >
          Skart Code of Conduct
        </Link>
        <Link
          className="text-white bg-mustard p-2 rounded-lg text-center"
          to="https://skartnew-dev.s3.ap-southeast-1.amazonaws.com/T%26C/1745405459043-skart%20sales%20agreement-Sub%20Agents.pdf"
          target="_blank"
          download="SkartSalesAgreement.pdf"
        >
          Skart Sales Agreement
        </Link>

        <PrivacyPolicyPdf />
        <PaymentPolicyPdf />
      </div>
    </>
  );

  const ModalDescription = (
    <>
      <p className="">Enter 6-digit OTP</p>
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
        <Button
          className="bg-mustard text-white w-full"
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
      </div>
    </>
  );
  const ModalDescription2 = (
    <>
      <div>
        <p className="text-center">Mobile Otp</p>
        <div className="flex justify-center mt-2">
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
      </div>
      <div>
        <p className="text-center mt-4">Email Otp</p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-4">
            {emailOtp?.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChangeemail(index, e)}
                onKeyDown={(e) => handleKeyPressEmail(index, e)}
                className="w-10 h-10 shadow-lg  text-center text-primary  border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                ref={(input) => (emailRefs.current[index] = input)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 px-12 text-center">
        <Button
          className="bg-mustard text-white w-full"
          disabled={
            !checklength(otp) || verifyOtpSpinner || !checklength(emailOtp)
          }
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
      </div>
    </>
  );
  const ModalFooter = (
    <>
      <div className="flex justify-end">
        {startTimer ? (
          <p>
            RESEND OTP IN: {minutes < 10 ? `0${minutes}` : minutes}:
            {remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
          </p>
        ) : (
          <Button
            className=" bg-mustard text-white"
            onClick={() => {
              setResendOtpSpinner(true);
              handleSendOtp(true);
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

  useEffect(() => {
    if (!otpModal) {
      setOtp(["", "", "", "", "", ""]);
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
    if (type == 2) {
      getintdata();
    }
  }, [type]);
  const getintdata = async () => {
    try {
      const [currencyres, countryres] = await Promise.all([
        commongetrequest("booking/currency"),
        commongetrequest("admin/country"),
      ]);
      if (currencyres?.status == 200) {
        const data = currencyres?.data?.data || [];
        const newdata = data?.filter(
          (item: any) =>
            item?.id == 48 ||
            item?.id == 22 ||
            item?.id == 50 ||
            item?.id == 5 ||
            item?.id == 12,
        );
        setCurrencydata(newdata);
      }
      if (countryres?.status == 200) {
        setCountryData(countryres?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const fun1 = (a: any) => {
    const singledata = currencydata?.find((item: any) =>
      item?.currency?.toUpperCase()?.includes(a?.country_code?.toUpperCase()),
    );

    if (a?.country_id == 97) {
      showAlert("Please Select Another Country", "warning");
      setSelecteddata({ country_name: "", country_id: "" });
      return;
    }
    localStorage.setItem("code", a?.country_code);
    setRegisterForm((prev) => ({
      ...prev,
      destination_country: a?.country_name || "",
      destination_country_code: a?.country_code || "",
      isd_code: a?.isd_code || "",
      country: a?.country_id || "",
      city_available: a?.city_avail == 1 ? 1 : 0,
      pincode_available: a?.pincode_avail == 1 ? 1 : 0,
      destination_pincode: a?.pincode_avail == 0 ? "0000" : "",
      currency_id: singledata?.id || "",
    }));
  };
  const funtoempty1 = () => {
    setRegisterForm((prev) => ({
      ...prev,
      destination_country: "",
      destination_country_code: "",
      country: "",
      state: "",
      city_available: 0,
      pincode_available: 0,
      destination_pincode: "",
      currency_id: "",
      isd_code: "",
    }));
    localStorage.removeItem("code");
    setSelecteddata(intselecteddata);
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
  };
  const funforpincode = (a: any) => {
    setRegisterForm((prev: any) => ({
      ...prev,
      pincode: a?.zipcode,
      city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state:
        a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
        localStorage.getItem("code"),
      state_name: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    setSelecteddata3((pre: any) => ({ ...pre, city_area: a?.city_area }));
  };
  const fun4 = (a: any) => {
    setRegisterForm((prev: any) => ({
      ...prev,
      // destination_pincode: data?.zipcode,
      city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
  };
  const funtoempty4 = () => {
    setRegisterForm((prev: any) => ({
      ...prev,
      // destination_pincode: data?.zipcode,
      city: "",
      state: "",
    }));
  };
  const fun5 = (a: any) => {
    setRegisterForm((prev) => ({
      ...prev,
      origin_pincode: a?.pincode,
      origin_city: a?.city,
      origin_state: a?.state,
      origin_state_code: a?.state_code,
    }));
  };
  const funtoempty5 = () => {
    // setSelectedoriginpincodedata(intoriginpincodedata);
    setRegisterForm((prev) => ({
      ...prev,
      origin_pincode: "",
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
    }));
    // setSelectedoriginpincodedata(intoriginpincodedata);
  };
  const funtoemptypincode = () => {
    setRegisterForm((prev: any) => ({
      ...prev,
      destination_pincode: "",
      city: "",

      state: localStorage.getItem("code") || "",
      state_name: "",
    }));
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
  };
  const funtohandle = (forwhat?: any, value?: any) => {
    if (forwhat == "zipcode") {
      setRegisterForm((pre: any) => ({
        ...pre,
        pincode: value,
        city: "",
        city_area: "",
        state: localStorage.getItem("code"),
      }));
    } else {
      setRegisterForm((pre: any) => ({
        ...pre,

        city: value,
      }));
    }
  };
  return (
    <>
      <div
        className={
          "lg:flex  block lg:-m-3 lg:-mx-8 relative lg:h-[100%]  lg:overflow-hidden lg:w-auto md:w-full w-full"
        }
      >
        <div className="lg:w-[50%] bg-white absolute bottom-[0px] left-[0px] right-[0px] lg:static mx-[-10px] lg:m-0 w-[109%] hidden lg:block ">
          <div
            className="relative before:hidden lg:before:block after:hidden lg:after:block   lg:overflow-hidden bg-primary lg:bg-gradient-to-r lg:from-[#777779] lg:via-[#777779] lg:to-[#fff]  dark:bg-darkmode-800 xl:dark:bg-darkmode-600 
 before:content-[''] before:w-[99%] before:-mt-[28%] before:-mb-[16%] before:-ml-[0] before:absolute before:inset-y-0 before:left-0 before:transform
   before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400 after:content-[''] 
   after:w-[99%] after:-mt-[20%] after:-mb-[13%] after:-ml-[0] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] 
   after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700  h-[100%] animate-morph transition-all duration-1000 "
          >
            <div className="flex-col min-h-auto lg:min-h-screen md:flex rounded-[431px] ">
              <div className=" m-auto w-full  z-[1]  relative">
                <div className=" justify-end lg:flex  hidden">
                  <div className=" md:pl-[100px] md:pr-[100px] lg:pl-[100px] lg:pr-[100px  xl:pl-[120px] xl:pr-[100px] 2xl:pl-[0px] 2xl:pr-[120px] w-[700px]  ">
                    <a href="" className="flex items-center pt-5 ">
                      <img
                        alt="sKart Logo"
                        className="w-[370px]"
                        src={logoUrl}
                        style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
                      />
                    </a>
                  </div>
                </div>

                <div className="lg:pt-[70px]  xl:pt-[70px]  2xl:pt-[160px]  w-[99%] overflow-hidden z-[1]  scooterBox   lg:rounded-r-[70px] xl:rounded-r-[80px]  2xl:rounded-r-[90px]  3xl:rounded-r-[100px]   ">
                  <div className="scooteranimate ">
                    <div id="homer" className="scale-[.5] lg:transform-none">
                      <img className="scooter" src={scooterUrl} />
                      <i className="tyre wheel">
                        <img src={tyreUrl} />
                      </i>
                      <i className="tyre2 wheel">
                        <img src={tyreUrl} />
                      </i>
                      <i className="ekartline">
                        <img src={ekartLineUrl} />
                      </i>
                    </div>
                  </div>
                </div>

                <div className=" justify-end lg:flex  hidden">
                  <div className=" md:pl-[100px] md:pr-[100px] lg:pl-[100px] lg:pr-[100px  xl:pl-[120px] xl:pr-[100px] 2xl:pl-[0px] 2xl:pr-[120px] w-[700px]  ">
                    <div className="mt-4 text-2xl font-medium leading-tight text-white -intro-x">
                      sKart Global Express Pvt Ltd
                    </div>
                    <div className="mt-7 text-md text-white -intro-x text-opacity-70 dark:text-slate-400 w-[100%] xl:w-[90%] 2xl:w-[70%]">
                      sKart Global Express Pvt Ltd is a next-gen tech-driven
                      express and e-commerce Logistics solution provider.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[50%] w-full bg-[#777779] lg:bg-[#fff] lg:p-[50px]  xl:px-[60px] xl:pl-[30px] xl:pr-[30px] 2xl:px-[120px] 2xl:py-[50px] md:p-[10px]  ">
          <div className="lg:hidden block">
            <a
              href=""
              className="flex items-center mt-3 mb-5 text-center justify-center"
            >
              <img
                alt="Midone Tailwind HTML Admin Template"
                className="w-[240px]"
                src={logoUrl}
                style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
              />
            </a>
          </div>

          <div className="w-full  md:h-full flex items-center justify-center">
            <div className="w-full lg:w-[600px]   xl:w-[540px] bg-white  rounded-[20px] overflow-hidden relative p-[1px]">
              <div className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] hover:[animation-play-state:paused]">
                <div
                  className="h-full w-full
                       bg-[conic-gradient(#d8def0,#f9cd73_4%,#d8def0_20%,#d8def0_95%)]
                       [mask:linear-gradient(#d8def0_0_0)_content-box,linear-gradient(#d8def0_0_0)]
                       [mask-composite:exclude]
                       p-[5px] hover:bg- bg-[conic-gradient(#303030,#303030%,#303030_60%,#303030_95%)]"
                ></div>
              </div>

              <div className="bg-white  rounded-[20px] overflow-hidden relative">
                <div className="w-full bg-[#f7f8fb] border-b border-[#d8def0] rounded-t-[20px] p-[10px] flex items-center justify-center ">
                  <User className="w-[21px]" />
                  <h2 className="text-lg font-bold uppercase text-center text-[#303030] ml-2">
                    Registration
                  </h2>
                </div>

                <div className="bg-white  rounded-[20px] overflow-hidden relative">
                  <div className=" p-[20px]">
                    {unserviceable ? (
                      <div className=" w-full px-2 border py-2 mx-auto my-auto bg-white rounded-lg shadow-lg xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent  sm:px-8  sm:w-3/4 lg:w-2/4 xl:w-auto">
                        <div className="text-sm text-gray-500  pt-8  w-full ">
                          <p className="text-justify w-full my-4">
                            Dear{" "}
                            <b className="text-mustard">{registerForm?.name}</b>
                            ,
                          </p>
                          <p className="text-justify w-full  my-4">
                            Thank you for registering with{" "}
                            <b className="text-mustard">
                              sKart Global Express Pvt. Ltd!
                            </b>
                          </p>
                          <p className="text-justify w-full  my-4">
                            We regret to inform you that, at this moment,
                            Pincode{" "}
                            <b className="text-mustard">
                              {registerForm?.pincode}
                            </b>{" "}
                            is not mapped with our any PUD Centre. But don’t
                            worry – we are actively working to expand our
                            service coverage, and our team is committed to
                            bringing our services to your area as soon as
                            possible.
                          </p>
                          <p className="text-justify w-full  my-4">
                            Rest assured, once your account is activated, our
                            admin team will reach out to you with updates
                            regarding service availability in your region.
                          </p>
                          <p className="text-justify w-full  my-4">
                            We truly appreciate your patience and understanding
                            as we work to serve you better.
                          </p>
                          <p className="text-justify w-full  my-4">
                            If you have any questions, feel free to contact us
                            at{" "}
                            <Link
                              to="mailto:info@skart-express.com"
                              className="text-mustard underline underline-offset-4 font-bold hover:no-underline"
                            >
                              info@skart-express.com
                            </Link>
                            .
                          </p>
                        </div>

                        <div className="flex justify-center items-center my-4">
                          <Button
                            className="inline-block mx-2 border-none text-mustard  underline underline-offset-4 hover:no-underline"
                            onClick={() => {
                              setUnserviceable(false);
                              setCaptchaValue("");
                              setRegisterForm(initialState);
                              setVerified(false);
                              setDisable(false);
                              setType(1);
                              setRegisterForm(initialState);
                              setSelecteddata(intselecteddata);
                              setSelecteddata2(intselecteddata2);
                              setSelecteddata3(intselecteddata3);
                              localStorage.removeItem("code");
                              setVerified(false);
                              setStep(1);
                              setDisable(false);
                              setVerifiedEmail(false);
                              setVerifytype("");
                            }}
                          >
                            Go Back
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`${
                          type == 2 ? "overflow-auto overflow-x-hidden" : ""
                        } w-full  `}
                      >
                        {/* <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl ">
                    Registration
                  </h2> */}
                        <div className="w-full">
                          <div className=" flex mb-4 ">
                            <Button
                              onClick={() => {
                                setType(1);
                                setRegisterForm(initialState);
                                setSelecteddata(intselecteddata);
                                setSelecteddata2(intselecteddata2);
                                setSelecteddata3(intselecteddata3);
                                localStorage.removeItem("code");
                                setVerified(false);
                                setStep(1);
                                setDisable(false);
                                setVerifiedEmail(false);

                                setVerifytype("");
                              }}
                              className={` ${
                                type == 1
                                  ? "relative bg-[#ffcf14] overflow-hidden   w-[50%] text-[16px] justify-center uppercase  px-[11px] py-[11px] rounded-lg font-bold text-[#5a637d] flex items-center   border-[#fff] border-2 shadow-[0_0px_3px_#ccc]"
                                  : "  overflow-hidden relative bg-[#e9edf9]  w-[50%] text-[16px] justify-center uppercase  px-[11px] py-[11px] rounded-lg font-bold text-[#5a637d] flex items-center   border-[#fff] border-2 shadow-[0_0px_3px_#ccc]"
                              }`}
                            >
                              <p
                                className={` ${
                                  type == 1
                                    ? "z-[2] relative flex text-[#fff]"
                                    : "z-[2] relative flex text-[#6c6e71]"
                                }`}
                              >
                                <MapPin className="w-[20px]  h-[20px] mr-[4px]" />
                                Within India
                              </p>
                              <figure
                                className={` ${
                                  type == 1
                                    ? "absolute top-[0px] lg:top-[-68px] xl:top-[-47px] 2xl:top-[-57px] left-[0px] right-[0px] brightness-[1.2] opacity-70"
                                    : "absolute top-[0px] lg:top-[-68px] xl:top-[-47px] 2xl:top-[-57px] left-[0px] right-[0px] brightness-[1.2] opacity-0"
                                }`}
                              >
                                <img
                                  src={logintabbgIcon}
                                  className=" w-full"
                                  alt=""
                                />
                              </figure>
                            </Button>
                            <Button
                              className={`p-2 w-full text-white ${
                                type == 2
                                  ? " bg-[#ffcf14] overflow-hidden relative   w-[50%] text-[16px] justify-center uppercase  px-[11px] py-[11px] rounded-lg font-bold text-[#5a637d] flex items-center ml-3 border-[#fff] border-2 shadow-[0_0px_3px_#ccc]"
                                  : "  overflow-hidden relative bg-[#e9edf9]  w-[50%] text-[16px] justify-center uppercase  px-[11px] py-[11px] rounded-lg font-bold text-[#5a637d] flex items-center ml-3 border-[#fff] border-2 shadow-[0_0px_3px_#ccc]"
                              }`}
                              onClick={() => {
                                setType(2);
                                setRegisterForm(initialState);
                                setSelecteddata(intselecteddata);
                                setSelecteddata2(intselecteddata2);
                                setSelecteddata3(intselecteddata3);
                                setVerified(false);
                                localStorage.removeItem("code");
                                setStep(2);
                                setVerifytype("");
                                setVerifiedEmail("");
                                setDisable(false);
                                setVerifiedEmail(false);
                                setVerifytype("");
                              }}
                            >
                              <p
                                className={` ${
                                  type == 2
                                    ? "z-[2] relative flex text-[#fff]"
                                    : "z-[2] relative flex text-[#6c6e71]"
                                }`}
                              >
                                <Globe className="w-[18px]  h-[18px] mr-[4px]" />
                                Outside India
                              </p>

                              <figure
                                className={`${
                                  type == 2
                                    ? "absolute top-[0px] lg:top-[-68px] xl:top-[-47px] 2xl:top-[-57px] left-[0px] right-[0px] brightness-[1.2] opacity-70"
                                    : "absolute top-[0px] lg:top-[-68px] xl:top-[-47px] 2xl:top-[-57px] left-[0px] right-[0px] brightness-[1.2] opacity-0"
                                }`}
                              >
                                <img
                                  src={logintabbgIcon}
                                  className=" w-full"
                                  alt=""
                                />
                              </figure>
                            </Button>
                          </div>
                        </div>

                        {step && step === 1 ? (
                          <div>
                            {type == 1 ? (
                              <div className=" grid grid-cols-12 gap-x-4">
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      NAME{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>{" "}
                                    </FormLabel>
                                    <FormInput
                                      type="text"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="Enter Name"
                                      autoComplete="off"
                                      disabled={disable || verified}
                                      value={registerForm?.name}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          name: checkvalidation(e),
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      MOBILE{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormInput
                                      type="text"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="Enter Mobile"
                                      autoComplete="off"
                                      disabled={disable || verified}
                                      onBlur={() =>
                                        handleCheck(
                                          { contact: registerForm?.contact },
                                          "contact",
                                        )
                                      }
                                      maxLength={10}
                                      value={registerForm?.contact}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          contact: e.target.value.replace(
                                            /[^0-9.]/g,
                                            "",
                                          ),
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      EMAIL{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormInput
                                      type="email"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="Enter Email"
                                      autoComplete="off"
                                      disabled={disable}
                                      onBlur={() =>
                                        handleCheck(
                                          { email: registerForm?.email },
                                          "email",
                                        )
                                      }
                                      value={registerForm?.email}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          email: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      GST STATUS{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>{" "}
                                    </FormLabel>
                                    <FormSelect
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      aria-label="Default select example"
                                      value={registerForm?.gst_status}
                                      disabled={disable || verified}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          gst_status: e.target.value,
                                        }))
                                      }
                                    >
                                      <option value={1}>Registered</option>
                                      <option value={2}>Un-Registered</option>
                                    </FormSelect>
                                  </div>
                                </div>

                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3 ">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      {registerForm?.gst_status == 1
                                        ? "GST NO"
                                        : "AADHAAR NO"}{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <div className="relative ">
                                      <InputGroup>
                                        <FormInput
                                          type="text"
                                          className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                          placeholder={
                                            registerForm?.gst_status == 1
                                              ? "Enter GST No."
                                              : "Enter AADHAAR No."
                                          }
                                          autoComplete="off"
                                          disabled={sendOtpSpinner || verified}
                                          onBlur={() =>
                                            handleCheck(
                                              {
                                                gst_number:
                                                  registerForm?.gst_number,
                                              },
                                              "gst_number",
                                            )
                                          }
                                          value={registerForm?.gst_number}
                                          maxLength={15}
                                          onChange={(e) =>
                                            setRegisterForm((prev) => ({
                                              ...prev,
                                              gst_number: e.target.value,
                                            }))
                                          }
                                        />
                                        {verified ? (
                                          <InputGroup.Text
                                            id="input-group-price"
                                            className="py-2 px-3 w-14"
                                          >
                                            <Lucide
                                              icon="Check"
                                              className="text-green-500 stroke-2.5  h-5"
                                            />
                                          </InputGroup.Text>
                                        ) : (
                                          <InputGroup.Text
                                            id="input-group-price"
                                            className="verifybtn z-[10] shadow-[0px_3px_6px_#ffe067 inset] border-2 border-[#c69d4a] cursor-pointer absolute right-[4px] top-[5px] bottom-[0px] h-[30px] text-white text-[13px] font-bold bg-gradient-to-t from-[#b77d09] via-[#eaac2e] to-[#ecc805] rounded-[15px] px-3 py-1 flex items-center justify-center"
                                            style={{ borderRadius: "20px" }}
                                            onClick={() => {
                                              if (!sendOtpSpinner) {
                                                handleSendOtp(false);
                                              }
                                            }}
                                            // aria-disabled={sendOtpSpinner}
                                          >
                                            VERIFY
                                            {sendOtpSpinner && (
                                              <LoadingIcon
                                                icon="puff"
                                                color="white"
                                                className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                              />
                                            )}
                                          </InputGroup.Text>
                                        )}
                                      </InputGroup>
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
                                  </div>{" "}
                                </div>

                                {registerForm?.gst_status == 1 ? (
                                  <>
                                    {" "}
                                    <div className="col-span-12 lg:col-span-6">
                                      <div className="mb-3">
                                        <FormLabel className="text-[13px] text-primary mb-[1px]">
                                          ORGANIZATION NAME{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </FormLabel>
                                        <FormInput
                                          type="text"
                                          className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                          placeholder="Enter Organization Name"
                                          autoComplete="off"
                                          value={
                                            registerForm?.organization_name
                                          }
                                          onChange={(e) =>
                                            setRegisterForm((prev) => ({
                                              ...prev,
                                              organization_name: e.target.value,
                                            }))
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-span-12 lg:col-span-6">
                                      <div className="mb-3">
                                        <FormLabel className="text-[13px] text-primary mb-[1px]">
                                          ORGANIZATION TYPE{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </FormLabel>
                                        <FormSelect
                                          className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                          aria-label="Default select example"
                                          value={
                                            registerForm?.organization_type
                                          }
                                          onChange={(e) =>
                                            setRegisterForm((prev) => ({
                                              ...prev,
                                              organization_type: e.target.value,
                                            }))
                                          }
                                        >
                                          <option value="">Select</option>
                                          <option value={1}>Individual</option>
                                          <option value={2}>Firm</option>
                                          <option value={3}>
                                            Manufacturer
                                          </option>
                                          <option value={4}>Trader</option>
                                          <option value={5}>NGO</option>
                                          <option value={6}>E-Commerce</option>
                                          <option value={7}>Govt body</option>
                                        </FormSelect>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      Referral Code
                                    </FormLabel>
                                    <FormInput
                                      type="text"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="Enter Referral Code"
                                      autoComplete="off"
                                      disabled={getCookie("ref")}
                                      // onBlur={() =>
                                      //   handleCheck({ email: registerForm?.email }, "email")
                                      // }
                                      value={
                                        registerForm?.referred_by_code ||
                                        getCookie("ref")
                                      }
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          referred_by_code: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>{" "}
                                </div>
                              </div>
                            ) : (
                              <div className="intro-x grid grid-cols-2 gap-4 intro-x">
                                <div className="">
                                  <FormLabel
                                    htmlFor="vertical-form-1"
                                    className=" mb-0"
                                  >
                                    NAMEghfgh{" "}
                                    <span className="text-red-500">*</span>{" "}
                                  </FormLabel>
                                  <FormInput
                                    type="text"
                                    className=" intro-x  "
                                    placeholder="Enter Name"
                                    autoComplete="off"
                                    disabled={disable || verified}
                                    value={registerForm?.name}
                                    onChange={(e) =>
                                      setRegisterForm((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                  />
                                </div>

                                <div className="col-span-1">
                                  <FormLabel
                                    htmlFor="vertical-form-1"
                                    className=" mb-0"
                                  >
                                    {"Email"}{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <InputGroup>
                                    <FormInput
                                      type="text"
                                      placeholder={"Email"}
                                      autoComplete="off"
                                      disabled={verifiedemail}
                                      value={registerForm?.email}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          email: e.target.value,
                                          // contact: e.target.value,
                                        }))
                                      }
                                    />
                                    {verifiedemail ? (
                                      <InputGroup.Text
                                        id="input-group-price "
                                        className="py-2 px-3 w-14 flex "
                                      >
                                        <Lucide
                                          icon="Check"
                                          // icon="RefreshCw"
                                          className="text-green-500 stroke-2.5  h-5"
                                        />
                                        {verifiedemail && (
                                          <Lucide
                                            // icon="Check"
                                            icon="RefreshCw"
                                            onClick={() => {
                                              setRegisterForm((pre: any) => ({
                                                ...pre,
                                                contact: "",
                                              }));
                                              setVerifiedEmail(false);
                                              setVerifytype("");
                                              // setDisable(false)
                                            }}
                                            className="text-red-500 stroke-2.5  h-5"
                                          />
                                        )}
                                        {/* <RefreshCw/> */}
                                      </InputGroup.Text>
                                    ) : (
                                      registerForm?.email && (
                                        <InputGroup.Text
                                          id="input-group-price"
                                          className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                                          onClick={() => {
                                            // setOtpModal(true)
                                            if (!sendOtpSpinner) {
                                              handleSendOtp(false, "email");
                                            }
                                          }}
                                          // aria-disabled={sendOtpSpinner}
                                        >
                                          VERIFY
                                          {sendOtpSpinner &&
                                            verfytype == "email" && (
                                              <LoadingIcon
                                                icon="puff"
                                                color="white"
                                                className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                              />
                                            )}
                                        </InputGroup.Text>
                                      )
                                    )}
                                  </InputGroup>

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
                                <div className="col-span-2">
                                  <FormLabel
                                    htmlFor="vertical-form-1"
                                    className=" mb-0"
                                  >
                                    {"Mobile No."}{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <InputGroup>
                                    <FormInput
                                      type="text"
                                      placeholder={"Mobile Number"}
                                      autoComplete="off"
                                      disabled={
                                        sendOtpSpinner ||
                                        verified ||
                                        !registerForm?.email
                                      }
                                      maxLength={10}
                                      value={registerForm?.contact}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          contact: e.target.value.replace(
                                            /[^0-9.]/g,
                                            "",
                                          ),
                                        }))
                                      }
                                    />
                                    {verified ? (
                                      <InputGroup.Text
                                        id="input-group-price "
                                        className="py-2 px-3 w-14 flex "
                                      >
                                        <Lucide
                                          icon="Check"
                                          // icon="RefreshCw"
                                          className="text-green-500 stroke-2.5  h-5"
                                        />
                                        {verified && (
                                          <Lucide
                                            // icon="Check"
                                            icon="RefreshCw"
                                            onClick={() => {
                                              setRegisterForm((pre: any) => ({
                                                ...pre,
                                                contact: "",
                                              }));
                                              setVerified(false);
                                              setDisable(false);
                                            }}
                                            className="text-red-500 stroke-2.5  h-5"
                                          />
                                        )}
                                        {/* <RefreshCw/> */}
                                      </InputGroup.Text>
                                    ) : (
                                      registerForm?.contact &&
                                      registerForm?.contact?.length >= 10 && (
                                        <InputGroup.Text
                                          id="input-group-price"
                                          className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                                          onClick={() => {
                                            // setOtpModal(true)
                                            if (!sendOtpSpinner) {
                                              handleSendOtp(false, "phone");
                                            }
                                          }}
                                          // aria-disabled={sendOtpSpinner}
                                        >
                                          VERIFY
                                          {sendOtpSpinner &&
                                            verfytype == "phone" && (
                                              <LoadingIcon
                                                icon="puff"
                                                color="white"
                                                className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                              />
                                            )}
                                        </InputGroup.Text>
                                      )
                                    )}
                                  </InputGroup>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            {type == 2 && (
                              <div className=" grid grid-cols-12 gap-x-2">
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      NAME{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>{" "}
                                    </FormLabel>
                                    <FormInput
                                      type="text"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="Enter Name"
                                      autoComplete="off"
                                      disabled={disable || verified}
                                      value={registerForm?.name}
                                      onChange={(e: any) => {
                                        const value = e.target.value.replace(
                                          /[^a-zA-Z\s'-]/g,
                                          "",
                                        );
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          name: value,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      {"EMAIL"}{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <InputGroup>
                                      <FormInput
                                        className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                        type="text"
                                        size={"sm"}
                                        placeholder={"Email"}
                                        autoComplete="off"
                                        onBlur={(e: any) => {
                                          verifytest("email", e.target.value);
                                        }}
                                        // disabled={verifiedemail}
                                        value={registerForm?.email}
                                        onChange={(e) =>
                                          setRegisterForm((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                            // contact: e.target.value,
                                          }))
                                        }
                                      />
                                      {/* {verifiedemail ? (
                                  <InputGroup.Text
                                    id="input-group-price "
                                    className="py-2 px-3 w-14 flex "
                                  >
                                    <Lucide
                                      icon="Check"
                                      // icon="RefreshCw"
                                      className="text-green-500 stroke-2.5  h-5"
                                    />
                                    {verifiedemail && (
                                      <Lucide
                                   
                                        icon="RefreshCw"
                                        onClick={() => {
                                          setRegisterForm((pre: any) => ({
                                            ...pre,
                                            contact: "",
                                          }));
                                          setVerifiedEmail(false);
                                          setVerifytype("");
                                    
                                        }}
                                        className="text-red-500 stroke-2.5  h-5"
                                      />
                                    )}
               
                                  </InputGroup.Text>
                                ) : (
                                  registerForm?.email && (
                                    <InputGroup.Text
                                      id="input-group-price"
                                      className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                                      onClick={() => {
                                        // setOtpModal(true)
                                        if (!sendOtpSpinner) {
                                          handleSendOtp(false, "email");
                                        }
                                      }}
                           
                                    >
                                      VERIFY
                                      {sendOtpSpinner &&
                                        verfytype == "email" && (
                                          <LoadingIcon
                                            icon="puff"
                                            color="white"
                                            className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                          />
                                        )}
                                    </InputGroup.Text>
                                  )
                                )} */}
                                    </InputGroup>

                                    {otpModal && (
                                      <CommonModal
                                        open={otpModal}
                                        setOpen={setOtpModal}
                                        title={"OTP VERIFICATION"}
                                        description={ModalDescription2}
                                        footer={ModalFooter}
                                        sticky={true}
                                        handlecancel={handleCancel}
                                        size="md"
                                      />
                                    )}
                                  </div>
                                </div>

                               

                                <div className="col-span-12 lg:col-span-4">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      COUNTRY
                                      <span className="text-red-500">*</span>
                                    </FormLabel>

                                    <CommonSearchableAll
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      apiEndpoint={"admin/country"}
                                      placeholder={"Search For Country"}
                                      selecteddata={selecteddata}
                                      setSelecteddata={setSelecteddata}
                                      fun1={fun1}
                                      key1={"country"}
                                      comingselectedname={"country_name"}
                                      comingselectedid={"country_id"}
                                      funtoempty={funtoempty1}
                                      zIndex={20}
                                      id={selecteddata?.country_id}
                                      validation={true}
                                    />

                                    {/* <FormInput
                              type="text"
                              className=" px-4 py-3 "
                              placeholder="Enter Address 1"
                              autoComplete="off"
                              value={registerForm?.address_1}
                              onChange={(e) =>
                                setRegisterForm((prev) => ({
                                  ...prev,
                                  address_1: e.target.value,
                                }))
                              }
                            /> */}
                                  </div>
                                </div>
                                <div className="col-span-12 lg:col-span-4">
                                  <div className="mb-3">
                                    <FormLabel className="text-[13px] text-primary mb-[1px]">
                                      CURRENCY
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormSelect
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      value={registerForm?.currency_id}
                                      disabled={!registerForm?.country}
                                      onChange={(e: any) => {
                                        setRegisterForm((pre: any) => ({
                                          ...pre,
                                          currency_id: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value={""}>{"Select"}</option>
                                      {currencydata?.map((item: any) => (
                                        <option value={item?.id}>
                                          {item?.currency}
                                        </option>
                                      ))}
                                    </FormSelect>
                                    {/* <FormInput
                              type="text"
                              className=" px-4 py-3 "
                              placeholder="Enter Address 2"
                              autoComplete="off"
                              value={registerForm?.address_2}
                              onChange={(e) =>
                                setRegisterForm((prev) => ({
                                  ...prev,
                                  address_2: e.target.value,
                                }))
                              }
                            /> */}
                                  </div>
                                </div>
                                    <div className="col-span-12 lg:col-span-4">
                                      <div className="mb-3">
                                        <FormLabel className="text-[13px] text-primary mb-[1px]">
                                          {"MOBILE No."}{" "}
                                          <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <InputGroup>
                                          {/* Country code prefix */}
                                          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                            {registerForm?.isd_code
                                              ? `+${registerForm?.isd_code}`
                                              : ""}
                                          </span>

                                          {/* Mobile number input */}
                                          <FormInput
                                            className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                            type="text"
                                            placeholder="Mobile Number"
                                            autoComplete="off"
                                            maxLength={10}
                                            value={registerForm?.contact}
                                            onBlur={(e: any) =>
                                              verifytest("contact", e.target.value)
                                            }
                                            onChange={(e) =>
                                              setRegisterForm((prev) => ({
                                                ...prev,
                                                contact: e.target.value.replace(
                                                  /[^0-9]/g,
                                                  "",
                                                ), // Only digits
                                              }))
                                            }
                                            className="rounded-l-none" // removes left radius so it joins well with prefix
                                          />
                                        </InputGroup>
                                      </div>
                                    </div>
                              </div>
                            )}

                            <div className=" grid grid-cols-12 gap-x-2">
                              <div className="col-span-12 lg:col-span-6">
                                <div className="mb-3">
                                  <FormLabel className="text-[13px] text-primary mb-[1px]">
                                    ADDRESS 1
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormInput
                                    type="text"
                                    className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                    placeholder="Enter Address 1"
                                    autoComplete="off"
                                    value={registerForm?.address_1}
                                    onChange={(e) =>
                                      setRegisterForm((prev) => ({
                                        ...prev,
                                        address_1: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-span-12 lg:col-span-6">
                                <div className="mb-3">
                                  <FormLabel className="text-[13px] text-primary mb-[1px]">
                                    ADDRESS 2
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormInput
                                    type="text"
                                    className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                    placeholder="Enter Address 2"
                                    autoComplete="off"
                                    value={registerForm?.address_2}
                                    onChange={(e) =>
                                      setRegisterForm((prev) => ({
                                        ...prev,
                                        address_2: e.target.value,
                                      }))
                                    }
                                  />
                                </div>{" "}
                              </div>

                              <div className="col-span-12 lg:col-span-4">
                                <div className="mb-3">
                                  <FormLabel className="text-[13px] text-primary mb-[1px]">
                                    PINCODE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  {type == 2 ? (
                                    <CommonSearchableAll
                                      apiEndpoint={`admin/international-pincode?country_code=${
                                        registerForm?.destination_country_code ||
                                        ""
                                      }`}
                                      placeholder={"Search For Pincode"}
                                      selecteddata={selecteddata2}
                                      setSelecteddata={setSelecteddata2}
                                      fun1={funforpincode}
                                      key1={"zipcode"}
                                      comingselectedname={"zipcode"}
                                      comingselectedid={"city"}
                                      questionmark={true}
                                      isDisable={
                                        registerForm?.country_id ||
                                        registerForm?.country
                                          ? false
                                          : true
                                      }
                                      addcomingname2={"city_area"}
                                      addcomingname3={"state"}
                                      funtoempty={funtoemptypincode}
                                      zIndex={20}
                                      openhandedfun={funtohandle}
                                      forwhat="zipcode"
                                      id={selecteddata2?.zipcode}
                                    />
                                  ) : (
                                    <FormInput
                                      type="text"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="Enter Pincode"
                                      autoComplete="off"
                                      maxLength={6}
                                      value={registerForm?.pincode}
                                      onChange={(e) =>
                                        setRegisterForm((prev) => ({
                                          ...prev,
                                          pincode: e.target.value.replace(
                                            /[^0-9.]/g,
                                            "",
                                          ),
                                        }))
                                      }
                                      onBlur={() =>
                                        handleCityState(registerForm?.pincode)
                                      }
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="col-span-12 lg:col-span-4">
                                <div className="mb-3">
                                  <FormLabel className="text-[13px] text-primary mb-[1px]">
                                    CITY <span className="text-red-500">*</span>
                                  </FormLabel>
                                  {type == 2 ? (
                                    <CommonSearchableAll
                                      apiEndpoint={`admin/international-pincode?country_code=${
                                        registerForm?.destination_country_code ||
                                        ""
                                      }&zipcode=${
                                        registerForm?.destination_pincode || ""
                                      }`}
                                      placeholder={"Search For City"}
                                      selecteddata={selecteddata3}
                                      setSelecteddata={setSelecteddata3}
                                      fun1={fun4}
                                      key1={"city"}
                                      disabled={
                                        !registerForm?.pincode ||
                                        !registerForm?.country
                                      }
                                      comingselectedname={"city_area"}
                                      comingselectedid={"city_area"}
                                      questionmark={true}
                                      funtoempty={funtoempty4}
                                      openhandedfun={funtohandle}
                                      forwhat="city"
                                      zIndex={20}
                                      id={registerForm?.city}
                                      validation={true}
                                    />
                                  ) : (
                                    <FormInput
                                      type="text"
                                      className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]"
                                      placeholder="City"
                                      autoComplete="off"
                                      value={registerForm?.city}
                                      // onChange={(e) =>
                                      //   setRegisterForm((prev) => ({
                                      //     ...prev,
                                      //     pincode: e.target.value,
                                      //   }))
                                      // }
                                      disabled
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="col-span-12 lg:col-span-4">
                                <div className="mb-3">
                                  <FormLabel className="text-[13px] text-primary mb-[1px]">
                                    STATE
                                  </FormLabel>
                                  <FormInput
                                    type="text"
                                    className={`className="block px-3  py-1 h-[39px]  bg-[#FDFDFD] border-[#EBEBEB] rounded-[8px]" ${type == 1 ? "py-3" : "py-2"}`}
                                    placeholder="State"
                                    autoComplete="off"
                                    value={registerForm?.state}
                                    onChange={(e) =>
                                      setRegisterForm((prev) => ({
                                        ...prev,
                                        state: e.target.value,
                                      }))
                                    }
                                    // disabled
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                              <div className="mb-3">
                                <ReCAPTCHA
                                  sitekey="6LeYJr8pAAAAADcV-HBUF2ZIM6lmAZ0xw5MnjZPW"
                                  className="py-0 scale-[0.8] relative md:left-[-47px]   left-[-22px] mt-[-7px] "
                                  onChange={(value: any) => {
                                    setCaptchaValue(value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                              <div className="mb-3">
                                <div className="flex w-full  text-xs  sm:text-sm ">
                                  <FormCheck.Input
                                    type="checkbox"
                                    className="mr-2 border"
                                    checked={confirm}
                                    disabled={registerSpinner}
                                    onChange={(e) =>
                                      setConfirm(e.target.checked)
                                    }
                                  />
                                  <div className="flex items-center text-xs whitespace-nowrap flex-wrap">
                                    <span className="">
                                      I agree to the
                                      <span
                                        className="mx-1 text-xs whitespace-nowrap cursor-pointer hover:text-mustard hover:underline"
                                        onClick={() => setOpen(true)}
                                      >
                                        General terms & conditions for
                                        Carriage{" "}
                                      </span>
                                      and
                                      <span
                                        className="ml-1 md:ml-1 inline-block cursor-pointer hover:text-mustard hover:underline"
                                        onClick={() => setOpen(true)}
                                      >
                                        Terms and
                                      </span>
                                      <p
                                        className=" md:ml-1  inline-block cursor-pointer hover:text-mustard hover:underline"
                                        onClick={() => setOpen(true)}
                                      >
                                        Conditions
                                      </p>
                                      .
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CommonModal
                              open={open}
                              setOpen={setOpen}
                              title={"Terms & Conditions"}
                              description={Description}
                              size="md"
                            />
                          </>
                        )}

                        {step && step === 1 ? (
                          <>
                            <div className="flex justify-between w-full">
                              <div className=" flex justify-center items-center">
                                Already Registered ?{" "}
                                <Link
                                  to="/customer-login"
                                  className="text-mustard font-bold ml-1"
                                >
                                  {" "}
                                  Login
                                </Link>
                              </div>

                              {type == 1 ? (
                                <div className="flex justify-end">
                                  <Button
                                    variant="warning"
                                    className="w-28 mt-4 bg-mustard text-white"
                                    disabled={!verified}
                                    onClick={() => {
                                      setCaptchaValue("");
                                      setStep(2);
                                    }}
                                  >
                                    NEXT{" "}
                                    <Lucide
                                      icon="ArrowRight"
                                      className="w-4 h-4 ml-2 stroke-2.5"
                                    />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end">
                                  <Button
                                    variant="warning"
                                    className="w-28 mt-4 bg-mustard text-white"
                                    // disabled={
                                    //   !registerForm?.name ||
                                    //   !registerForm?.contact ||
                                    //   !registerForm?.email ||
                                    //   !verified||!verifiedemail
                                    // }
                                    onClick={() => {
                                      setCaptchaValue("");
                                      setStep(2);
                                      setRegisterForm((pre: any) => ({
                                        ...pre,
                                        pincode: selecteddata2?.zipcode || "",
                                        country: selecteddata?.country_id || "",
                                      }));
                                    }}
                                  >
                                    NEXT{" "}
                                    <Lucide
                                      icon="ArrowRight"
                                      className="w-4 h-4 ml-2 stroke-2.5"
                                    />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className=" flex flex-col items-center">
                            <div
                              className={`flex ${
                                type == 2
                                  ? "justify-between"
                                  : "justify-between"
                              } w-full`}
                            >
                              {type == 1 && (
                                <Button
                                  variant="primary"
                                  className="w-24  bg-primary text-white"
                                  onClick={() => {
                                    setCaptchaValue("");
                                    setStep(1);
                                    setType(1);
                                  }}
                                >
                                  <Lucide
                                    icon="ArrowLeft"
                                    className="w-4 h-4 mr-2 stroke-2.5"
                                  />
                                  BACK{" "}
                                </Button>
                              )}
                              <div className=" flex items-center">
                                Already Registered ?
                                <Link to="/">
                                  <Button className="inline-block   border-none text-mustard  hover:underline hover:underline-offset-4">
                                    Login
                                  </Button>
                                </Link>
                              </div>
                              {type == 1 ? (
                                <Button
                                  variant="warning"
                                  className="w-28 my-0 bg-mustard text-white"
                                  onClick={handleRegister}
                                  disabled={!captchaValue}
                                >
                                  REGISTER{" "}
                                  <Lucide
                                    icon="Send"
                                    className="w-4 h-4 ml-2 stroke-2"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  variant="warning"
                                  className="w-28 my-0 bg-mustard text-white"
                                  onClick={() => {
                                    handleSendOtp(false, "email");
                                  }}
                                  disabled={
                                    !captchaValue ||
                                    !registerForm?.country ||
                                    !registerForm?.currency_id ||
                                    !registerForm?.address_1 ||
                                    !registerForm?.address_2 ||
                                    !registerForm?.pincode ||
                                    !registerForm?.name ||
                                    !registerForm?.contact ||
                                    !registerForm?.email ||
                                    !registerForm?.city
                                  }
                                >
                                  REGISTER{" "}
                                  <Lucide
                                    icon="Send"
                                    className="w-4 h-4 ml-2 stroke-2"
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END: Register Form */}
      </div>

      <div className="md:static  bottom-[0px] left-[0px] right-[0px]    w-[100%] block lg:hidden mobilescooter ">
        <div className=" w-full overflow-hidden z-[1]  scooterBox">
          <div className="scooteranimate ">
            <div id="homer" className="scale-[.5] lg:transform-none">
              <img className="scooter" src={scooterUrl} />
              <i className="tyre wheel">
                <img src={tyreUrl} />
              </i>
              <i className="tyre2 wheel">
                <img src={tyreUrl} />
              </i>
              <i className="ekartline">
                <img src={ekartLineUrl} />
              </i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
