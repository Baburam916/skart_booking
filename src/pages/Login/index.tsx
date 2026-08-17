import logoUrl from "../../assets/images/icons/Side_logo.png";
import illustrationUrl from "../../assets/images/icons/Skart-Banner-homepage.png";
import { FormInput, FormLabel, InputGroup } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  forgotPassSendOtp,
  forgotPassVerifyOtp,
  getFranchiseeDetailsApi,
  loginApi,
} from "../../AllServices/config.service";
import { useAlert } from "../../ContextProvider/AlertContext";
import { useFranchisee } from "../../ContextProvider/FranchiseeContext";
import LoadingButton from "../../components/LoadingButton";
import Lucide from "../../base-components/Lucide";
import { useLogin } from "../../ContextProvider/LoginContext";

import "../../assets/css/login.css";
import { LogIn, Lock, User } from "lucide-react";

import CommonModal from "../../components/CommonModal";
import LoadingIcon from "../../base-components/LoadingIcon";
import scooterUrl from "../../assets/images/login/Skart-Banner.png";
import tyreUrl from "../../assets/images/login/tyre.png";
import ekartLineUrl from "../../assets/images/login/ekart-line2.gif";

axios.defaults.withCredentials = true;

export const POSTLogin = async (data: any) => {
  try {
    const response = loginApi(data);
    return response;
  } catch (err: any) {
    return err;
  }
};

const initialState = {
  buttonname: "Log In",
  resendotp: false,

  showresendbutton: false,
  type: 1,
  userName: "",
  password: "",
  start: false,
  showotpboxes: false,

  otp: ["", "", "", "", "", ""],
};

