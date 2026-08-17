import { GET, POST, PUT } from "./services";

export const getLocalPincodeApi = async (pin: string) => {
  return await GET(`/admin/domestic-pincode/${pin}`);
};

export const getCityStateApi = async (countryCode: string, zipCode = "") => {
  return await GET(
    `/admin/international-pincode?country_code=${countryCode}&zipcode=${zipCode}`
  );
};

export const getCityStatesApi = async (
  countryCode: string,
  zipcode = "",
  city = ""
) => {
  return await GET(
    `/admin/international-pincode?country_code=${countryCode}&zipcode=${zipcode}&city=${city}`
  );
};

export const getShipmentTypesApi = async () => {
  return await GET(`/admin/booking-shipment-type`);
};

export const getCountryApi = async (country: string = "", offset: any = undefined) => {
    return await GET(`/admin/country?country=${country}` + (offset != undefined ? `&offset=${offset}` : ""));
};

export const getShipnstockCountriesApi = async () => {
  return await GET(`/booking/shipnstock-countries`);
};

export const getShipnstockStatesApi = async (countryId: any) => {
  return await GET(`/booking/shipnstock-states/${countryId}`);
};

export const gstVerificationApi = async (gstNumber: string = "") => {
  return POST("/book/gst_validate", { consigner_gst_number: gstNumber });
};

export const gstApplicableApi = async () => {
  return GET("/book/gst_applicable");
};

export const taxPaymentOptionApi = async () => {
  return GET("/book/tax_payment");
};

export const consignerDocumentTypesApi = async () => {
  return GET("/book/document_type");
};

export const getConsignerDetailsApi = async (
  mobileNo: string,
  import_booking: any = 1
) => {
  return POST("/book/get_consigner_data", {
    consigner_mobile_number: mobileNo,
    import_booking: import_booking,
  });
};

export const getConsigneeDetailsApi = async (
  mobileNo: string,
  import_booking: any = 1
) => {
  return POST("/book/get_consignee_data", {
    consignee_mobile_number: mobileNo,
    import_booking: import_booking,
  });
};

export const rateCalculatorApi = async (rateFormData: any) => {
  return POST("/admin/get-rates", rateFormData);
};

export const courierProductsApi = async (data: any) => {
  return GET(`/admin/courier-product`);
};

export const cargoProductsApi = async (
  hub_id: any = "",
  country_id: any = "",
  is_import: any = 0
) => {
  return GET(
    `/admin/cargo-courier-product?hub_id=${hub_id}&country_id=${country_id}&is_import=${is_import}`
  );
};

export const odaFinderApi = async (data: any) => {
  return GET(
    `/admin/oda-finder?country=${data?.country_id}&country_code=${data?.country_code}&pincode=${data?.pincode}&city=${data?.city}&weight=${data?.weight}`
  );
};

export const bookShipmentApi = async (bookingData: any) => {
  return POST("/book/", bookingData);
};
export const domBookShipmentApi = async (bookingData: any) => {
  return POST("/booking/dom-book", bookingData);
};

export const productTypesApi = async (franchisee_id: any = "") => {
  return GET(`/admin/courier-product?franchisee_id=${franchisee_id}`);
};
export const allProductTypesApi = async (courier_id: Number) => {
  return GET(`/admin/courier-product/0/${courier_id}`);
};

export const getCurrencyApi = async () => {
  return GET("/booking/currency");
};
export const getWeightUnitApi = async () => {
  return GET("/book/weight_unit");
};
export const getLengthUnitApi = async () => {
  return GET("/book/length_unit");
};

export const getHsnCodesApi = async (hsncode: string) => {
  return GET(`/admin/hsn-codes?hsn_code=${hsncode}`);
};

export const getCargoTypeApi = async () => {
  return GET(`/book/cargo_type`);
};

export const getClearanceTypeApi = async () => {
  return GET(`/book/clearence_type`);
};

export const getIncotermApi = async () => {
  return GET(`/book/incoterm`);
};

export const getOrganizationTypesApi = async () => {
  return GET(`/book/get_orgnization`);
};

