import logoUrl from "../../../assets/images/icons/Side_logo.png";
import illustrationUrl from "../../../assets/images/icons/Skart-Banner-homepage.png";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAlert } from "../../../ContextProvider/AlertContext";
import { useEffect, useRef, useState } from "react";
import LoadingIcon from "../../../base-components/LoadingIcon";
import {
  directCustomerLoginOtp,
  directCustomerMatchOtp,
  getFranchiseeDetailsApi,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { useLogin } from "../../../ContextProvider/LoginContext";

import "../../../assets/css/login.css";
import { LogIn, Lock, User, Phone } from "lucide-react";
import scooterUrl from "../../../assets/images/login/Skart-Banner.png";
import tyreUrl from "../../../assets/images/login/tyre.png";
import ekartLineUrl from "../../../assets/images/login/ekart-line2.gif";

axios.defaults.withCredentials = true;

function Main() {
  const { showAlert } = useAlert();
  const cookies = document.cookie.split("; ");
  useEffect(() => {
    if (cookies?.includes("act=true")) {
      showAlert(
        "Congratulations! your account has been activated successfully",
      );
    }
  }, []);

  const navigate = useNavigate();
  const { isLoggedIn, login } = useLogin();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/franchisee/dashboard");
    }
  }, [isLoggedIn, navigate]);
  const { setFranchisee } = useFranchisee();
  const [mobileNo, setMobileNo] = useState("");
  const [verified, setVerified] = useState(false);
  const [sendOtpSpinner, setSendOtpSpinner] = useState(false);
  const [loginSpinner, setLoginSpinner] = useState(false);
  const [disable, setDisable] = useState(false);
  const refs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(60);
  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;

  const handleSendOtp = async () => {
    if (sendOtpSpinner) {
      return;
    }

    if (!mobileNo) {
      showAlert("Please Enter Registered Mobile No.", "warning");
      return;
    }
    setSendOtpSpinner(true);
    setDisable(true);
    try {
      const response = await directCustomerLoginOtp({ mobile_no: mobileNo });
      if (response?.status == 200) {
        showAlert(response?.data?.message);
        setStartTimer(true);
        setVerified(true);
      } else if (response?.status == 204) {
        showAlert("User Not Found", "error");
        setDisable(false);
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error",
        );
        setDisable(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendOtpSpinner(false);
    }
  };

  const handleLogin = async () => {
    setLoginSpinner(true);
    try {
      const response = await directCustomerMatchOtp({
        mobile_no: mobileNo,
        otp: otp?.join(""),
      });
      if (response?.status == 200) {
        localStorage.setItem(
          "current_user",
          JSON.stringify(response?.data?.data),
        );

        const franchisee_id = response?.data?.data?.mapped_id;
        const display_name = response?.data?.data?.display_name;
        // console.log(franchisee_id, "franchisee_id");

        if (franchisee_id >= 0 || franchisee_id) {
          const details = await getFranchiseeDetailsApi(franchisee_id);
          if (details?.status == 200) {
            const franchisee_name = details?.data?.data[0]?.franchisee_name;
            const franchisee_code = details?.data?.data[0]?.ba_code;
            const branch_id = details?.data?.data[0]?.branch;
            const hub_id = details?.data?.data[0]?.hub;
            const available_credit_limit =
              details?.data?.data[0]?.available_credit_limit;
            const credit_limit = details?.data?.data[0]?.credit_limit;
            const wallet = details?.data?.data[0]?.wallet;
            const security_deposit = details?.data?.data[0]?.security_deposite;
            const live_vendor_details =
              details?.data?.data[0]?.live_vendor_details;
            // console.log("franchisee details ", details);
            const is_kavach = details?.data?.data[0]?.is_kawach;
            const kavach_expiry = details?.data?.data[0]?.kawach_expiry;
            const is_direct_cust = details?.data?.data[0]?.is_direct_customer;
            const gst_status = details?.data?.data[0]?.gst_status;
            const is_test = details?.data?.data[0]?.is_test;
            const isOverseas = details?.data?.data[0]?.is_overseas;
            const currencyId = details?.data?.data[0]?.currency;
            const bulk_booking = details?.data?.data[0]?.bulk_booking;

            setFranchisee(
              display_name,
              franchisee_name,
              franchisee_code,
              franchisee_id,
              is_direct_cust,
              gst_status,
              is_kavach,
              kavach_expiry,
              hub_id,
              branch_id,
              available_credit_limit,
              credit_limit,
              wallet,
              security_deposit,
              live_vendor_details,
              isOverseas,
              currencyId,
              bulk_booking,
              is_test,
            );

            login(response?.data?.data);
            showAlert(`Welcome ${display_name}`, "success");
            navigate("/franchisee/dashboard");
          } else if (details?.status == 203 || details?.data?.status == 400) {
            showAlert(details?.data?.message, "error");
          } else if (details?.status == 204) {
            showAlert("Username not found", "error");
          } else if (details?.response?.status == 412) {
            showAlert(details?.response?.data?.message, "warning");
          } else if (
            details?.status == 504 ||
            details?.response?.status == 504
          ) {
            showAlert("Failed to fetch", "error");
          } else if (
            details?.status == 500 ||
            details?.response?.status == 500
          ) {
            showAlert("Internal Server Error", "error");
          } else if (
            details?.status == 502 ||
            details?.response?.status == 502
          ) {
            showAlert("Bad Gateway", "error");
          } else if (details?.response && details?.response?.status == 406) {
            showAlert(details?.response?.data?.errors[0]?.msg, "error");
          } else {
            if (details?.message) {
              showAlert(details?.message, "error");
            } else if (details?.data?.message) {
              showAlert(details?.data?.message, "error");
            } else {
              showAlert("something went wrong", "error");
            }
          }
        } else {
          showAlert("You're not Active Contact Admin", "error");
        }
      } else if (response?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.msg, "error");
      } else if (response?.status == 203) {
        showAlert(response?.data?.message, "error");
      } else if (response?.status == 400) {
        showAlert(response?.data?.message, "error");
      }
    } catch (error) {
      console.log(error);
      showAlert(
        error?.data?.message ||
        error?.response?.data?.message ||
        error?.message,
        "error",
      );
    } finally {
      setLoginSpinner(false);
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
      handleLogin();
    }
  };
  const checklength = () => {
    const data = otp?.filter((item) => {
      if (item) {
        return item;
      }
    });
    return data?.length == 6;
  };

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

  return (
    <>
      <div
        className={
          "lg:flex  block lg:-m-3 lg:-mx-8 relative lg:h-[100%]  lg:overflow-hidden lg:w-auto w-full overflow-hidden"
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
                      <img
                        className="scooter"
                        src={scooterUrl}
                      />
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

        <div className="lg:w-[50%] w-full bg-[#777779] lg:bg-[#fff] lg:p-[100px] md:p-[10px] ">
          <div className="lg:hidden block">
            <a
              href=""
              className="flex items-center mt-3 mb-5 text-center justify-center"
            >
              <img
                alt="sKart Logo"
                className="w-[240px]"
                src={logoUrl}
                style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
              />
            </a>
          </div>

          <div className="w-full m-auto md:h-full flex items-center ">
            <div className="w-full lg:w-[460px] bg-white  rounded-[20px] overflow-hidden relative p-[1px]">
              <div className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] hover:[animation-play-state:paused]">
                <div
                  className="h-full w-full
                       bg-[conic-gradient(#d8def0,#f9cd73_4%,#d8def0_20%,#d8def0_95%)]
                       [mask:linear-gradient(#d8def0_0_0)_content-box,linear-gradient(#d8def0_0_0)]
                       [mask-composite:exclude]
                       p-[5px] hover:bg-[conic-gradient(#303030,#303030%,#303030_60%,#303030_95%)]"
                ></div>
              </div>

              <div className="bg-white  rounded-[20px] overflow-hidden relative">
                <div className="w-full bg-[#f7f8fb] border-b border-[#d8def0] rounded-t-[20px] p-[10px] flex items-center justify-center ">
                  <User className="w-[21px]" />
                  <h2 className="text-lg font-bold uppercase text-center text-[#303030] ml-2">
                    Customer Login
                  </h2>
                </div>

                <div className="bg-white  rounded-[20px] overflow-hidden relative">
                  <div className=" p-[20px]">
                    <div className="mb-3">
                      <FormLabel className="text-[14px] text-primary mb-[2px]">
                        Mobile No.
                      </FormLabel>

                      <div className="w-full relative">
                        <i className="absolute top-[7px] left-[0px] z-[50] border-r border-[#eee]  h-[70%] px-[6px] py-[3px] w-[36px] flex items-center justify-center">
                          <Phone className="text-[#B1B1B1] w-[19px]" />
                        </i>
                        <FormInput
                          type="text"
                          className="block pr-4 pl-[45px] py-3  bg-[#FDFDFD] border-[#EBEBEB] rounded-[10px]"
                          placeholder="Enter Mobile no."
                          value={mobileNo}
                          maxLength={10}
                          disabled={disable}
                          onChange={(e) =>
                            setMobileNo(e.target.value.replace(/[^0-9.]/g, ""))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSendOtp();
                            }
                          }}
                        />
                      </div>
                    </div>

                    {verified ? (
                      <div className="mt-4 text-center intro-x xl:text-left">
                        <>
                          <p className="text-center">Enter 6-digit OTP</p>
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
                                RESEND OTP IN:{" "}
                                {minutes < 10 ? `0${minutes}` : minutes}:
                                {remainingSeconds < 10
                                  ? `0${remainingSeconds}`
                                  : remainingSeconds}
                              </p>
                            ) : (
                              <></>
                            )}
                          </div>
                        </>

                        {startTimer ? (
                          <></>
                        ) : (
                          <p
                            className="text-mustard underline text-center underline-offset-2 cursor-pointer font-bold hover:no-underline mb-2"
                            onClick={handleSendOtp}
                          >
                            Resend OTP
                          </p>
                        )}

                        <Button
                          className="w-full px-4 py-2 mb-2 align-top xl:w-full xl:mr-3 bg-mustard text-white rounded-full text-lg hover:bg-[#dba948]"
                          onClick={handleLogin}
                          disabled={loginSpinner}
                        >
                          {loginSpinner ? "VERIFING OTP" : "VERIFY OTP"}

                          {loginSpinner && (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          )}
                        </Button>

                        <p
                          className="text-mustard underline text-center underline-offset-2 cursor-pointer font-bold hover:no-underline mb-2"
                          onClick={() => {
                            setVerified(false);
                            setDisable(false);
                            setOtp(["", "", "", "", "", ""]);
                          }}
                        >
                          Change Mobile No.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 text-center intro-x xl:text-left">
                        <Button
                          className="w-full px-4 py-2 mb-2 align-top xl:w-full xl:mr-3 bg-mustard text-white rounded-full text-lg hover:bg-[#dba948]"
                          onClick={handleSendOtp}
                        >
                          {sendOtpSpinner ? "SENDING OTP" : "SEND OTP"}

                          {sendOtpSpinner && (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          )}
                        </Button>
                        {disable && (
                          <p
                            className="text-mustard underline text-center underline-offset-2 cursor-pointer font-bold hover:no-underline mb-2"
                            onClick={() => {
                              setVerified(false);
                              setDisable(false);
                              setOtp(["", "", "", "", "", ""]);
                              setSendOtpSpinner(false);
                            }}
                          >
                            Change Mobile No.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-center items-center ">
                      <Link to="/">
                        <Button className="inline-block mx-2 border-none text-mustard  underline underline-offset-4 hover:no-underline">
                          Login as Franchisee
                        </Button>
                      </Link>
                    </div>
                    <div className="flex justify-center text-primary dark:text-slate-200">
                      <div className="flex items-center">
                        Don't have an account ?
                        <Link to="/register">
                          <Button className="inline-block w-20 mx-2 border-none text-mustard underline underline-offset-4 hover:no-underline">
                            Register
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* END: Login Form */}
        </div>
      </div>

      <div className="md:static absolute bottom-[0px] left-[0px] right-[0px]    w-[109%] block lg:hidden mobilescooter">
        <div className=" w-full overflow-hidden z-[1]  scooterBox">
          <div className="scooteranimate ">
            <div id="homer" className="scale-[.5] lg:transform-none">
              <img
                className="scooter"
                src={scooterUrl}
              />
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
