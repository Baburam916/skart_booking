import { useEffect, useState, lazy } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
} from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import { useFranchisee } from "../ContextProvider/FranchiseeContext";
import {
  getFranchiseeDetailsApi,
  verifyUser,
} from "../AllServices/config.service";
import Loadable from "../pages/Franchisee/Loadable";
import axios from "axios";
import LoadingIcon from "../base-components/LoadingIcon";
import { useLogin } from "../ContextProvider/LoginContext";
import AffiliateBank from "../pages/Franchisee/Affiliate/BankDetails/BankDetails";
import AffiliateStatement from "../pages/Franchisee/Affiliate/Statement/statement";
import AffiliateCommissions from "../pages/Franchisee/Affiliate/commision";
import AFfiliateDashboard from "../pages/Franchisee/Affiliate/AffiliateDashboard";
import AffiliateCustomers from "../pages/Franchisee/Affiliate/affiliatecustomers";
import ApiLoadingPage from "../pages/Franchisee/Affiliate/AffiliateLoading";
import AffiliateLoadingPage from "../pages/Franchisee/Affiliate/AffiliateLoading";
import RegisterSuccessPage from "../pages/Register/RegisterSuccessPage";
import BookingApproval from "../pages/BookingApproval";
import UpdatePickup from "../pages/Franchisee/importPickup/importPickup";
import FranchiseeTDSReceivable from "../pages/Franchisee/FranchiseeTDSReceivable";

const Login = Loadable(lazy(() => import("../pages/Login")));
const Register = Loadable(lazy(() => import("../pages/Register")));
const ErrorPage = Loadable(lazy(() => import("../pages/ErrorPage")));
const Dashboard = Loadable(lazy(() => import("../pages/Franchisee/Dashboard")));
const ActivateKavach = Loadable(
  lazy(() => import("../pages/Franchisee/ActivateKavach/index"))
);
const RateCalculator = Loadable(
  lazy(() => import("../pages/Franchisee/RateCalculator"))
);
const CalculatorGetRates = Loadable(
  lazy(() => import("../pages/Franchisee/CalculatorGetRates"))
);
const ServiceProviders = Loadable(
  lazy(() => import("../pages/Franchisee/ServiceProviders"))
);

const ShipmentType = Loadable(
  lazy(() => import("../pages/Franchisee/ShipmentType"))
);
const SpotPriceList = Loadable(
  lazy(() => import("../pages/Franchisee/SpotPriceList"))
);
const SpotPriceEnquiry2 = Loadable(
  lazy(() => import("../pages/Franchisee/SpotPriceEnquiry2"))
);
const SpotPriceEnquiry1 = Loadable(
  lazy(() => import("../pages/Franchisee/SpotPriceEnquiry1"))
);
const WalletRechargeHistory = Loadable(
  lazy(() => import("../pages/Franchisee/WalletRechargeHistory"))
);
const ShipperInvoice = Loadable(
  lazy(() => import("../pages/Franchisee/ShipperInvoice"))
);

const BulkBooking = Loadable(
  lazy(() => import("../pages/Franchisee/BulkBookingUploadedList"))
);

const AnnouncementViewList = Loadable(
  lazy(() => import("../pages/Franchisee/AnnouncementViewList"))
);
const AccountsLogger = Loadable(
  lazy(() => import("../pages/Franchisee/AccountsLogger"))
);
const WalkinCustomer = Loadable(
  lazy(() => import("../pages/Franchisee/WalkinCustomer"))
);
const ScannedManifest = Loadable(
  lazy(() => import("../pages/Franchisee/ScannedManifest"))
);
const ManageDirectParty = Loadable(
  lazy(() => import("../pages/Franchisee/ManageDirectParty"))
);
const BookShipment1 = Loadable(
  lazy(() => import("../pages/Franchisee/BookShipment1"))
);
const BookShipment2 = Loadable(
  lazy(() => import("../pages/Franchisee/BookShipment2"))
);
const BookingList = Loadable(
  lazy(() => import("../pages/Franchisee/BookingList"))
);
const SkartInvoices = Loadable(
  lazy(() => import("../pages/Franchisee/SkartInvoices"))
);
const InvoiceDashboard = Loadable(
  lazy(() => import("../pages/Franchisee/InvoiceDashboard"))
);
const WalletRecharge = Loadable(
  lazy(() => import("../pages/Franchisee/WalletRecharge"))
);
const ManageBookingSummary = Loadable(
  lazy(() => import("../pages/Franchisee/ManageBookingSummary"))
);
const ManageMonthlyReport = Loadable(
  lazy(() => import("../pages/Franchisee/ManageMonthlyReports"))
);
const ManageCustomerReport = Loadable(
  lazy(() => import("../pages/Franchisee/ManageCustomerReports"))
);
const ArrangePickup = Loadable(
  lazy(() => import("../pages/Franchisee/ArrangePickup"))
);
const ManifestList = Loadable(
  lazy(() => import("../pages/Franchisee/ManifestList"))
);
const RatePercentage = Loadable(
  lazy(() => import("../pages/Franchisee/RatePercentage"))
);
const Tracking = Loadable(
  lazy(() => import("../pages/Franchisee/Tracking/index"))
);