export const getOrganizationDocumentsApi = async () => {
  return GET(`/book/get_orgnization_document`);
};

export const uploadKycApi = async (kycData: any) => {
  return POST("/book/upload_kyc", kycData);
};

export const uploadShipperInvoiceApi = async (formData: any) => {
  return POST("/book/upload_shipper_invoice", formData);
};

export const getWalletRechargeHistoryApi = async (
  search: string = "",
  limit: Number = 20,
  page: Number = 0
) => {
  return GET(`/payment/wallet?key=${search}&limit=${limit}&page=${page}`);
};

export const getSkartInvoicesApi = async (
  invoiceType: Number = 1,
  search: string = "",
  limit: Number = 20,
  page: Number = 0
) => {
  return POST(
    `/invoice/invoice-list?e_inv=${invoiceType}&key=${search}&limit=${limit}&page=${page}`,
    {}
  );
};
export const getInvoiceDataApi = async (invoiceNo: Number) => {
  return GET(`/invoice/invoice-summary/${invoiceNo}`);
};

export const downloadBookingSummaryApi = async (
  endpoint: any,
  franchiseeId: any,
  fromDate: string,
  toDate: string
) => {
  return POST(`/${endpoint}/getBookSummeryReportsDownload`, {
    franchise_id: franchiseeId,
    from_date: fromDate,
    to_date: toDate,
  });
};
export const getBookingSummaryApi = async (
  endpoint: any,
  franchiseeId: any,
  fromDate: string,
  toDate: string,
  page: Number = 0,
  limit: Number = 20
) => {
  return POST(`/${endpoint}/getBookSummeryReports`, {
    franchise_id: franchiseeId,
    per_page: limit,
    page: page,
    from_date: fromDate,
    to_date: toDate,
  });
};
export const getMonthlyReportsApi = async (
  endpoint: any,
  franchiseeId: any,
  fromDate: string,
  toDate: string,
  page: Number = 0,
  limit: Number = 20
) => {
  return POST(`/${endpoint}/getBookMonthlyReports`, {
    franchise_id: franchiseeId,
    per_page: limit,
    page: page,
    from_date: fromDate,
    to_date: toDate,
  });
};

// export const getCustomerReportsApi = async (endpoint: any, franchiseeId: any, fromDate: string, toDate: string, page: Number = 0, limit: Number = 20) => {
//     return POST(`/${endpoint}/getBookCustomerReports`, {
//         "franchise_id": franchiseeId,
//         "per_page": limit,
//         "page": page,
//         "from_date": fromDate,
//         "to_date": toDate
//     });
// }

export const getCustomerReportsApi = async (
  endpoint: any,
  franchiseeId: any,
  fromDate: string,
  toDate: string,
  page: Number = 0,
  limit: Number = 20
) => {
  return GET(
    `/${endpoint}/getBookCustomerReports?limit=${limit}&page=${page}&from=${fromDate}&to=${toDate}&we=${franchiseeId}`
  );
};

export const downloadCustomerReport = async (
  endpoint: any,
  franchiseeId: any,
  fromDate: string,
  toDate: string
) => {
  return GET(
    `/${endpoint}/getBookCustomerReports?from=${fromDate}&to=${toDate}&we=${franchiseeId}`
  );
};

export const getBookingListApi = async (
  franchiseeId: Number,
  from_date: string,
  to_date: string,
  offset: Number,
  status: any = null,
  is_import: any = null,
  search: string = ""
) => {
  return POST(`/track_shipment/booking/booking-list`, {
    franchisee_id: franchiseeId,
    from_date: from_date,
    to_date: to_date,
    offset: offset,
    is_open: status ? status : null,
    is_import: is_import ? is_import : null,
    airwaybill_no: search,
  });
};

export const getUnbilledReportsApi = async (franchiseeId: number) => {
  return POST(`/book/getUnbilledReports_franchiess`, {
    franchisee_id: franchiseeId,
  });
};