function Main() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useLogin();
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate("/franchisee/dashboard");
  //   }
  // }, [isLoggedIn, navigate]);
  const { showAlert } = useAlert();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [verify, setVerify] = useState<boolean>(false);
  const [resendotpisLoading, setResendotpisLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState(120);
  const refs = useRef([]);
  const LoginRefs = useRef([]);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setFranchisee } = useFranchisee();
  const [otpModal, setOtpModal] = useState(false);

  const [loginOtp, setLoginOtp] = useState(["", "", "", "", "", ""]);

  const [startTimer, setStartTimer] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);
  const otpMinutes = Math.floor(otpTimer / 60);
  const otpRemainingSeconds = otpTimer % 60;
  const [resendOtpSpinner, setResendOtpSpinner] = useState(false);
  const [verifyOtpSpinner, setVerifyOtpSpinner] = useState(false);
  const [loginSpinner, setLoginSpinner] = useState(false);

  const {
    start,
    resendotp,
    buttonname,
    userName,
    type,
    otp,
    showotpboxes,
    showresendbutton,
  } = state;

  const loginFunc = async (two_factor: any = 0) => {
    const loginData = {
      user_name: userName,
      password: password,
      ...(two_factor ? { otp: loginOtp?.join("") } : {}),
    };
    let response;
    try {
      response = await POSTLogin(loginData);
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
            const is_overseas = details?.data?.data[0]?.is_overseas;
            const currency_id = details?.data?.data[0]?.currency;
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
              is_overseas,
              currency_id,
              bulk_booking,
              is_test,
            );
            setOtpModal(false);
            login(response?.data?.data, 1);
            showAlert(`Welcome ${display_name}`, "success");
            // navigate("/franchisee/dashboard");
          } else if (details?.status == 203) {
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
        } else if (
          response?.status == 200 &&
          response?.data?.message == "OTP sent successfully!"
        ) {
          setOtpModal(true);
          setOtpTimer(120);
          setStartTimer(true);
          showAlert("OTP sent Successfully!!");
        } else {
          showAlert("You're not Active Contact Admin", "error");
        }
      } else if (response?.status == 203) {
        showAlert(response?.data?.message, "error");
      } else if (response?.status == 204) {
        showAlert("Username not found", "error");
      } else if (response?.response?.status == 412) {
        showAlert(response?.response?.data?.message, "warning");
      } else if (response?.status == 504 || response?.response?.status == 504) {
        showAlert("Failed to fetch", "error");
      } else if (response?.status == 500 || response?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.status == 502 || response?.response?.status == 502) {
        showAlert("Bad Gateway", "error");
      } else if (response?.response && response?.response?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.msg, "error");
      } else {
        if (response?.message) {
          showAlert(response?.message, "error");
        } else if (response?.data?.message) {
          showAlert(response?.data?.message, "error");
        } else {
          showAlert("something went wrong", "error");
        }
      }
    } catch (error) {
      console.log(error);
      if (error?.message) {
        showAlert(error?.message, "error");
      } else {
        showAlert("something went wrong", "error");
      }
    } finally {
      setVerifyOtpSpinner(false);
      setResendOtpSpinner(false);
      setLoginSpinner(false);
    }
  };

  useEffect(() => {
    if (timer == 0) {
      setState((pre) => ({ ...pre, start: false, resendotp: true }));

      setTimer(120);
      // setResendotp(true)
    } else {
      if (type == 2 && start) {
        setState((pre) => ({ ...pre, resendotp: false }));

        const value = setInterval(() => {
          if (timer > 0) {
            setTimer((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);

        return () => clearInterval(value);
      }
    }
  }, [timer, start, buttonname]);

  useEffect(() => {
    if (otpTimer == 0) {
      setStartTimer(false);
    } else {
      if (startTimer) {
        //   setResendOtp(false);
        const value = setInterval(() => {
          if (otpTimer > 0) {
            setOtpTimer((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);
        return () => clearInterval(value);
      }
    }
  }, [otpTimer, startTimer]);

  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;

  const handleotprequest = async () => {
    try {
      setIsLoading(true);
      const response: any = await forgotPassSendOtp(userName);
      if (response?.status == 200) {
        // showAlert(response?.data?.message, "success");
        showAlert("Password is sent to your email id", "success");
        setState((pre) => ({
          ...pre,
          showotpboxes: true,
          showresendbutton: true,
        }));
        // setShowResendbutton(true)
        setState((pre: any) => ({
          ...pre,
          buttonname: "Verify OTP",
          start: true,
        }));
        // setStart(true);
      } else if (response?.status == 204) {
        showAlert("Username not found", "error");
      } else if (response?.status == 203) {
        showAlert(response?.data.message, "error");
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response.status == 400) {
        showAlert("Bad Request", "error");
      } else if (response?.response.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response.status == 502) {
        showAlert("Bad GateWay", "error");
      }
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleresendotprequest = async () => {
    try {
      setResendotpisLoading(true);

      const response: any = await forgotPassSendOtp(userName);

      // console.log(response,"deleteresponse")

      if (response?.status == 200) {
        showAlert(response?.data.message, "success");
        setState((pre) => ({
          ...pre,
          showotpboxes: true,
          showresendbutton: true,
          resendotp: false,
          start: true,
        }));
        setTimer(120);
      } else if (response?.status == 204) {
        showAlert("Username not found", "error");
      } else if (response?.status == 203) {
        showAlert(response?.data.message, "error");
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response.status == 400) {
        showAlert("Bad Request", "error");
      } else if (response?.response.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response.status == 502) {
        showAlert("Bad GateWay", "error");
      }
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setIsLoading(false);
      setResendotpisLoading(false);
    }
  };

  // post otp request
  const verifyotprequest = async () => {
    try {
      setIsLoading(true);
      setVerify(true);
      const response: any = await forgotPassVerifyOtp(userName, otp.join(""));

      if (response?.status == 200) {
        showAlert(response?.data.message, "success");
        setState((pre: any) => ({
          ...pre,
          otp: ["", "", "", "", "", ""],
          userName: "",
          showotpboxes: false,
          showresendbutton: false,
          buttonname: "Log In",
          type: 1,
          resendotp: true,
          start: false,
        }));

        setTimer(120);
      } else if (response?.status == 203) {
        showAlert(response?.data.message, "error");
      } else if (response?.response.status == 204) {
        showAlert(response?.response.data.message, "error");
      } else if (response?.response.status == 203) {
        showAlert(response?.response.data.message, "error");
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else {
        showAlert("Something going wrong!..", "error");
      }
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setIsLoading(false);
      setVerify(false);
    }
  };

  const handleChange = (index: any, event: any, isLogin: any = 0) => {
    if (isLogin) {
      const newOTP = [...loginOtp];
      newOTP[index] = event.target.value;
      setLoginOtp(newOTP);
      if (event.target.value && index < loginOtp.length - 1) {
        LoginRefs.current[index + 1].focus();
      }
    } else {
      const newOTP = [...otp];
      newOTP[index] = event.target.value;
      setState((pre) => ({ ...pre, otp: newOTP }));

      if (event.target.value && index < otp.length - 1) {
        refs.current[index + 1].focus();
      }
    }
  };
  const handleKeyPress = (index: any, event: any, isLogin: any = 0) => {
    // Move focus to the previous input box if backspace is pressed in an empty input
    if (event.key === "Backspace" && !otp[index] && index > 0 && !isLogin) {
      refs.current[index - 1].focus();
    } else if (
      event.key === "Backspace" &&
      !loginOtp[index] &&
      index > 0 &&
      isLogin
    ) {
      LoginRefs.current[index - 1].focus();
    }
  };

  const checklength = (otp: any) => {
    const data = otp.filter((item: any) => {
      if (item) {
        return item;
      }
    });
    return data.length == 6;
  };

  const ModalDescription = (
    <>
      <p className="text-center">Enter 6-digit OTP</p>
      <div className="flex justify-center mt-4">
        <div className="flex space-x-4">
          {loginOtp?.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e, 1)}
              onKeyDown={(e) => handleKeyPress(index, e, 1)}
              className="w-10 h-10 shadow-lg  text-center text-primary  border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              ref={(input) => (LoginRefs.current[index] = input)}
            />
          ))}
        </div>
      </div>

      <div className="pt-6 px-12 text-center">
        {startTimer ? (
          <p>
            RESEND OTP IN: {otpMinutes < 10 ? `0${otpMinutes}` : otpMinutes}:
            {otpRemainingSeconds < 10
              ? `0${otpRemainingSeconds}`
              : otpRemainingSeconds}
          </p>
        ) : (
          <Button
            className="w-full bg-mustard text-white"
            onClick={() => {
              setResendOtpSpinner(true);
              loginFunc();
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
        <Button
          className="bg-mustard text-white w-full"
          disabled={!checklength(loginOtp) || verifyOtpSpinner}
          onClick={() => {
            setVerifyOtpSpinner(true);
            loginFunc(1);
          }}
        >
          VERIFY
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
                  <div className="scooteranimate">
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

        {/* END: Login Info */}
        {/* BEGIN: Login Form */}

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
                  <LogIn className="w-[21px]" />
                  <h2 className="text-lg font-bold uppercase text-center text-[#303030] ml-2">
                    {type == 1 ? "Sign In" : "Forgot Password"}
                  </h2>
                </div>

                <div className="bg-white  rounded-[20px] overflow-hidden relative">
                  <div className=" p-[20px]">
                    <div className="mt-4 intro-x">
                      <div className="mb-3">
                        <FormLabel className="text-[14px] text-primary mb-[2px]">
                          Username
                        </FormLabel>
                        <div className="w-full relative">
                          <i className="absolute top-[7px] left-[0px] z-[50] border-r border-[#eee]  h-[70%] px-[6px] py-[3px] w-[36px] flex items-center justify-center">
                            <User className="text-[#B1B1B1] w-[21px]" />
                          </i>

                          <FormInput
                            type="text"
                            className="block pr-4 pl-[45px] py-3  bg-[#FDFDFD] border-[#EBEBEB] rounded-[10px]"
                            placeholder="Enter username"
                            value={userName}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                userName: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                setLoginSpinner(true);
                                loginFunc();
                              }
                            }}
                          />
                        </div>{" "}
                      </div>

                      {type == 1 ? (
                        <div className="mb-0">
                          <FormLabel className="text-[14px] text-primary mb-[2px]">
                            Password
                          </FormLabel>

                          <div className="w-full relative">
                            <i className="absolute top-[7px] left-[0px] z-[50] border-r border-[#eee]  h-[70%] px-[6px] py-[3px] w-[36px] flex items-center justify-center">
                              <Lock className="text-[#B1B1B1] w-[18px]" />
                            </i>
                            <InputGroup className="w-full roundedBox">
                              <FormInput
                                type={`${showPass ? "text" : "password"}`}
                                className="block pr-4 pl-[45px] py-3  bg-[#FDFDFD] border-[#EBEBEB] rounded-[20px]"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  setState((pre: any) => ({
                                    ...pre,
                                    password: e.target.value,
                                  }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    setLoginSpinner(true);
                                    loginFunc();
                                  }
                                }}
                              />
                            </InputGroup>

                            <InputGroup.Text
                              id="input-group-price"
                              className="bg-inherit shadow-none w-[20px] absolute right-[15px] top-[9px] z-[10] border-none  p-0"
                            >
                              <Lucide
                                icon={`${showPass ? "Eye" : "EyeOff"}`}
                                className="text-mustard stroke-2.5 mt-1 h-5 cursor-pointer"
                                onClick={() => setShowPass(!showPass)}
                              />
                            </InputGroup.Text>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex justify-end mr-auto">
                      {type == 1 && (
                        <div
                          className="mt-2"
                          onClick={() => {
                            setState((pre) => ({
                              ...pre,
                              type: 2,
                              buttonname: "Send OTP",
                            }));
                          }}
                        >
                          <p className="text-mustard cursor-pointer">
                            Forgot Password?
                          </p>
                        </div>
                      )}
                    </div>
                    {type == 2 && start && (
                      <div className="flex justify-center p-2 mt-2 bg-mustard text-white">
                        {" "}
                        <p>
                          RESEND OTP IN:{" "}
                          {minutes < 10 ? `0${minutes}` : minutes}:
                          {remainingSeconds < 10
                            ? `0${remainingSeconds}`
                            : remainingSeconds}
                        </p>
                      </div>
                    )}
                    {type == 2 && showotpboxes ? (
                      <div className="flex justify-center mt-8">
                        <div className="flex space-x-4">
                          {otp.map((digit, index) => (
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
                    ) : (
                      ""
                    )}
                    <div className="mt-4 text-center intro-x xl:text-left">
                      {isLoading ? (
                        <Button className="w-full px-4 py-2 mb-2 align-top xl:w-full xl:mr-3 bg-mustard text-white rounded-full text-lg hover:bg-[#dba948]">
                          {type == 1 && buttonname == "Log In" ? (
                            <LoadingButton text="Logging" />
                          ) : type == 2 &&
                            buttonname == "Verify OTP" &&
                            verify ? (
                            <LoadingButton text="Verifying" />
                          ) : type == 2 &&
                            buttonname == "Send OTP" &&
                            !resendotp ? (
                            <LoadingButton text={"Sending OTP"} />
                          ) : type == 2 &&
                            buttonname == "Send OTP" &&
                            resendotp ? (
                            <LoadingButton text={"Sending OTP"} />
                          ) : (
                            ""
                          )}
                        </Button>
                      ) : (
                        <Button
                          disabled={
                            loginSpinner
                              ? true
                              : type == 2 &&
                                buttonname == "Verify OTP" &&
                                checklength(otp) == true
                                ? false
                                : type == 2 &&
                                  buttonname == "Send OTP" &&
                                  state?.userName
                                  ? false
                                  : type == 1 &&
                                    buttonname == "Log In" &&
                                    state?.userName &&
                                    state?.password
                                    ? false
                                    : true
                          }
                          onClick={() => {
                            type == 1
                              ? (setLoginSpinner(true), loginFunc())
                              : type == 2 && buttonname == "Verify OTP"
                                ? type == 2 && verifyotprequest()
                                : buttonname == "Send OTP"
                                  ? type == 2 && handleotprequest()
                                  : "";
                          }}
                          className="w-full px-4 py-2 mb-2 align-top xl:w-full xl:mr-3 bg-mustard text-white rounded-full text-lg hover:bg-[#dba948]"
                        >
                          {type == 1 ? "Log In" : type == 2 ? buttonname : ""}
                          {loginSpinner && (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          )}
                        </Button>
                      )}
                      <div>
                        {" "}
                        <div>
                          {type == 2 && showresendbutton && (
                            <>
                              {type == 2 && resendotpisLoading ? (
                                <Button
                                  disabled={resendotp == false}
                                  className="w-full text-white px-4 py-2 align-top xl:w-full xl:mr-3 bg-mustard"
                                >
                                  <LoadingButton text="Resending" />
                                </Button>
                              ) : (
                                <Button
                                  disabled={resendotp == false}
                                  onClick={() => {
                                    handleresendotprequest();
                                  }}
                                  className="w-full text-white px-4 py-2 align-top xl:w-full xl:mr-3 bg-mustard"
                                >
                                  Resend OTP
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {type == 2 ? (
                        <div className="flex justify-end mt-2">
                          {" "}
                          <div
                            onClick={() => {
                              setTimer(120);
                              setState((pre: any) => ({
                                ...pre,
                                otp: ["", "", "", "", "", ""],
                                userName: "",
                                showotpboxes: false,
                                showresendbutton: false,
                                buttonname: "Log In",
                                type: 1,
                                start: false,
                                resendotp: true,
                              }));

                              setTimer(120);
                            }}
                          >
                            <p className="text-mustard cursor-pointer">
                              Go Back
                            </p>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mt-0 flex justify-center items-center ">
                      <Link to="/customer-login">
                        <Button className="inline-block mx-2 border-none text-mustard  underline underline-offset-4 hover:no-underline">
                          Login as Customer
                        </Button>
                      </Link>
                    </div>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* END: Login Form */}

        {otpModal && (
          <CommonModal
            open={otpModal}
            setOpen={setOtpModal}
            title={"OTP VERIFICATION"}
            description={ModalDescription}
            // footer={ModalFooter}
            sticky={true}
            size="md"
          />
        )}
      </div>

      <div className="md:static absolute bottom-[0px] left-[0px] right-[0px]    w-[109%] block lg:hidden mobilescooter ">
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