const CustomerLogin = Loadable(
  lazy(() => import("../pages/Franchisee/CustomerLogin"))
);


const MsmeRegistration = Loadable(
  lazy(() => import("../pages/Franchisee/Msme/index"))
);

const Support = Loadable(
  lazy(() => import("../pages/Franchisee/Support/index"))
);

const KnowledgeBase = Loadable(
  lazy(() => import("../pages/Franchisee/KnowledgeBase/index"))
);

const SkartIntegrator = Loadable(
  lazy(() => import("../pages/Franchisee/SkartIntegrator/index"))
);

const MyProfile = Loadable(
  lazy(() => import("../pages/Franchisee/Profile/index"))
);

const RtoShipmentList = Loadable(
  lazy(() => import("../pages/Franchisee/RtoList"))
);

const ImportBookingList = Loadable(
  lazy(() => import("../pages/Franchisee/ImportBookingList/index"))
);

const RefundRequest = Loadable(
  lazy(() => import("../pages/RefundRequest/index"))
);

const CountryList = Loadable(
  lazy(() => import("../pages/Franchisee/CountryList/index"))
);

const ImportEmail = Loadable(
  lazy(() => import("../pages/Franchisee/ImportEmail/index"))
);

const franchiseeTDSReceivable = Loadable(
  lazy(() => import("../pages/Franchisee/FranchiseeTDSReceivable/index"))
);

axios.defaults.withCredentials = true;