export const dispatchStatusCodeApi = async () => {
  return GET(`/track_shipment/0`);
};
export const generateRefNoApi = async () => {
  return GET(`/book/getRefrenceNumber`);
};

export const getAWBDataApi = async (franchiseeId: number, pickupId: string) => {
  return POST(`/book/getSummary`, {
    franchisee_id: franchiseeId,
    pickup_id: pickupId,
  });
};

export const getCommodityTypeApi = async () => {
  return GET(`/admin/commodity-type`);
};
export const getCommodityTypeByIdApi = async (commodityId: string | number) => {
  return GET(`/admin/commodity-type/${commodityId}`);
};
export const getServiceTypeApi = async () => {
  return GET(`/booking/service_type_list`);
};

export const postSpotEnquiryApi = async (requestData: any) => {
  return POST(`/booking/raise_spot_enquiry`, requestData);
};
export const updateSpotEnquiryApi = async (requestData: any) => {
  return PUT(`/booking/raise_spot_enquiry`, requestData);
};
export const approveSpotEnquiryApi = async (requestData: any) => {
  return POST(`/booking/update_spot_data`, requestData);
};

export const spotEnquiryListingApi = async (
  franchisee_id: string,
  search: string = "",
  limit: string = 20,
  page: string = 0
) => {
  return POST(
    `/booking/get_spot_enquiry?key=${search}&limit=${limit}&page=${page}`,
    { franchisee_id: [franchisee_id] }
  );
};

export const cashfreeRechargeInitiateApi = async (recharge_amount: number, currency_code: any) => {
  return POST(`/payment/wallet-cashfree`, {
    recharge_amount,
    currency_code: currency_code ? currency_code : "INR"
  });
}
export const cashfreeRechargeVerifyApi = async (order_id: string) => {
  return POST(`/payment/verify-cashfree`, {
    order_id,
  });
};

export const phonePeRechargeApi = async (recharge_amount: number) => {
  return POST(`/payment/wallet-phonepe`, {
    recharge_amount,
  });
};

export const getSkynetServiceCodeApi = async (
  shipment_type: string,
  consignee_country: string
) => {
  return POST(`/book/get_service_code`, {
    shipment_type,
    consignee_country,
  });
};

export const getBAInvoiceDataApi = async (
  page: any = 0,
  limit: Number = 20,
  franchise_id: any
) => {
  return POST(`/invoice/invoice-list?e_inv=1&page=${page}&limit=${limit}`, {
    franchise_id,
  });
};

export const getBilledOutstandingApi = async (franchise_id: any) => {
  return POST(`/invoice/billed-outstanding`, {
    franchise_id,
  });
};
export const getUnbilledOutstandingApi = async (franchisee_id: any) => {
  return POST(`/book/getUnbilledAmount`, {
    franchisee_id,
  });
};

export const getBookingChargesApi = async () => {
  return GET(`/admin/booking-charges`);
};

export const walletRechargeApi = async (data: any) => {
  return POST("/payment/wallet-offline", data);
};

export const getFranchiseeDetailsApi = async (franchiseeId: any) => {
  return GET(`/admin/franchisee-settings/${franchiseeId}`);
};

export const updateFranchiseeAdditionalSettingsApi = async (data: any) => {
  return POST(`/admin/franchisee-additional-settings`, data);
};

export const getExportTypeApi = async () => {
  return GET(`/book/get_export_type`);
};

export const getLoggerDataApi = async (
  franchiseeId: any,
  fromDate: string,
  toDate: string,
  limit: string = "",
  offset: number = 0,
  search: string = ""
) => {
  return POST(
    `/logger/list/${franchiseeId}?limit=${limit}&offset=${offset}&value=${search}`,
    {
      from_date: fromDate,
      to_date: toDate,
    }
  );
};

export const getPickupTimeApi = async (origin_pincode: any) => {
  return POST(`/book/get_time`, { origin_pincode });
};

export const getPUDaddressApi = async (pincode: number) => {
  return GET(`/admin/pud-address?pincode=${pincode}`);
};

