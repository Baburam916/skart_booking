import React, { createContext, useContext, useState } from "react";

interface FranchiseeContextType {
  displayName: string | "";
  franchiseeName: string | "";
  franchiseeCode: string | "";
  franchiseeId: number | null;
  isDirectCust: number | 0;
  gstStatus: number | 2;
  isKavach: number | 0;
  kavachExpiry: string | "";
  hubId: number | null;
  branchId: number | null;
  availableCreditLimit: number | null;
  creditLimit: number | null;
  wallet: number | null;
  securityDeposit: number | null;
  liveVendorDetails: string | "";
  isOverseas: number | 0;
  currencyId: number | 24;
  bulkBooking: number | 0;
  isTest: number | 0;
  setFranchisee: (
    display_name: string,
    franchisee_name: string,
    franchisee_code: string,
    franchisee_id: number,
    is_direct_cust: number,
    gst_status: number,
    is_kavach: number,
    kavach_expiry: string,
    hub_id: number,
    branch_id: number,
    available_credit_limit: number,
    credit_limit: number,
    wallet: number,
    security_deposit: number,
    live_vendor_details: string,
    is_overseas: number,
    currency_id: number,
    bulk_booking: number,
    is_test: number
  ) => void;
}

const FranchiseeContext = createContext<FranchiseeContextType>({
  displayName: "",
  franchiseeName: "",
  franchiseeCode: "",
  franchiseeId: null,
  isDirectCust: 0,
  gstStatus: 2,
  isKavach: 0,
  kavachExpiry: "",
  hubId: null,
  branchId: null,
  availableCreditLimit: null,
  creditLimit: null,
  wallet: null,
  securityDeposit: null,
  liveVendorDetails: "",
  isOverseas: 0,
  currencyId: 24,
  bulkBooking: 0,
  isTest: 0,
  setFranchisee: () => { },
});

export const FranchiseeProvider: React.FC = ({ children }) => {
  const [franchiseeId, setFranchiseeId] = useState<number | null>(null);
  const [hubId, setHubId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [availableCreditLimit, setAvailableCreditLimit] = useState<
    number | null
  >(null);
  const [franchiseeName, setFranchiseeName] = useState<string>("");
  const [franchiseeCode, setFranchiseeCode] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [creditLimit, setCreditLimit] = useState<number | null>(null);
  const [securityDeposit, setSecurityDeposit] = useState<number | null>(null);
  const [liveVendorDetails, setLiveVendorDetails] = useState<string>("");
  const [isDirectCust, setIsDirectCust] = useState<number>(0);
  const [gstStatus, setGstStatus] = useState<number>(0);
  const [isKavach, setIsKavach] = useState<number | 0>(0);
  const [kavachExpiry, setKavachExpiry] = useState<string>("");
  const [wallet, setWallet] = useState<number | null>(null);
  const [isOverseas, setIsOverseas] = useState<number>(0);
  const [currencyId, setCurrencyId] = useState<number>(24);
  const [bulkBooking, setBulkBooking] = useState<number>(0);
  const [isTest, setIsTest] = useState<number>(0);

  const setFranchisee = (
    display_name: string = "",
    franchisee_name: string = "",
    franchisee_code: string = "",
    franchisee_id: number = 0,
    is_direct_cust: number = 0,
    gst_status: number = 0,
    is_kavach: number = 0,
    kavach_expiry: string = "",
    hub_id: number = 0,
    branch_id: number = 0,
    available_credit_limit: number = 0,
    credit_limit: number = 0,
    wallet: number = 0,
    security_deposit: number = 0,
    live_vendor_details: string = "",
    is_overseas: number = 0,
    currency_id: number = 24,
    bulk_booking: number = 0,
    is_test: number = 0
  ) => {
    setDisplayName(display_name);
    setFranchiseeName(franchisee_name);
    setFranchiseeCode(franchisee_code);
    setFranchiseeId(franchisee_id);
    setIsDirectCust(is_direct_cust);
    setGstStatus(gst_status);
    setIsKavach(is_kavach);
    setKavachExpiry(kavach_expiry);
    setHubId(hub_id);
    setBranchId(branch_id);
    setAvailableCreditLimit(available_credit_limit);
    setCreditLimit(credit_limit);
    setWallet(wallet);
    setSecurityDeposit(security_deposit);
    setLiveVendorDetails(live_vendor_details);
    setIsOverseas(is_overseas);
    setCurrencyId(currency_id);
    setBulkBooking(bulk_booking);
    setIsTest(is_test);
  };

  return (
    <FranchiseeContext.Provider
      value={{
        displayName,
        franchiseeName,
        franchiseeCode,
        franchiseeId,
        isDirectCust,
        gstStatus,
        isKavach,
        kavachExpiry,
        hubId,
        branchId,
        availableCreditLimit,
        creditLimit,
        wallet,
        securityDeposit,
        liveVendorDetails,
        isOverseas,
        currencyId,
        bulkBooking,
        isTest,
        setFranchisee,
      }}
    >
      {children}
    </FranchiseeContext.Provider>
  );
};

export const useFranchisee = (): FranchiseeContextType =>
  useContext(FranchiseeContext);