function Router() {
  const [loading, setLoading] = useState<boolean>(true);
  const [verify, setVerify] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setFranchisee, isDirectCust, isOverseas } = useFranchisee();
  const { login, logout, permissionId, setPrevLocation } = useLogin();
  const { code } = useParams();
  useEffect(() => {
    if (location.pathname != "/") {
      setPrevLocation(location?.pathname);
    }
  }, []);

  async function checkAuth() {
    try {
      const check = await verifyUser();
      login(check?.data?.data);
      // console.log(check);
      const franchisee_id = check?.data?.data?.mapped_id;
      const display_name = check?.data?.data?.display_name;

      if (franchisee_id >= 0 || franchisee_id) {
        const details = await getFranchiseeDetailsApi(franchisee_id);
        const franchisee_name = details?.data?.data[0]?.franchisee_name;
        const franchisee_code = details?.data?.data[0]?.ba_code;
        const branch_id = details?.data?.data[0]?.branch;
        const hub_id = details?.data?.data[0]?.hub;
        const available_credit_limit =
          details?.data?.data[0]?.available_credit_limit;
        const credit_limit = details?.data?.data[0]?.credit_limit;
        const wallet = details?.data?.data[0]?.wallet;
        const security_deposit = details?.data?.data[0]?.security_deposite;
        const live_vendor_details = details?.data?.data[0]?.live_vendor_details;
        const is_kavach = details?.data?.data[0]?.is_kawach;
        const kavach_expiry = details?.data?.data[0]?.kawach_expiry;
        const isDirectCust = details?.data?.data[0]?.is_direct_customer;
        const gstStatus = details?.data?.data[0]?.gst_status;
        const isTest = details?.data?.data[0]?.is_test;
        const isOverseas = details?.data?.data[0]?.is_overseas;
        const currencyId = details?.data?.data[0]?.currency;
        const bulk_booking = details?.data?.data[0]?.bulk_booking;

        setFranchisee(
          display_name,
          franchisee_name,
          franchisee_code,
          franchisee_id,
          isDirectCust,
          gstStatus,
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
          isTest,
        );
      }

      if (check.status !== 200) {
        logout();
        if (
          location.pathname == "/register" ||
          location.pathname == "/customer-login" ||
          location.pathname.includes("/approval/") ||
          location.pathname.includes("/refund-request/")
        ) {
          navigate(location.pathname);
        } else if (check.status == 401) {
          navigate(isDirectCust ? "/customer-login" : "/");
        }
      } else {
        setVerify(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const createRoute = (path: any, element: any, requiredPermission?: any) => {
    if (!requiredPermission || permissionId?.includes(requiredPermission)) {
      return { path, element };
    }
    return null;
  };

  useEffect(() => {
    if (
      location.pathname.startsWith("/affiliate") ||
      location.pathname == "/success"
    ) {
      setLoading(false); // very important
      setVerify(true); // so routes can load
      return;
    }

    checkAuth();
  }, [location.pathname]);

  const routes = (verify: boolean) => [
    {
      path: "/franchisee",
      element: <SideMenu />,
      children: [
        createRoute("/franchisee/dashboard", <Dashboard />),
        createRoute("/franchisee/profile", <MyProfile />),
        ...(!isOverseas
          ? [createRoute("/franchisee/activate_kavach", <ActivateKavach />)]
          : []),
        createRoute("/franchisee/country", <CountryList />),
        createRoute("/franchisee/import_email", <ImportEmail />),
        createRoute("/franchisee/rate_calculator", <RateCalculator />, 137),
        createRoute(
          "/franchisee/rate_calculator/get_rates_v1",
          <CalculatorGetRates />,
          137
        ),
        createRoute("/franchisee/booking", <BookShipment1 />, 138),
        createRoute(
          "/franchisee/booking/book_courier_franchisee",
          <BookShipment2 />,
          138
        ),
        createRoute("/franchisee/list_booking", <BookingList />, 139),
        createRoute(
          "/franchisee/import_draft_list",
          <ImportBookingList />,
          400
        ),
        createRoute(
          "/franchisee/list_booking/booking_charges",
          <BookShipment2 />,
          139
        ),
        createRoute("/franchisee/rto_shipment_list", <RtoShipmentList />, 356),
        createRoute("/franchisee/spot_pricing", <SpotPriceEnquiry1 />, 141),
        createRoute(
          "/franchisee/spot_pricing/book_courier_franchisee",
          <SpotPriceEnquiry2 />,
          141
        ),
        createRoute(
          "/franchisee/spotpricing_enquiry_list",
          <SpotPriceList />,
          142
        ),
        createRoute("/franchisee/service_provider", <ServiceProviders />, 39),
        createRoute("/franchisee/shipment_type", <ShipmentType />, 41),
        createRoute(
          "/franchisee/franchisee_client_master",
          <ManageDirectParty />
        ),
        createRoute("/franchisee/bulk_booking", <BulkBooking />, 215),
        createRoute("/franchisee/upload_bulk_booking", <BulkBooking />, 215),
        createRoute(
          "/franchisee/reports/booking_summary",
          <ManageBookingSummary />,
          44
        ),
        createRoute(
          "/franchisee/reports/monthly_report",
          <ManageMonthlyReport />,
          45
        ),
        createRoute(
          "/franchisee/reports/customer_report",
          <ManageCustomerReport />,
          46
        ),
        createRoute("/franchisee/invoice_dashboard", <InvoiceDashboard />, 95),
        createRoute("/franchisee/skart_invoices", <SkartInvoices />, 42),
        createRoute("/franchisee/skart_invoices", <SkartInvoices />, 222),
        createRoute(
          "/franchisee/logger/get_logger_data",
          <AccountsLogger />,
          70
        ),
        createRoute(
          "/franchisee/logger/get_logger_data",
          <AccountsLogger />,
          221
        ),
        createRoute(
          "/franchisee/franchisee_walkin_master",
          <WalkinCustomer />,
          143
        ),
        createRoute("/franchisee/shipper_invoice", <ShipperInvoice />, 144),
        createRoute("/franchisee/tracking", <Tracking />, 145),
        createRoute(
          "/franchisee/franchisee_wallet_recharge",
          <WalletRecharge />
        ),
        createRoute(
          "/franchisee/wallet_recharge_request_status_franchisee",
          <WalletRechargeHistory />,
          140
        ),
        createRoute("/franchisee/msme", <MsmeRegistration />, 217),
        createRoute("/franchisee/support", <Support />, 223),
        createRoute("/franchisee/knowledgebase", <KnowledgeBase />, 224),
        createRoute("/franchisee/integrator", <SkartIntegrator />),
        createRoute(
          "/franchisee/affiliate/bank_details",
          <AffiliateBank />,
          410
        ),
        createRoute(
          "/franchisee/affiliate/statement",
          <AffiliateStatement />,
          412
        ),
        createRoute(
          "/franchisee/affiliate/commision",
          <AffiliateCommissions />,
          413
        ),
        createRoute(
          "/franchisee/affiliate/dashboard",
          <AFfiliateDashboard />,
          411
        ),
        createRoute(
          "/franchisee/affiliate/customers",
          <AffiliateCustomers />,
          414
        ),
        createRoute("/franchisee/update_pickup",<UpdatePickup/>,418),
        createRoute("/franchisee/tds_recoverable", <FranchiseeTDSReceivable />, 482),
      ]?.filter(Boolean),
    },
    createRoute("/", <Login />),
    createRoute("/register", <Register />),
    createRoute("/customer-login", <CustomerLogin />),
    createRoute("/approval/:awb", <BookingApproval />),
    createRoute("/affiliate/:id", <AffiliateLoadingPage />),
    createRoute("/refund-request/:unique_id", <RefundRequest />),
    createRoute("*", <ErrorPage />),
    createRoute("/success", <RegisterSuccessPage />),
  ];

  return loading ? (
    <div className="flex items-center justify-center h-[100vh]">
      <LoadingIcon icon="grid" className="block w-[6%] " />
    </div>
  ) : (
    useRoutes(routes(verify))
  );
}

export default Router;
