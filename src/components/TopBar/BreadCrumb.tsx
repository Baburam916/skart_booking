import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../base-components/Breadcrumb";
export default function BreadCrumb() {
  const location = useLocation();
  return (
    <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
      <Breadcrumb.Link to="/franchisee/dashboard">Application</Breadcrumb.Link>
      <Breadcrumb.Link
        to={
          location.pathname.includes("/franchisee/booking")
            ? "/franchisee/booking"
            : location.pathname
        }
      >
        {location.pathname == "/franchisee/dashboard"
          ? "Dashboard"
          : location.pathname.includes("/franchisee/booking")
          ? "Book Shipment"
          : location.pathname == "/franchisee/list_booking"
          ? "Booking List"
          : location.pathname == "/franchisee/list_booking/booking_charges"
          ? "Booking Charges"
          : location.pathname == "/franchisee/logger/get_logger_data"
          ? "Logger"
          : location.pathname == "/franchisee/franchisee_wallet_recharge"
          ? "Wallet Recharge"
          : location.pathname ==
            "/franchisee/wallet_recharge_request_status_franchisee"
          ? "Wallet Recharge History"
          : location.pathname.includes("/franchisee/spot_pricing")
          ? "Spot Pricing Enquiry"
          : location.pathname == "/franchisee/spotpricing_enquiry_list"
          ? "Spot Pricing Enquiry List"
          : location.pathname == "/franchisee/franchisee_walkin_master"
          ? "Walkin Customer"
          : location.pathname.includes("/franchisee/reports/")
          ? location.pathname
              ?.replaceAll("/franchisee/reports/", "")
              ?.replaceAll("_", " ")
          : location.pathname.includes("/franchisee/")
          ? location.pathname
              ?.replaceAll("/franchisee/", "")
              ?.replaceAll("_", " ")
          : location.pathname.includes("/franchisee/affiliate/")
          ? location.pathname
              ?.replaceAll("/franchisee/affiliate/", "")
              ?.replaceAll("_", " ")
          : ""}
      </Breadcrumb.Link>
    </Breadcrumb>
  );
}
