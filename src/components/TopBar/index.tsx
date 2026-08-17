import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import BreadCrumb from "./BreadCrumb";
import { Menu, Popover } from "../../base-components/Headless";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getAnnouncements,
  getCurrencyApi,
  getFranchiseeDetailsApi,
  logoutApi,
} from "../../AllServices/config.service";
import ChangePassModal from "../../pages/Franchisee/Modals/ChangePasswordModal";
import { useAlert } from "../../ContextProvider/AlertContext";
import { useFranchisee } from "../../ContextProvider/FranchiseeContext";
import Button from "../../base-components/Button";
import AvatarIconGreen from "../../assets/images/icons/UserProfile.png";
import AvatarIconRed from "../../assets/images/icons/UserProfileRed.png";
import AvatarIconWhite from "../../assets/images/icons/UserProfileWhite.jpg";
import walletIcon from "../../assets/images/icons/wallet.png";
import {
  daysLeft,
  downloadAttachment,
  getDeviceType,
  indianFormat,
} from "../../utils";
import Modal from "../../components/Modal";
import { useLogin } from "../../ContextProvider/LoginContext";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./index.css";

function Main() {
  const deviceType = getDeviceType();
  const { logout, userdata, setPrevLocation } = useLogin();
  const { showAlert } = useAlert();
  const {
    displayName,
    franchiseeName,
    franchiseeCode,
    franchiseeId,
    isDirectCust,
    isKavach,
    gstStatus,
    kavachExpiry,
    hubId,
    branchId,
    wallet,
    availableCreditLimit,
    creditLimit,
    currencyId,
    isOverseas,
    setFranchisee,
  } = useFranchisee();
  const [currencyData, setCurrencyData] = useState([]);
  const [openModal, setOpenMOdal] = useState(false);
  const [open, setOpen] = useState(false);
  let location = useLocation();
  const navigate = useNavigate();
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const permissions =
    userdata?.role_permission?.map((item: any) => item.p_id) || [];
  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };

  const handleLogout = async () => {
    try {
      const response: any = await logoutApi();

      if (response?.data?.status == 200) {
        setPrevLocation(false)
        logout();
        showAlert(response?.data?.message, "success");
        navigate("/", { replace: true });
      } else if (response?.status == 203) {
        showAlert(response?.data.message, "error");
      } else if (response?.response.status == 204) {
        showAlert(response?.response.data.message, "error");
      } else if (response?.response.status == 203) {
        showAlert(response?.response.data.message, "error");
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response.status == 500) {
        showAlert(response.data.message, "error");
      } else if (response?.response.status == 400) {
        showAlert("Bad Request", "error");
      } else if (response?.response.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response.status == 502) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (err: any) {
      showAlert(err.message);
    }
  };

  const getData = async () => {
    try {
      const response = await getFranchiseeDetailsApi(franchiseeId);

      if (response?.data) {
        const available_credit_limit =
          response?.data?.data[0]?.available_credit_limit;
        const credit_limit = response?.data?.data[0]?.credit_limit;
        const wallet = response?.data?.data[0]?.wallet;
        const security_deposit = response?.data?.data[0]?.security_deposite;
        const live_vendor_details =
          response?.data?.data[0]?.live_vendor_details;
        const isDirectCust = response?.data?.data[0]?.is_direct_customer;
        const gstStatus = response?.data?.data[0]?.gst_status;

        const is_kavach = response?.data?.data[0]?.is_kawach;
        const kavach_expiry = response?.data?.data[0]?.kawach_expiry;
        const is_test = response?.data?.data[0]?.is_test;
        const is_overseas = response?.data?.data[0]?.is_overseas;
        const currency_id = response?.data?.data[0]?.currency;
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
          is_overseas,
          currency_id,
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
      // console.log(error);
      if (error) showAlert("something went wrong", "error");
    }
  };

  const getAnnouncementData = async () => {
    try {
      const response = await getAnnouncements();
      if (response?.data) {
        const activeAnnouncements = response?.data?.data?.filter(
          (elem) => elem?.is_active == 1
        );
        if (activeAnnouncements?.length > 0) {
          setAnnouncements(response?.data?.data);
        } else {
          setAnnouncements([]);
        }
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("something went wrong", "error");
    }
  };

  useEffect(() => { }, [location.pathname]);

  const description = (
    <div dangerouslySetInnerHTML={{ __html: messageBody }}></div>
  );

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
    getAnnouncementData();
  }, []);

  //Tutorial

  const driverObj = driver({
    popoverClass: "driverjs-theme",
    steps: [
      {
        element: "#step1",
        popover: {
          title: "Welcome",
          description: `Welcome ${displayName || "User"
            } to the sKart Booking Portal`,
          side: "right",
          align: "start",
        },
      },
      ...(permissions?.includes(137)
        ? [
          {
            element: "#id137",
            popover: {
              title: "Rate Calculator",
              description: "Click here to calculate your shipment rate.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(138)
        ? [
          {
            element: "#id138",
            popover: {
              title: "Book Shipment",
              description: "Click here to book your shipment.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(139)
        ? [
          {
            element: "#id139",
            popover: {
              title: "Booking List",
              description: "Click here to check your booking history.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(221) || permissions?.includes(222)
        ? [
          {
            element: "#accounts",
            popover: {
              title: "Accounts",
              description: "Click here for accounts related menu.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(141) && gstStatus == "2"
        ? [
          {
            element: "#id141",
            popover: {
              title: "Spot Pricing Enquiry",
              description: "Click here to raise Spot Pricing Enquiry.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(142) && gstStatus == "2"
        ? [
          {
            element: "#id142",
            popover: {
              title: "Spot Pricing Enquiry",
              description: "Click here to raise Spot Pricing Enquiry.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(144)
        ? [
          {
            element: "#id144",
            popover: {
              title: "Shipper Invoice",
              description: "Click here to Generate Shipper Invoice.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(145)
        ? [
          {
            element: "#id145",
            popover: {
              title: "Tracking",
              description: "Click here to Track shipment using AWB.",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(223)
        ? [
          {
            element: "#id223",
            popover: {
              title: "Help & Support",
              description: "Click here for Help & Support",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      ...(permissions?.includes(223)
        ? [
          {
            element: "#id224",
            popover: {
              title: "Knowledge Base",
              description: "Click here for Knowledge Base",
              side: "right",
              align: "start",
            },
          },
        ]
        : []),
      {
        element: "#wallet",
        popover: {
          title: "Wallet Recharge",
          description: "Click here to recharge your wallet.",
          side: "right",
          align: "start",
        },
      },
    ],

    onDestroyStarted: () => {
      localStorage.setItem("tour", "true");
      driverObj.destroy();
    },
  });

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("tour");
    if (!hasSeenTour && isDirectCust && deviceType != "Mobile") {
      driverObj.drive();
    }
  }, []);

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="h-[67px] z-[5] flex justify-end items-center relative border-b border-slate-200">
        {/* BEGIN: Breadcrumb */}
        <BreadCrumb />
        {/* END: Breadcrumb */}
        {/* BEGIN: Search */}
        {/* <div className="relative mr-3 intro-x sm:mr-6">
          <div className="relative hidden sm:block">
            <FormInput
              type="text"
              className="border-transparent w-56 shadow-none rounded-full bg-slate-300/50 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
              placeholder="Search..."
              onFocus={showSearchDropdown}
              onBlur={hideSearchDropdown}
            />
            <Lucide
              icon="Search"
              className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
            />
          </div>
          <a className="relative text-slate-600 sm:hidden" href="">
            <Lucide icon="Search" className="w-5 h-5 dark:text-slate-500" />
          </a>
          <Transition
            as={Fragment}
            show={searchDropdown}
            enter="transition-all ease-linear duration-150"
            enterFrom="mt-5 invisible opacity-0 translate-y-1"
            enterTo="mt-[3px] visible opacity-100 translate-y-0"
            leave="transition-all ease-linear duration-150"
            leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
            leaveTo="mt-5 invisible opacity-0 translate-y-1"
          >
            <div className="absolute right-0 z-10 mt-[3px]">
              <div className="w-[450px] p-5 box">
                <div className="mb-2 font-medium">Pages</div>
                <div className="mb-5">
                  <a href="" className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success">
                      <Lucide icon="Inbox" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Mail Settings</div>
                  </a>
                  <a href="" className="flex items-center mt-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pending/10 text-pending">
                      <Lucide icon="Users" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Users & Permissions</div>
                  </a>
                  <a href="" className="flex items-center mt-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary/80">
                      <Lucide icon="CreditCard" className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Transactions Report</div>
                  </a>
                </div>
                <div className="mb-2 font-medium">Users</div>
                <div className="mb-5">
                  {_.take(fakerData, 4).map((faker, fakerKey) => (
                    <a
                      key={fakerKey}
                      href=""
                      className="flex items-center mt-2"
                    >
                      <div className="w-8 h-8 image-fit">
                        <img
                          alt="Midone Tailwind HTML Admin Template"
                          className="rounded-full"
                          src={faker.photos[0]}
                        />
                      </div>
                      <div className="ml-3">{faker.users[0].name}</div>
                      <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                        {faker.users[0].email}
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mb-2 font-medium">Products</div>
                {_.take(fakerData, 4).map((faker, fakerKey) => (
                  <a key={fakerKey} href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                      <img
                        alt="Midone Tailwind HTML Admin Template"
                        className="rounded-full"
                        src={faker.images[0]}
                      />
                    </div>
                    <div className="ml-3">{faker.products[0].name}</div>
                    <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                      {faker.products[0].category}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Transition>
        </div> */}
        {/* END: Search  */}

        <p className="mx-4 text-base font-bold text-warning uppercase">
          Welcome, {franchiseeName}
        </p>
        {/* BEGIN: Notifications */}
        {/* RED DOT CSS
            "before:content-[''] before:w-[8px] before:h-[8px]
            before:rounded-full before:absolute before:top-[-2px] before:right-0
            before:bg-danger" */}

        {/* <Popover className="mr-auto intro-x sm:mr-6 drop-shadow-md">
          <Popover.Button
            className="
              relative text-slate-600 outline-none block
            "
          >
            <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
          </Popover.Button>
          <Popover.Panel className="w-[280px] sm:w-[350px] mt-2 p-0 py-1 ">
            <div className="mx-4 my-2 flex justify-between items-end">
              <p className="font-medium text-lg">Notifications</p>
              <Button
                size="sm"
                className="bg-red-500 text-white flex items-center"
              >
                <Lucide icon="Trash" className="w-3 h-3 stroke-2.5" />
                <p className="ml-1">CLEAR</p>
              </Button>
            </div>

            <hr className="border-2 drop-shadow-2xl" />

            <div className="py-1 mx-2 max-h-64 overflow-y-scroll drop-shadow-2xl">
              <div className="flex gap-2 my-1 items-center">
                <div className="rounded-full p-1 w-auto bg-green-500">
                  <Lucide
                    icon="BellRing"
                    className="text-white w-5 h-5 stroke-2.5"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adising lit. Vero,
                    ducimus?
                  </p>
                  <p className="text-gray-400">17 May 2024 03:00 PM</p>
                </div>
              </div>
              <div className="flex gap-2 my-1  items-center">
                <div className="rounded-full p-1 w-auto bg-green-500">
                  <Lucide
                    icon="BellRing"
                    className="text-white w-5 h-5 stroke-2.5"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adising lit. Vero,
                    ducimus?
                  </p>
                  <p className="text-gray-400">17 May 2024 03:00 PM</p>
                </div>
              </div>
              <div className="flex gap-2 my-1  items-center">
                <div className="rounded-full p-1 w-auto bg-green-500">
                  <Lucide
                    icon="BellRing"
                    className="text-white w-5 h-5 stroke-2.5"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adising lit. Vero,
                    ducimus?
                  </p>
                  <p className="text-gray-400">17 May 2024 03:00 PM</p>
                </div>
              </div>
              <div className="flex gap-2 my-1  items-center">
                <div className="rounded-full p-1 w-auto bg-green-500">
                  <Lucide
                    icon="BellRing"
                    className="text-white w-5 h-5 stroke-2.5"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adising lit. Vero,
                    ducimus?
                  </p>
                  <p className="text-gray-400">17 May 2024 03:00 PM</p>
                </div>
              </div>
              <div className="flex gap-2 my-1  items-center">
                <div className="rounded-full p-1 w-auto bg-green-500">
                  <Lucide
                    icon="BellRing"
                    className="text-white w-5 h-5 stroke-2.5"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adising lit. Vero,
                    ducimus?
                  </p>
                  <p className="text-gray-400">17 May 2024 03:00 PM</p>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Popover> */}
        {/* END: Notifications  */}
        {/* BEGIN: Announcements */}
        <Popover className="intro-x  mr-4 sm:mr-6 drop-shadow-md">
          <Popover.Button
            className="
              relative text-slate-600 outline-none block shadow-lg rounded-full w-7 h-7 bg-white p-1"
          >
            <Lucide
              icon="Megaphone"
              className="w-5 h-5 dark:text-slate-500 stroke-2.5"
              onClick={() => getAnnouncementData()}
            />
          </Popover.Button>
          <Popover.Panel className="w-[280px] sm:w-[280px] mt-2 p-0 py-1 ">
            <div className="mx-4 my-2 flex justify-between items-end">
              <p className="font-medium text-lg">Announcements</p>
              {/* {announcements && announcements.length > 0 && (
                <Button
                  size="sm"
                  className="bg-red-500 text-white flex items-center"
                >
                  <Lucide icon="Trash" className="w-3 h-3 stroke-2.5" />
                  <p className="ml-1">CLEAR</p>
                </Button>
              )} */}
            </div>

            <hr className="border-2 drop-shadow-2xl" />

            <div
              className={`py-1 mx-2 max-h-64 ${announcements.length > 4 ? "overflow-y-scroll" : ""
                } drop-shadow-2xl`}
            >
              {announcements && announcements.length > 0 ? (
                announcements?.map(
                  (elem, index) =>
                    elem?.is_active == 1 && (
                      <div
                        key={index}
                        className="flex gap-2 my-1 items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.isPropagationStopped();
                          setMessageBody(elem?.message_body);
                          setOpen(true);
                        }}
                      >
                        <div className="rounded-full p-1 bg-mustard ">
                          <Lucide
                            icon="Mail"
                            className="text-white w-5 h-5 stroke-2.5"
                          />
                        </div>
                        <div className="max-w-[65%]">
                          <b className="text-gray-600 w-full font-medium capitalize whitespace-nowrap overflow-hidden overflow-ellipsis block">
                            {elem?.announcement_name}
                          </b>
                          <p className="text-gray-500">{elem?.from_date}</p>
                        </div>
                        {elem?.file && (
                          <div className="ml-auto mr-2">
                            <Lucide
                              icon="Paperclip"
                              className="w-5 h-5 text-blue-500 stroke-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.isPropagationStopped();
                                downloadAttachment(elem?.file, "Announcements");
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                )
              ) : (
                <p className="text-center text-gray-500">No Announcements</p>
              )}
            </div>
          </Popover.Panel>
        </Popover>
        {/* END: Announcements  */}

        {/* BEGIN: Tour */}
        {deviceType != "Mobile" && isDirectCust == 1 && (
          <Popover className="intro-x  mr-4 sm:mr-6 drop-shadow-md">
            <Popover.Button
              className="
              relative text-slate-600 outline-none block shadow-lg rounded-full w-7 h-7 bg-white p-1"
            >
              <Lucide
                icon="Play"
                className="w-4 h-5 ml-1 dark:text-slate-500 stroke-2.5"
                onClick={() => {
                  driverObj.drive();
                }}
              />
            </Popover.Button>
          </Popover>
        )}
        {/* END: Tour  */}

        {/* BEGIN: Account Menu */}
        <Menu className="drop-shadow-md" id="wallet">
          <Menu.Button
            className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x"
            onClick={getData}
          >
            <img
              alt="Avatar"
              src={isKavach == 1 ? AvatarIconGreen : AvatarIconRed}
            />
          </Menu.Button>
          <Menu.Items className="w-64 text-black bg-white mt-1 z-50">
            <Menu.Header className="font-normal">
              <div className="font-bold text-lg uppercase">{displayName}</div>
              {/* <div className="text-sm text-slate-700 dark:text-slate-500">
                Franchisee id : {franchiseeId}
              </div> */}
            </Menu.Header>
            <Menu.Divider className="bg-slate-200" />
            <Menu.Item className="hover:bg-white/5 p-0">
              <Link to="/franchisee/profile">
                <div className="flex items-center">
                  <Lucide icon="UserCog" className="w-4 h-4 mr-2 stroke-2" />
                  <p className="font-medium text-base">My Profile </p>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Divider className="bg-slate-200" />
            <Menu.Item className="hover:bg-white/5  p-0">
              <div className="flex items-center">
                <Lucide icon="Wallet" className="w-4 h-4 mr-2 stroke-2" />

                <p className="font-medium text-base">Available Credit </p>
              </div>
              <div className="flex items-center justify-between ">
                <p className="ml-6  text-slate-700">
                  {isOverseas && currencyId
                    ? `${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      }`
                    : "₹"}{" "}
                  {indianFormat(availableCreditLimit)}
                </p>
                <Link to="/franchisee/franchisee_wallet_recharge">
                  <Button rounded size="sm" className="bg-mustard text-white">
                    {" "}
                    <img src={walletIcon} className="w-3 h-3 mr-2" />
                    Recharge{" "}
                  </Button>
                </Link>
              </div>
            </Menu.Item>

            <Menu.Divider className="bg-slate-200" />

            <Menu.Item className="hover:bg-white/5 p-0">
              <div className="flex items-center">
                <Lucide icon="Landmark" className="w-4 h-4 mr-2 stroke-2" />
                <p className="font-medium text-base">Credit Limit </p>
              </div>
              <p className="ml-6 text-slate-700">
                {isOverseas && currencyId
                  ? `${
                      (
                        currencyData?.find((item) => item?.id == currencyId) ??
                        currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                    }`
                  : "₹"}{" "}
                {indianFormat(wallet)}
              </p>
            </Menu.Item>
            {/* <Menu.Divider className="bg-slate-200" /> */}

            {/* <Menu.Item className="hover:bg-white/5 p-0 ">
              <div className="flex items-center">
                <Lucide icon="IndianRupee" className="w-4 h-4 mr-2 stroke-2" />
                <p className="font-medium text-base">Security Deposit </p>
              </div>
              <p className="ml-6  text-slate-700">
                {securityDeposit?.toFixed(2)}
              </p>
            </Menu.Item> */}
            <Menu.Divider className="bg-slate-200" />

            {!isDirectCust && (
              <>
                <Menu.Item
                  className="hover:bg-white/5 p-0"
                  onClick={() => setOpenMOdal(true)}
                >
                  <div className="flex items-center">
                    <Lucide icon="Repeat" className="w-4 h-4 mr-2 stroke-2" />
                    <p className="font-medium text-base">Change Password </p>
                  </div>
                </Menu.Item>

                <Menu.Divider className="bg-slate-200" />
              </>
            )}
            <Menu.Item
              className="hover:bg-white/5 flex font-medium"
              onClick={handleLogout}
            >
              <Lucide
                icon="Power"
                className="w-4 h-4 mr-2 text-red-500  stroke-2.5"
                onClick={handleLogout}
              />{" "}
              Logout
            </Menu.Item>
          </Menu.Items>
        </Menu>

        {openModal && (
          <ChangePassModal
            open={openModal}
            onClose={() => setOpenMOdal(false)}
          />
        )}

        <Modal
          open={open}
          setOpen={setOpen}
          title="Announcement"
          size="md"
          description={description}
          staticBackdrop={false}
        />
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
