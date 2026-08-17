import React, { useEffect, useRef, useState } from "react";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { CalendarDays, Calendar } from "lucide-react";
import {
  activateKavachApi,
  checkKavachApi,
  checkKavachTimelineApi,
  deactivateKavachApi,
  getFranchiseeDetailsApi,
  submitKavachOtpApi,
} from "../../../AllServices/config.service";
import { formatOnlyDate, getDaysDifference } from "../../../utils";
import { FormCheck, FormInput, FormLabel } from "../../../base-components/Form";
import { useAlert } from "../../../ContextProvider/AlertContext";
import Button from "../../../base-components/Button";
import LoadingIcon from "../../../base-components/LoadingIcon";
import AvatarIconGreen from "../../../assets/images/icons/UserProfile.png";
import AvatarIconRed from "../../../assets/images/icons/UserProfileRed.png";

import AvatarIconGreen1 from "../../../assets/images/icons/AvatarGreen1.png";
import AvatarIconRed1 from "../../../assets/images/icons/deactive.png";

import CommonModal from "../../../components/CommonModal";
import { AlertTriangle, Clock } from "lucide-react";

const index = () => {
  const {
    isKavach,
    isDirectCust,
    kavachExpiry,
    franchiseeId,
    setFranchisee,
    displayName,
    franchiseeName,
    franchiseeCode,
    branchId,
    hubId,
  } = useFranchisee();
  const [accepted, setAccepted] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [sendOtpSpinner, setSendOtpSpinner] = useState(false);
  const [resendOtpSpinner, setResendOtpSpinner] = useState(false);
  const [submitOtpSpinner, setSubmitOtpSpinner] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const { showAlert } = useAlert();
  const [otpModal, setOtpModal] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const refs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(300);
  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;
  const [check, setCheck] = useState(true);
  const [timeline, setTimeline] = useState({});
  const currentDate = new Date();

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
  };

  const checklength = () => {
    const data = otp?.filter((item) => {
      if (item) {
        return item;
      }
    });
    return data?.length == 4;
  };

  const franchiseeDetails = async () => {
    try {
      const response = await getFranchiseeDetailsApi(franchiseeId);
      if (response?.data) {
        const available_credit_limit =
          response?.data?.data[0]?.available_credit_limit;
        const credit_limit = response?.data?.data[0]?.wallet;
        const security_deposit = response?.data?.data[0]?.security_deposite;
        const live_vendor_details =
          response?.data?.data[0]?.live_vendor_details;
        const wallet = response?.data?.data[0]?.wallet;
        const is_kavach = response?.data?.data[0]?.is_kawach;
        const kavach_expiry = response?.data?.data[0]?.kawach_expiry;
        const isDirectCust = response?.data?.data[0]?.is_direct_customer;
        const gstStatus = response?.data?.data[0]?.gst_status;
        const is_test = response?.data?.data[0]?.is_test;
        const isOverseas = response?.data?.data[0]?.is_overseas;
        const currencyId = response?.data?.data[0]?.currency_id;
        const bulk_booking = response?.data?.data[0]?.bulk_booking;

        setFranchisee(
          displayName,
          franchiseeName,
          franchiseeCode,
          franchiseeId,
          isDirectCust,
          gstStatus,
          is_kavach,
          kavach_expiry,
          hubId,
          branchId,
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
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      if (error) showAlert("something went wrong", "error");
    }
  };

  // const activateKavach = async (type: number) => {
  //   if (!accepted && type == 1) {
  //     showAlert("Please accept the terms and conditions", "warning");
  //     return;
  //   }

  //   setSpinner(true);
  //   try {
  //     const res = await activateKavachApi(franchiseeId);

  //     if (res?.status == 200) {
  //       franchiseeDetails();
  //       showAlert(res?.data?.message);
  //     } else {
  //       showAlert(res?.message, "error");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setSpinner(false);
  //   }
  // };
  const deactivateKavach = async () => {
    if (!reason) {
      showAlert("Please enter deactivation reason", "warning");
      return;
    }

    setSpinner(true);
    try {
      const res = await deactivateKavachApi({
        franchisee_id: franchiseeId,
        reason,
      });

      if (res?.status == 200 || res?.status == 201) {
        showAlert(res?.data?.message);
        setReasonModal(false);
        setReason("");
        fetchData();
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };

  const sendKavachOtp = async () => {
    try {
      const res = await activateKavachApi(franchiseeId);
      if (res?.status == 200) {
        showAlert(res?.data?.message);
        setOtpModal(true);
        setStartTimer(true);
        setTimer(300);
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
      setResendOtpSpinner(false);
    }
  };

  const submitOtp = async () => {
    setSubmitOtpSpinner(true);
    try {
      const res = await submitKavachOtpApi({
        franchisee_id: franchiseeId,
        otp: otp?.join(""),
      });

      if (res?.status == 200) {
        showAlert(res?.data?.message);
        franchiseeDetails();
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
      setSubmitOtpSpinner(false);
    }
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
              sendKavachOtp();
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
        disabled={!checklength(otp) || submitOtpSpinner}
        onClick={submitOtp}
      >
        Verify
        {submitOtpSpinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </>
  );

  const reasonDescription = (
    <div className="space-y-2 p-2 overflow-auto">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="rounded-full p-2 bg-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <h2 className="text-sm font-semibold text-red-500 sm:text-base">
          Warning: Kavach Deactivation Request
        </h2>
      </div>
      <p className="mt-3 text-muted-foreground text-xs sm:text-sm">
        We understand that you are considering deactivating your Kavach
        subscription, but before you proceed, we'd like you to reconsider the
        potential impact.
      </p>

      {/* Warning Section */}
      <div className="rounded-lg border-2 border-red-400 bg-red-100 p-3 sm:p-4 text-red-500 text-xs sm:text-sm">
        <p className="font-semibold">Please note:</p>
        <ul className="mt-3 list-disc pl-4 space-y-2">
          <li>
            If you deactivate Kavach before the end of your 3-month subscription
            period, you will
            <span className="font-semibold">
              {" "}
              not be eligible to claim the 2% premium
            </span>{" "}
            paid on your previous bookings.
          </li>
          <li>
            <span className="font-semibold">All future bookings</span> will{" "}
            <span className="font-semibold">no longer benefit</span> from
            Kavach&apos;s protection.
          </li>
          <li>
            All bookings done under your current Kavach period will also not get
            any benefit from the Kavach program.
          </li>
        </ul>
      </div>

      {/* Benefits Section */}
      <div className="rounded-lg border-2 bg-yellow-50 p-3 sm:p-4 shadow-sm text-mustard border-mustard text-xs sm:text-sm">
        <h3 className="font-semibold text-sm sm:text-base">Why Keep Kavach?</h3>
        <p className="mt-2 text-muted-foreground">
          Kavach ensures that your shipments remain free from surprise fees,
          keeping your costs predictable and under control. By continuing your
          subscription, you maintain the peace of mind that comes with knowing
          that your shipping expenses won&apos;t increase unexpectedly.
        </p>
      </div>

      {/* Support Note */}
      <p className="text-xs sm:text-sm text-muted-foreground mt-3">
        Take a moment to think about the long-term savings and convenience
        Kavach provides. You can always reach out to our support team if you
        have any questions or need more information.
      </p>

      {/* Reason Input */}
      <div>
        <FormLabel htmlFor="reason" className="text-sm sm:text-base">
          Reason <span className="text-red-500">*</span>
        </FormLabel>
        <FormInput
          id="reason"
          placeholder="Please provide a reason for deactivation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              deactivateKavach();
            }
          }}
          className="h-10 sm:h-12 text-sm sm:text-base"
        />
      </div>
    </div>
  );
  const reasonFooter = (
    <>
      <Button
        onClick={deactivateKavach}
        size="sm"
        className="bg-red-400 text-white font-bold text-lg"
        disabled={!reason || spinner}
      >
        Send{" "}
        {spinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </>
  );

  const fetchData = async () => {
    try {
      const res = await checkKavachApi(franchiseeId);
      if (res?.status == 200) {
        setCheck(res?.data?.status);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTimeline = async () => {
    try {
      const res = await checkKavachTimelineApi(franchiseeId);
      if (res?.status == 200) {
        setTimeline(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isKavach == 1) {
      fetchData();
      fetchTimeline();
    }
  }, [isKavach]);

  useEffect(() => {
    if (!otpModal) {
      setOtp(["", "", "", ""]);
    }
  }, [otpModal]);

  useEffect(() => {
    if (timer == 0) {
      setStartTimer(false);
      setResendOtp(true);
      setTimer(300);
    } else {
      if (startTimer) {
        setResendOtp(false);

        const value = setInterval(() => {
          if (timer > 0) {
            setTimer((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);

        return () => clearInterval(value);
      }
    }
  }, [timer, startTimer]);

  // activateKavachApi
  return (
    <div className="box max-w-8xl p-4 mt-8">
      <div className="w-full block md:flex">
        {isKavach == 1 ? (
          <div className="pr-0 md:pr-9 md:pl-[50px] md:py-[40px]   pl-[0px] py-[0px]">
            <div className="KavachBoxmAIN text-center">
              <div className="KavachBox m-auto relative w-[140px] h-[140px] rounded-full border border-green-400 flex items-center justify-center bg-[#eaffed] shadow-[0_0px_11px_#b4e8bb]">
                <figure>
                  <img
                    alt="Avatar"
                    className=" m-auto"
                    src={AvatarIconGreen1}
                  />
                </figure>
                <i className="aniCircle"></i>
              </div>
              <p className="text-center md:mt-8 mt-5 text-[24px] md:text-[30px] font-bold text-green-400 text-left">
                Kavach Activated!!
              </p>
            </div>
          </div>
        ) : (
          <div className="pr-0 md:pr-9 ">
            <div className="KavachBoxmAIN text-center">
              <div className="KavachBox m-auto relative w-[120px] h-[120px] rounded-full border border-red-400 flex items-center justify-center bg-[#FFF3F3] shadow-[0_0px_11px_#FFC8C8]">
                <figure>
                  {" "}
                  <img alt="Avatar" className=" m-auto" src={AvatarIconRed1} />
                </figure>
                <i className="aniCircle deactived"></i>
              </div>
            </div>
          </div>
        )}

        {isKavach == 1 &&!isDirectCust ?(
          <div className="col-span-8 md:pl-[10px] md:py-[50px] pl-[10px] py-[10px]">
            <div className="md:border-l-4  md:border-t-0 border-t-4 border-[#F0F0F0] md:pl-9 pl-1 pt-5  md:pt-0 mt-4 md:mt-1">
              <div className="w-full ">
                <p className="text-[22px] md:text-[27px] md:mb-7 mb-2 font-bold text-gray-800 text-left">
                  Kavach Timeline
                </p>

                <div className="">
                  <div className="flex items-center mb-2">
                    <i className="w-[35px] h-[35px] bg-[#FFF0CC] text-[#D8A128] rounded-full p-1 mr-3 flex items-center justify-center">
                      <CalendarDays className="w-[21px]" />
                    </i>
                    <p className="text-base md:text-lg">
                      Activated Date :{" "}
                      <strong> {formatOnlyDate(timeline?.created_date)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center mb-6">
                    <i className="w-[35px] h-[35px] bg-[#FFF0CC] text-[#D8A128] rounded-full p-1 mr-3 flex items-center justify-center">
                      <Calendar className="w-[21px]" />
                    </i>
                    <p className="text-base md:text-lg ">
                      Period (in Days) :{" "}
                      <strong>
                        {" "}
                        {getDaysDifference(timeline?.created_date)}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex  items-center space-x-4">
                  {currentDate > new Date(kavachExpiry) ? (
                    <Button
                      onClick={() => {
                        setSendOtpSpinner(true);
                        sendKavachOtp();
                      }}
                      size="sm"
                      className="bg-red-500 btnAnimation rounded-full  text-white font-bold text-xl py-2 px-6  hover:bg-red-600 transition border-none"
                      disabled={sendOtpSpinner}
                    >
                      Deactivate Kavach
                      {sendOtpSpinner && (
                        <LoadingIcon
                          icon="puff"
                          color="white"
                          className="w-5 h-5 ml-2 stroke-2.5 text-white"
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setReasonModal(true)}
                      size="sm"
                      className={`bg-red-500 btnAnimation  rounded-full text-white font-bold  border-none text-xl py-2 px-6  hover:bg-red-600 transition ${
                        !check ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={!check}
                    >
                      {check
                        ? "Request Deactivation"
                        : "De-activation request sent to Admin"}
                    </Button>
                  )}
                </div>

                {reasonModal && (
                  <CommonModal
                    open={reasonModal}
                    setOpen={setReasonModal}
                    title={"Kavach Deactivation"}
                    description={reasonDescription}
                    footer={reasonFooter}
                    sticky={true}
                    size="xl"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-12 md:col-span-8 md:flex block items-center">
            <div className="md:border-l-4  md:border-t-0 border-t-4 border-[#F0F0F0] md:pl-9 pl-1 pt-5  md:pt-0 mt-4 md:mt-1">
              <p className="text-[22px] md:text-[35px] md:my-7 my-2 font-bold text-red-600 text-center md:text-left">
                {" "}
                Kavach Deactivated!!
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        {isKavach == 0 && (
          <>
            <div className="pattern"></div>

            <div className="text-justify mt-4">
              <ol className=" space-y-2 deactiveArrow">
                <li>
                  This program covers you for any additional charges raised
                  under the following headings:
                  {/* <div className="grid grid-cols-2">
                    <ul className="list-inside list-none pl-5 mt-2 space-y-1">
                      <li>
                        <strong>A.</strong> Remote Area Surcharge
                      </li>
                      <li>
                        <strong>B.</strong> Address Correction
                      </li>
                      <li>
                        <strong>C.</strong> Residential Address
                      </li>
                      <li>
                        <strong>D.</strong> Elevated Risk
                      </li>
                    </ul>
                    <ul className="list-inside list-none pl-5 mt-2 space-y-1">
                      <li>
                        <strong>E.</strong> Data Entry
                      </li>
                      <li>
                        <strong>F.</strong> Multiline Entry
                      </li>
                      <li>
                        <strong>G.</strong> Non-Routine Entry
                      </li>
                      <li>
                        <strong>H.</strong> AHS Dimension/weight & packaging
                      </li>
                    </ul>
                  </div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                    <ol className="list-[upper-roman] marker:font-bold list-inside space-y-2">
                      <li>Address Correction</li>
                      <li>AHS Dimension</li>
                      <li>AHS Packaging</li>
                      <li>AHS Weight</li>
                      <li>Elevated Risk</li>
                      <li>Remote Area Delivery</li>
                      <li>Restricted Destination</li>
                      <li>Accessible Dangerous Goods</li>
                      <li>Admin Charges-Del</li>
                    </ol>
                    <ol
                      className="list-[upper-roman] marker:font-bold list-inside space-y-2"
                      start={10}
                    >
                      <li>Adult Signature</li>
                      <li>AHS</li>
                      <li>AHS Freight</li>
                      <li>AHS Non Stackable</li>
                      <li>Delivery Charges</li>
                      <li>Destroy Charges</li>
                      <li>Handling Charge</li>
                      <li>Inaccessible Dangerous Goods</li>
                      <li>Non Conveyable Piece</li>
                    </ol>
                    <ol
                      className="list-[upper-roman] marker:font-bold list-inside space-y-2"
                      start={19}
                    >
                      <li>Oversize Piece</li>
                      <li>Overweight Piece</li>
                      <li>RTS Charge</li>
                      <li>Shipment Preparation</li>
                      <li>AQIS Charges</li>
                      <li>Lost Cases Freight</li>
                      <li>Lost Cases Invoice Value Upto 10K</li>
                    </ol>
                  </div>
                </li>
                <li>
                  Once you enroll in this program, a 2% charge will be levied on
                  courier charges (Freight + Emergency/Demand + FSC).
                </li>
                <li>
                  sKart shall have the right to hold back any shipment until HUB
                  for any of the above-stated reasons and ask for an additional
                  charge.
                </li>
                <li>
                  Once you're part of the Kavach program, you're committed for
                  three months. However, after this initial period, you have the
                  flexibility to opt out, giving you complete control over your
                  participation.
                </li>
                <li>
                  The Kavach program will auto-renew after three months.
                  However, you can opt-out at any time after the first 90 days,
                  ensuring your flexibility and control.
                </li>
                <li>
                  sKart can make amendments/changes in the scheme at any point.
                </li>
              </ol>
            </div>

            <div className="mt-2">
              <FormCheck className="flex items-center">
                <FormCheck.Input
                  id="checkbox-switch-4"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mr-2"
                />
                <FormCheck.Label
                  htmlFor="checkbox-switch-4"
                  className="text-sm"
                >
                  <strong>I accept the terms and conditions</strong>
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div className="flex  mt-4">
              <Button
                // onClick={() => activateKavach(1)}
                onClick={() => {
                  if (!accepted) {
                    showAlert(
                      "Please accept the terms and conditions",
                      "warning"
                    );
                    return;
                  }
                  setSendOtpSpinner(true);
                  sendKavachOtp();
                }}
                size="sm"
                className="bg-[#efb847] hover:bg-yellow-500 text-white font-bold text-xl btnAnimation px-8"
                disabled={sendOtpSpinner}
              >
                Activate
                {sendOtpSpinner && (
                  <LoadingIcon
                    icon="puff"
                    color="white"
                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                  />
                )}
              </Button>
            </div>
          </>
        )}
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

export default index;