export const checkAvailableCreditLimit = async (
  franchisee_id: any,
  shipment_rates: number
) => {
  return POST(`/book/check_available_credit_limit`, {
    franchisee_id,
    shipment_rates,
  });
};

export const directCustomerRegistration = async (formData: any) => {
  return POST(`/auth/register`, formData);
};

export const walkinCustomer = async (data: any) => {
  return POST(`/book/getWalkinClients`, data);
};

export const downloadShipperInvoice = async (airwaybilno: string) => {
  return POST(`/book/getShipperInvoice`, { airwaybilno });
};

export const shipperDimensionDetails = async (airwaybilno: string) => {
  return POST(`/book/getDimessiondetails`, { airwaybilno });
};

export const shipperDimensionInputs = async (airwaybilno: string) => {
  return POST(`/book/getDimessionInput`, { airwaybilno });
};

export const shipperExtraData = async (airwaybilno: string) => {
  return POST(`/book/getDimessionInputNewData`, { airwaybilno });
};

export const postShipperDimension = async (formData: any) => {
  return POST(`/book/addShipperDimession`, formData);
};

export const getAnnouncements = async () => {
  return GET(`/admin/announcement-list`);
};

export const postTrackingApi = async (searchvalue: string) => {
  return POST(`/book/getTracking`, {
    airwaybilno: searchvalue,
  });
};

export const getTrackingApi = async (awbno: string) => {
  return GET(`/track_shipment/track-shipment/${awbno?.trim()}`);
};

export const getOverWeightLimitApi = async () => {
  return GET(`/admin/min-validation-data`);
};

export const checkReferenceNumber = async (reference_no: string) => {
  return POST(`/book/check_refrence_number`, {
    consignee_reference_no: reference_no,
  });
};

export const addressLabel = async (airwaybillno: string) => {
  return POST(`/book/AddressLabel`, {
    airwaybillno: airwaybillno,
  });
};

// Bulk Booking
export const downloadAWBs = async (franchisee_id: any, no_of_awbs: string) => {
  return POST(`/admin/fetch-domestic-awbs`, { franchisee_id, no_of_awbs });
};

export const checkCSV = async (csvData: any) => {
    return POST("/booking/check-book-csv", csvData);
}

export const uploadCSV = async (csvData: any) => {
  return POST("/booking/book-csv", csvData);
};


export const triggerPendingAPI = async (data: any) => {
    return PUT("/booking/retry-booking", data);
}

export const getBulkListing = async (limit: number, page: number, search: any = "") => {
    return GET(`/booking/book-csv-dashboard?limit=${limit}&page=${page}&key=${search}`);
}

export const getBatchWiseListing = async (limit: number, page: number, batch: any = "") => {
    return GET(`/booking/book-csv?limit=${limit}&page=${page}&booking_code=${batch}`);
}

export const getBatchList = async () => {
    return GET(`/booking/booking-code`);
}

export const getAWBLimit = async (franchiseeId: any) => {
    return GET(`/admin/franchisee-available-awb/${franchiseeId}`);
}

export const bulkAwbData = async (franchise_id: any) => {
    return GET(`/admin/awb-listing/${franchise_id}`);
}

// skart/Integrator
export const getfranchiseeThreshold = async (franchiseeId: any) => {
  return GET(`/admin/franchisee-threshold-weight/${franchiseeId}`);
};
export const updatefranchiseeThreshold = async (data: any) => {
  return PUT(`/admin/franchisee-weight-consideration`, data);
};

// Edit Profile
export const editProfileSendOtpApi = async (formData: any) => {
  return POST("/admin/send_otp_update_details", formData);
};

export const editProfileVerifyOtpApi = async (formData: any) => {
  return POST("/admin/verify_otp_update_details", formData);
};

// MSME
export const msmeRegister = async (formData: any) => {
  return POST("/book/msmeCustomer", formData);
};

export const msmeList = async (data: any) => {
  return POST(`/book/listsmeCustomer`, data);
};

export const msmeData = async (data: any) => {
  return POST(`/book/getMsmeDetails`, data);
};

export const skartProduct = async () => {
  return GET(`/admin/courier-product`);
};

