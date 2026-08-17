import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

export interface Menu {
  id?: number;
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/franchisee/dashboard",
    },
    // {
    //   id: 96,
    //   icon: "ShieldCheck",
    //   title: "Activate Kavach",
    //   pathname: "/franchisee/activate_kavach"
    // },
    {
      id: 137,
      icon: "Calculator",
      title: "Rate Calculator",
      pathname: "/franchisee/rate_calculator",
    },
    // {
    //   id: 276,
    //   icon: "FileCog",
    //   title: "Chargeable Weight Settings",
    //   pathname: "/franchisee/integrator"
    // },
    {
      icon: "Settings",
      title: "Control Panel",
      subMenu: [
        {
          id: 137,
          icon: "UserCog",
          title: "My Profile",
          pathname: "/franchisee/profile",
        },
        {
          id: 137,
          icon: "ShieldCheck",
          title: "Activate Kavach",
          pathname: "/franchisee/activate_kavach",
        },
        {
          id: 137,
          icon: "FileCog",
          title: "Chargeable Weight Settings",
          pathname: "/franchisee/integrator",
        },
        {
          id: 137,
          icon: "Globe",
          pathname: "/franchisee/country",
          title: "Country List",
        },
        {
          id: 137,
          icon: "Mail",
          pathname: "/franchisee/import_email",
          title: "Import Email",
        },
      ],
    },
    {
      icon: "UserCog",
      title: "Manage Masters",
      subMenu: [
        {
          id: 39,
          icon: "UserCheck",
          pathname: "/franchisee/service_provider",
          title: "Service Providers",
        },
        {
          id: 41,
          icon: "Box",
          pathname: "/franchisee/shipment_type",
          title: "Shipment Type",
        },
      ],
    },
    {
      id: 138,
      icon: "Edit",
      title: "Book Shipment",
      pathname: "/franchisee/booking",
    },
    {
      id: 139,
      icon: "LayoutList",
      title: "Booking List",
      pathname: "/franchisee/list_booking",
    },
    {
      id: 356,
      icon: "ListStart",
      title: "R.T.O. Shipment List",
      pathname: "/franchisee/rto_shipment_list",
    },
    {
      id: 400,
      icon: "ListChecks",
      title: "Import Draft Booking",
      pathname: "/franchisee/import_draft_list"
    },
    {
      icon: "Scroll",
      title: "Accounts",
      subMenu: [
        {
          id: 95,
          icon: "FileText",
          pathname: "/franchisee/invoice_dashboard",
          title: "Invoice Dashboard",
        },
        {
          id: 42,
          icon: "Clipboard",
          pathname: "/franchisee/skart_invoices",
          title: "sKart Invoices",
        },
        {
          id: 222,
          icon: "ClipboardList",
          pathname: "/franchisee/skart_invoices",
          title: "Invoices",
        },
        {
          id: 70,
          icon: "Monitor",
          pathname: "/franchisee/logger/get_logger_data",
          title: "Logger",
        },
        {
          id: 221,
          icon: "CalendarDays",
          pathname: "/franchisee/logger/get_logger_data",
          title: "Dr/Cr Statement",
        },
        {
          id: 140,
          icon: "Wallet",
          pathname: "/franchisee/wallet_recharge_request_status_franchisee",
          title: "Wallet Recharge History",
        },
        {
          id: 482,
          icon: "FileText",
          pathname: "/franchisee/tds_recoverable",
          title: "TDS Recoverable",
        },
      ],
    },
    {
      id: 141,
      icon: "Edit",
      title: "Spot Pricing Enquiry",
      pathname: "/franchisee/spot_pricing",
    },
    {
      id: 142,
      icon: "List",
      title: "Spot Pricing List",
      pathname: "/franchisee/spotpricing_enquiry_list",
    },
    {
      icon: "Files",
      title: "Bulk Booking",
      subMenu: [
        {
          id: 215,
          icon: "ArrowRight",
          title: "Upload Bulk Booking",
          pathname: "/franchisee/upload_bulk_booking",
        },
        {
          id: 215,
          icon: "ArrowRight",
          title: "Bulk Booking List",
          pathname: "/franchisee/bulk_booking",
        },
      ],
    },
    // {
    //   icon: "Megaphone",
    //   title: "Announcements",
    //   subMenu: [
    //     {
    //       icon: "ArrowRight",
    //       pathname: "/franchisee/skart_announcement",
    //       title: "View List",
    //     }
    //   ],
    // },
    // {
    //   icon: "Users",
    //   pathname: "/franchisee/franchisee_client_master",
    //   title: "Manage Direct Party",
    // },
    {
      id: 143,
      icon: "User",
      pathname: "/franchisee/franchisee_walkin_master",
      title: "Walkin Customer",
    },
    // {
    //   icon: "Percent",
    //   pathname: "/franchisee/rate_percentage",
    //   title: "Rate Percentage",
    // },
    // {
    //   icon: "Book",
    //   pathname: "/franchisee/manifest_list",
    //   title: "Create Manifest",
    // },
    // {
    //   icon: "Truck",
    //   pathname: "/franchisee/arrange_pickup",
    //   title: "Arrange Pickup",
    // },
    {
      icon: "Scroll",
      title: "Manage Reports",
      subMenu: [
        {
          id: 44,
          icon: "ClipboardList",
          pathname: "/franchisee/reports/booking_summary",
          title: "Booking Summary",
        },
        {
          id: 45,
          icon: "ClipboardCheck",
          pathname: "/franchisee/reports/monthly_report",
          title: "Monthly Report",
        },
        {
          id: 46,
          icon: "User",
          pathname: "/franchisee/reports/customer_report",
          title: "Customer Report",
        },
      ],
    },
    {
      icon: "Airplay",
      title: "Affiliate Programme",
      subMenu: [
        {
          id: 410,
          icon: "Landmark",
          pathname: "/franchisee/affiliate/bank_details",
          title: "Bank Details",
        },
        {
          id: 411,
          icon: "ClipboardCheck",
          pathname: "/franchisee/affiliate/dashboard",
          title: "Affiliate Dashboard",
        },
        {
          id: 412,
          icon: "Book",
          pathname: "/franchisee/affiliate/statement",
          title: "Statement",
        },
        {
          id: 413,
          icon: "Wallet",
          pathname: "/franchisee/affiliate/commision",
          title: "commission",
        },
        {
          id: 414,
          icon: "User",
          pathname: "/franchisee/affiliate/customers",
          title: "Customers",
        },
      ],
    },
    {
      id: 217,
      icon: "Factory",
      pathname: "/franchisee/msme",
      title: "MSME",
    },
    {
      id: 144,
      icon: "Book",
      pathname: "/franchisee/shipper_invoice",
      title: "Shipper Invoice",
    },
    {
      id: 145,
      icon: "Truck",
      pathname: "/franchisee/tracking",
      title: "Tracking",
    },
    {
      id: 223,
      icon: "HeartHandshake",
      pathname: "/franchisee/support",
      title: "Help & Support",
    },
    {
      id: 224,
      icon: "BookOpen",
      pathname: "/franchisee/knowledgebase",
      title: "Knowledge Base",
    },
    {
      id: 418,
      icon: "Settings",
      pathname: "/franchisee/update_pickup",
      title: "Schedule Pickup (Import Booking)",
    },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;