//Master

//Tax Slab
export const taxSlab = async () => {
  return GET(`/master/tax`);
};

// Authentication Services

export const loginApi = async (loginData: any) => {
  return POST("/auth/login/4", loginData);
};

export const verifyUser = async () => {
  return GET(`/auth/verify/4`);
};

export const changePassApi = async (formData: any) => {
  return POST("/auth/change_password", formData);
};

export const forgotPassSendOtp = async (username: string) => {
  return GET(`/auth/otp/${username}/4`);
};

export const forgotPassVerifyOtp = async (username: string, otp: any) => {
  return POST(`/auth/otp/${username}`, { otp });
};

export const logoutApi = async () => {
  return GET("/auth/logout");
};

export const directCustomerCheck = async (data: any) => {
  return POST(`/auth/check`, data);
};

export const directCustomerSendOtp = async (data: any) => {
  return POST(`/auth/get-doc-otp`, data);
};
export const directCustomerVerifyOtp = async (data: any) => {
  return POST(`/auth/verify-doc-otp`, data);
};
export const directCustomerLoginOtp = async (data: any) => {
  return POST(`/auth/direct_customer/login/otp`, data);
};
export const directCustomerMatchOtp = async (data: any) => {
  return POST(`/auth/direct_customer/match/otp`, data);
};

// kavach

export const checkKavachApi = async (franchise_id: any) => {
  return GET(`/admin/pending_requests/${franchise_id}`);
};

export const checkKavachTimelineApi = async (franchise_id: any) => {
  return GET(`/log/kawach-active-date/${franchise_id}`);
};
export const activateKavachApi = async (franchise_id: any) => {
  return POST(`/admin/enable-kawach-otp/${franchise_id}`, {});
};
export const submitKavachOtpApi = async (data: any) => {
  return POST(`/admin/enable-kawach`, data);
};
export const deactivateKavachApi = async (data: any) => {
  return POST(`/admin/deactivation_request`, data);
};

//rto listing api
export const Rto_listing_api = async (data: any) => {
  return POST(`/booking/rto_on_hold_list`, data);
};

// Standard Description Api
export const standardDescriptionApi = async (value: string) => {
  return GET(
    `/admin/aiqs-data-set/get-standard-description-for?description=${value}`
  );
};

//Purpose of Shipment Dropdown API
export const purposeOfShipmentApi = async () => {
  return GET(`/book/get_shipment_purpose`);
};

// Invoice Term Api
export const getInvoiceTermApi = async () => {
  return GET(`/admin/invoice-term`);
};

// Invoice Type Api
export const getInvoiceTypeApi = async () => {
  return GET(`/admin/invoice-type`);
};

//Get Soft Credit API
export const getSoftCreditApi = async (franchisee_id: any) => {
  return GET(`/booking/get-soft-credit/${franchisee_id}`);
};
// PGA HSNCODE

export const Pga_hsncode_Api = async (data: any) => {
  return POST(`/book/get_pga_htscodes`, data);
};

// Prohibited HSNCODE
export const check_prohibited_hsncode = async (data: any) => {
  return POST(`/book/get_prohibited_code`, data);
};

// Booking Approval 

export const getBookingApproval = async (airwaybill_no: any) => {
  return GET(`/booking/get_import_draft_data/${airwaybill_no}`);
};

// Import Booking List Api

export const getImportBookingCountApi = async (awb_no:any, status:any) => {
  return GET(`/booking/get_import_reject_approved/${awb_no}/${status}`);
};

export const getImportBookingListApi = async (
  franchiseeId: Number,
  from_date: string,
  to_date: string,
  page: Number,
  search: string = ""
) => {
  return POST(`/booking/get_booking_import_draft?page=${page}&limit=20`, {
    franchisee_id: franchiseeId,
    from_date: from_date,
    to_date: to_date,
    airwaybill_no: search,
  });
};

// Refund Request Api

export const refundRequestApi = async (unique_id: any, data: any) => {
    return PUT(`/booking/refund-booking/${unique_id}`, data);
}
