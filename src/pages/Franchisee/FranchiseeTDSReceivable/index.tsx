import React, { useState, useEffect } from "react";
import { formatDate, indianFormat, indianFormat2, useDebounce } from "../../../utils";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import {
  commongetrequest,
  commonpostrequest,
  commonputrequest,
} from "../../../AllServices/services";
import Button from "../../../base-components/Button";
import {
  Download,
  File,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { ExportToXLSX } from "../../../components/ExportToXLSX/ExportToXLSX";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Nodatafound from "../../../components/Nodata/Nodatafound";
import { RxReset } from "react-icons/rx";
import CommonModal from "../../../components/CommonModal";
import CommonPagination from "../Pagination";
import { unparse } from "papaparse";
import Table from "../../../base-components/Table";
import Tippy from "../../../base-components/Tippy";
import CommonTable from "../../../components/CommonTable/CommonTable";

const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};
const intfranchise = {
  franchisee_id: "",
  franchisee_name: "",
};
const payData = {
  remarks: "",
  status: "",
  cs_bill_id: "",
};
const allowed_files = ["png", "jpeg", "jpg", "pdf"];

function FranchiseeTDSReceivable() {
  const isResettingRef = React.useRef(false);
  const [buttonModalPreview, setButtonModalPreview] = useState<boolean>(false);
  const [chargesloading, setChargesloading] = useState<boolean>(false);
  const [autoSearchLoading, setAutoSearchLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchAll, setSearchAll] = useState<any>("");
  const debouncedSearchTerm = useDebounce<any>(searchAll, 500);
  const [page, setPage] = useState<any>(0);
  const [additionalchargeslist, setAdditionalchargeslist] = useState<any>([]);
  const [chargehead, setChargehead] = useState<Array<any>>([]);
  const [franchiseedata, setFranchiseedata] = useState<Array<any>>([]);
  const [vendorName, setVendorName] = useState<Array<any>>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [statusDropdown, setStatusDropdown] = useState<any>();
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [selectedfranchiseSelectdata, setSelectedfranchiseSelectdata] =
    useState<any>(intfranchise);
  const [downloaddata, setDownlaoddata] = useState<any>([]);
  const { showAlert } = useAlert();
  const {
    isOverseas,
    franchiseeId: currentFranchiseeId,
    franchiseeName: currentFranchiseeName,
  } = useFranchisee();
  const [franchiseeId, setFranchiseeId] = useState<any>("");
  const [chargeType, setChargeType] = useState<any>("");
  const [reset, setReset] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<any>();
  const [alertwarning, setAlertwarning] = useState<boolean>(false);
  const [payloadRemarks, setPayloadRemarks] = useState<any>(payData);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [pickdataforEdit, setPickDataforEdit] = useState<any>();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectDeleteData, setSelectDeleteData] = useState<any>();
  const [deleteSpinner, setDeleteSpinner] = useState<boolean>(false);
  const [bankdata, setBankdata] = useState<Array<any>>([]);
  const [franchiseeAll, setFranchiseeAll] = useState<Array<any>>([]);
  const [lockdata, setLockdata] = useState<any>();
  const [spinner, setSpinner] = useState<boolean>(false);
  const [openChallanModal, setOpenChallanModal] = useState<boolean>(false);
  const [challanFile, setChallanFile] = useState<any>("");
  const [challanData, setChallanData] = useState<any>();
  const [challanSpinner, setChallanSpinner] = useState<boolean>(false);
  const [challanError, setChallanError] = useState<Array<any>>([]);
  const [createChallanFile, setCreateChallanFile] = useState<any>("");
  const [createChallanError, setCreateChallanError] = useState<Array<any>>([]);
  const [selectStatus, setSelectStatus] = useState<any>("");
  const [toDate, setToDate] = useState<any>();
  const [fromDate, setFromDate] = useState<any>();
  const [count, setCount] = useState<any>(1);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [error, setError] = useState<Array<any>>([]);
  const [tdsSectionList, setTdsSectionList] = useState<Array<any>>([]);
  const [selectedTdsSectionId, setSelectedTdsSectionId] = useState<string>("");

  const getaddcharg = async (
    type: "auto" | "manual" = "manual",
    value?: any,
  ) => {
    try {
      if (type === "manual") {
        setChargesloading(true);
      } else {
        setAutoSearchLoading(true);
      }
      let response3 = value
        ? await commongetrequest(
            `payment/tds-recoverable?limit=20&page=${1}&key=${debouncedSearchTerm}`,
          )
        : await commongetrequest(
            `payment/tds-recoverable?limit=20&page=${currentPage}&status=${selectStatus}&from=${fromDate ? fromDate : ""}&to=${toDate ? toDate : ""}&franchise_id=${selectedfranchiseSelectdata?.franchisee_id ? selectedfranchiseSelectdata?.franchisee_id : ""}&key=${debouncedSearchTerm}`,
          );
      if (response3?.status == 200) {
        const data = response3?.data?.data || [];
        // findrelateddata(data, 1);
        setAdditionalchargeslist(data);
        // setTotalPages(Math.ceil(response3?.data?.total / 20));
        setCount(response3?.data?.pages);
      } else if (response3?.status == 204) {
        setAdditionalchargeslist([]);
      } else if (response3?.status == 406) {
        setError(response3?.response?.data?.errors[0]?.msg);
      } else {
        showAlert("Something went wrong!", "error");
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      if (type === "manual") {
        setChargesloading(false);
      } else {
        setAutoSearchLoading(false);
      }
    }
  };

  const getResetData = () => {
    isResettingRef.current = true;
    getaddcharg("", "reset");

    setSelectedfranchisedata({
      franchisee_id: "",
      franchisee_name: "",
    });

    setSelectedfranchiseSelectdata({
      franchisee_id: "",
      franchisee_name: "",
    });

    setSelectStatus("");
    setFromDate("");
    setToDate("");
    // setSearchAll("");

    setCurrentPage(1);

    setTimeout(() => {
      isResettingRef.current = false;
    }, 0);
  };

  const getLockdate = async () => {
    const res = await commongetrequest(`admin/tally-lock`);

    if (res?.status == 200) {
      const apiDate = res?.data?.data[0]?.lock_date;

      const date = new Date(apiDate);

      // ✅ Add exactly 1 day in UTC
      date.setUTCDate(date.getUTCDate() + 1);

      const onlyDate = date.toISOString().split("T")[0];
      setLockdata(onlyDate);
    }
  };

  const chargeHead = async () => {
    const response: any = await commongetrequest(
      `admin/charges?type=E&is_cargo=2`,
    );

    // console.log(response);
    if (response?.status == 200) {
      setChargehead(response?.data?.data || []);
    } else if (response?.status == 204) {
      setChargehead([]);
    }
  };
  const getVendor = async () => {
    const response: any = await commongetrequest("admin/courier-product");

    // console.log(response);
    if (response?.status == 200) {
      setVendorName(response?.data?.data || []);
    } else if (response?.status == 204) {
      setVendorName([]);
    }
  };
  // const funcHoldBill = (data:any, id:any) => {
  //    const payload = {
  //      remarks: remarks || '',
  //      status:  id,
  //      cs_bill_id: data?.cs_bill_id
  //    }
  //    console.log("abover", payload)
  //    setPayloadRemarks(payload)

  // }
  const getBankData = async () => {
    const res: any = await commongetrequest(`admin/skart-bank-details`);
    if (res?.status == 200) {
      setBankdata(res?.data?.data);
    } else if (res?.status == 204) {
      setBankdata([]);
    } else {
      showAlert("Something went wrong!");
    }
  };
  const funTofranchiseeAll = async () => {
    const response = await commongetrequest("admin/franchisee-settings");
    if (response?.status == 200) {
      setFranchiseeAll(response?.data?.data);
    } else if (response?.status == 204) {
      setFranchiseeAll([]);
    }
  };
  const getTdsSectionList = async () => {
    const res = await commongetrequest(`admin/tds_master_list`);
    if (res?.status == 200) {
      const data = res?.data?.data || [];
      setTdsSectionList(
        data.filter((elem: any) => elem?.tds_recieveable_section == 1),
      );
    } else if (res?.status == 204) {
      setTdsSectionList([]);
    }
  };

  const getSubmitResultAlert = (res: any, successMessage: string) => {
    const resultArr = [
      ...(Array.isArray(res?.data?.items) ? res.data.items : []),
      ...(Array.isArray(res?.data?.data) ? res.data.data : []),
    ];
    if (resultArr.length === 0) {
      return { message: successMessage, type: "success" as const };
    }
    const failed = resultArr.filter((d: any) => d?.status == null);
    const succeeded = resultArr.filter((d: any) => d?.status != null);
    if (failed.length === 0) {
      return { message: successMessage, type: "success" as const };
    }
    const failMsg = failed[0]?.message || "Already processed or not found.";
    if (succeeded.length === 0) {
      return { message: failMsg, type: "warning" as const };
    }
    return {
      message: `${succeeded.length} record(s) updated succesfully. ${failed.length} record(s) skipped — ${failMsg}`,
      type: "warning" as const,
    };
  };
  const validateAndSetChallanFile = (file: any) => {
    const file_extension = file?.name
      ?.slice(((file?.name?.lastIndexOf(".") - 1) >>> 0) + 2)
      ?.toLowerCase();
    if (!allowed_files.includes(file_extension)) {
      setChallanFile("");
      setChallanError([{ path: "challan", message: "Invalid file." }]);
      return;
    }
    setChallanError([]);
    setChallanFile(file);
  };
  const validateAndSetCreateChallanFile = (file: any) => {
    const file_extension = file?.name
      ?.slice(((file?.name?.lastIndexOf(".") - 1) >>> 0) + 2)
      ?.toLowerCase();
    if (!allowed_files.includes(file_extension)) {
      setCreateChallanFile("");
      setCreateChallanError([{ path: "challan", message: "Invalid file." }]);
      return;
    }
    setCreateChallanError([]);
    setCreateChallanFile(file);
  };
  const handleChallanSubmit = async () => {
    const file_extension = challanFile?.name
      ?.slice(((challanFile?.name?.lastIndexOf(".") - 1) >>> 0) + 2)
      ?.toLowerCase();
    if (!allowed_files.includes(file_extension)) {
      setChallanError([{ path: "challan", message: "Invalid file." }]);
      return;
    }
    try {
      setChallanError([]);
      setChallanSpinner(true);
      const formData = new FormData();
      formData.append("id", challanData?.id);
      formData.append("challan", challanFile);

      let res: any = await commonpostrequest(
        "payment/tds-recoverable/challan",
        formData,
      );
      if (res?.status == 200) {
        showAlert("Challan uploaded succesfully!");
        getaddcharg();
        setOpenChallanModal(false);
        setChallanFile("");
        setChallanData(null);
        setChallanError([]);
      } else if (res?.status == 406) {
        setChallanError(res?.response?.data?.errors || []);
      } else if (res?.status == 400) {
        showAlert(
          res?.response?.data?.error || res?.response?.data?.message,
          "error",
        );
      } else if (res?.message == "Network Error") {
        showAlert(res?.message, "error");
      } else {
        showAlert(
          res?.data?.message ||
            res?.response?.data?.message ||
            res?.message ||
            "Something went wrong!",
          "error",
        );
      }
    } catch (err: any) {
      console.log(err);
      showAlert(err?.message || "Something went wrong!", "error");
    } finally {
      setChallanSpinner(false);
    }
  };
  const handleCreateSubmit = async () => {
    const formErrors: any[] = [];
    if (!pickdataforEdit?.utrn_date) {
      formErrors.push({ path: "utrn_date", msg: "Date is required" });
    }
    if (!pickdataforEdit?.tds_amount) {
      formErrors.push({ path: "tds_amount", msg: "Amount is required" });
    }
    if (!selectedTdsSectionId) {
      formErrors.push({
        path: "tds_section_id",
        msg: "TDS Section is required",
      });
    }
    if (!pickdataforEdit?.ref_no) {
      formErrors.push({ path: "ref_no", msg: "Ref No is required" });
    }
    setError(formErrors);

    if (!createChallanFile) {
      setCreateChallanError([
        { path: "challan", message: "Challan is required" },
      ]);
    } else {
      setCreateChallanError([]);
    }

    if (formErrors.length > 0 || !createChallanFile) {
      return;
    }
    const formData = new FormData();
    formData.append("ref_no", pickdataforEdit?.ref_no);
    // formData.append("franchise_id", String(currentFranchiseeId ?? ""));
    formData.append("tds_amount", pickdataforEdit?.tds_amount);
    formData.append("utrn_date", pickdataforEdit?.utrn_date);
    formData.append("remarks", pickdataforEdit?.remarks);
    formData.append("tds_section_id", selectedTdsSectionId);
    formData.append("challan", createChallanFile);

    try {
      setSpinner(true);
      const res: any = await commonpostrequest(
        "payment/tds-recoverable",
        formData,
      );
      if (res?.status == 200) {
        const result = getSubmitResultAlert(res, "Data added succesfully!");
        showAlert(result.message, result.type);
        getaddcharg();
        setPickDataforEdit({});
        setSelectedfranchisedata({
          franchisee_id: "",
          franchisee_name: "",
        });
        setSelectedTdsSectionId("");
        setCreateChallanFile("");
        setCreateChallanError([]);
        setError([]);
        setOpenModal(false);
      } else if (res?.status == 406) {
        setError(res?.response?.data?.errors);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setSpinner(false);
    }
  };
  const funcToSubmit = async () => {
    const payload = {
      cs_bill_id: pickdataforEdit?.cs_bill_id,
      charge_amount: pickdataforEdit?.charge_amount,
      charge_id: pickdataforEdit?.charge_id,
      rts_awb: pickdataforEdit?.rts_awb,
    };
    const res = await commonputrequest(
      `booking/cs-additional-billing/billing-charges`,
      payload,
    );
    if (res?.status == 200) {
      setOpenEditModal(false);
      setPickDataforEdit({});
      getaddcharg();
      showAlert("Charge updated successfully!");
    } else if (res?.status == 204) {
      showAlert("Data not found");
    } else if (res?.status == 406) {
      showAlert(res?.response?.data?.errors[0]?.msg);
    } else if (res?.status == 400) {
      showAlert(res?.response?.data?.message, "error");
    } else {
      showAlert("Something went wrong!", "error");
    }
  };
  const columns = [
    { field: "status_label", headerName: "Status", text: "text-center" },
    { field: "created_date", headerName: "Created Date", text: "text-left" },
    { field: "utrn_date", headerName: "Date", text: "text-left" },
    { field: "utr_no", headerName: "Ref No", text: "text-left" },
    { field: "tds_amount", headerName: "Amount", text: "text-right" },
    { field: "challan", headerName: "Challan", text: "text-center" },
    { field: "remarks", headerName: "Narration", text: "text-left" },
  ];

  const row: any = additionalchargeslist?.map((item: any) => {
    const utrn_date = formatDate(item?.utrn_date);
    const tds_amount = indianFormat(item?.tds_amount, 2);
    const statusLabel =
      item?.status == 1 ? (
        <span className="text-green-600 font-semibold">Accepted</span>
      ) : item?.status == 2 ? (
        <span className="text-red-600 font-semibold">Rejected</span>
      ) : (
        <span className="text-yellow-600 font-semibold">Pending</span>
      );
    const createdDate = formatDate(item?.created_date);
    const challan = item?.challan ? (
      <div className="flex justify-center">
        <File
          className="w-5 h-5 text-mustard cursor-pointer"
          onClick={() => window.open(item?.challan, "_blank")}
        />
      </div>
    ) : (
      <Button
        variant="primary"
        className="bg-blue-100 text-blue-500"
        onClick={() => {
          setOpenChallanModal(true);
          setChallanData(item);
          setChallanFile("");
          setChallanError([]);
        }}
      >
        <Upload className="w-4 h-4" />
      </Button>
    );
    const remarksText = item?.remarks ? item?.remarks : "N.A.";
    const remarks =
      remarksText?.length > 20 ? (
        <Tippy content={remarksText} className="truncate block max-w-[150px]">
          {remarksText.slice(0, 20)}...
        </Tippy>
      ) : (
        remarksText
      );
    return {
      ...item,
      utrn_date: utrn_date?.split(",")[0],
      created_date: createdDate ? createdDate : "-",
      tds_amount: tds_amount,
      challan: challan,
      remarks: remarks,
      status_label: statusLabel,
    };
  });

  // Convert JSON data to CSV and trigger download
  const convertJSONtoCSV = async (data: any[] = [], fileName: string) => {
    // try {
    setChargesloading(true);
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove(); // Use remove() instead of removeChild
    // } catch (error: any) {
    // console.error("Error converting JSON to CSV:", error.message);
    setChargesloading(false);
    // }finally{
    //     setCsvSpinner(false);
    // }
  };
  const csvDataForPrint = async () => {
    try {
      setChargesloading(true);
      let res = await commongetrequest(
        `payment/tds-recoverable?page=${currentPage}&status=${selectStatus}&from_date=${fromDate ? fromDate : ""}&to_Date=${toDate ? toDate : ""}&franchisee_id=${selectedfranchisedata?.franchisee_id}&key=${debouncedSearchTerm}`,
      );

      if (res?.status == 200) {
        const data = res?.data?.data || [];
        setDownlaoddata(data);
        ExportToXLSX({
          tableData: formatData(data),
          leftAlignColumns: ["REF NO", "CHALLAN", "NARRATION"],
          centerAlignColumns: ["STATUS", "CREATED DATE", "DATE"],
          rightAlignColumns: ["TDS AMOUNT"],
          fileName: "tds_recoverable",
        });
      } else if (res?.status == 204) {
        setDownlaoddata([]);
        showAlert("No data found to download.", "warning");
      } else {
        showAlert(
          res?.response?.data?.message || "Something went wrong!",
          "error",
        );
      }
    } catch (err: any) {
      console.error("Error fetching CSV data:", err);
      showAlert("Something went wrong while downloading!", "error");
    } finally {
      setChargesloading(false);
    }
  };

  // Format data to be CSV-ready
  const formatData = (data: any[] = []) => {
    const rows = data || [];
    if (!rows.length) return [{ "No Data Found": "" }];

    return rows.map((item: any) => {
      let status = "Pending";
      if (item?.status === 1) status = "Accepted";
      else if (item?.status === 2) status = "Rejected";
      const created_date = formatDate(item?.created_date);
      const utrn_date = formatDate(item?.utrn_date);
      const tds_amount = indianFormat2(item?.tds_amount, isOverseas);
      return {
        Status: status,
        CREATED_Date: created_date?.split(",")[0] || "N.A.",
        Date: utrn_date?.split(",")[0] || "N.A.",
        Ref_No: item?.utr_no,
        TDS_Amount: tds_amount || "N.A.",
        Challan: item?.challan || "N.A.",
        Narration: item?.remarks || "N.A.",
      };
    });
  };

  const funcToDelete = async () => {
    try {
      setDeleteSpinner(true);
      const res: any = await commonDelete(
        `booking/cs-additional-billing/billing-charges`,
        selectDeleteData?.cs_bill_id,
      );
      if (res?.status == 200) {
        showAlert("Delete succesfully!");
        setOpenDeleteModal(false);
        getaddcharg();
      } else {
        showAlert("Something went wrong!", "error");
      }
    } catch (err: any) {
      console.log("err", err);
    } finally {
      setDeleteSpinner(false);
    }
  };
  const modalDescription = (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel>
            Date<span className="text-red-500 ml-2">*</span>
          </FormLabel>
          <FormInput
            name="utrn_date"
            type="date"
            min={lockdata}
            value={pickdataforEdit?.utrn_date || ""}
            placeholder="Date"
            onChange={(e: any) => {
              setPickDataforEdit((pre: any) => ({
                ...pre,
                utrn_date: e.target.value,
              }));
            }}
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "utrn_date" ? val.msg : ""}</span>
            ))}
          </small>
        </div>

        <div>
          <FormLabel>
            Amount<span className="text-red-500 ml-2">*</span>
          </FormLabel>
          <FormInput
            value={pickdataforEdit?.tds_amount?.trim()}
            max={10}
            onChange={(e) => {
              let value = e.target.value
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*)\./g, "$1");
              const dotIdx = value.indexOf(".");
              if (dotIdx !== -1 && value.length - dotIdx - 1 > 4) {
                value = value.slice(0, dotIdx + 5);
              }
              value = value.slice(0, 10);
              setPickDataforEdit((prev: any) => ({
                ...prev,
                tds_amount: value,
              }));
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "" || isNaN(Number(value))) return;
              setPickDataforEdit((prev: any) => ({
                ...prev,
                tds_amount: Number(value).toFixed(2),
              }));
            }}
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path == "tds_amount" ? val.msg : ""}</span>
            ))}
          </small>
        </div>

        <div>
          <FormLabel>
            TDS Section<span className="text-red-500 ml-2">*</span>
          </FormLabel>
          <FormSelect
            value={selectedTdsSectionId}
            onChange={(e) => setSelectedTdsSectionId(e.target.value)}
          >
            <option value="">Select TDS Section</option>
            {tdsSectionList?.map((elem: any) => (
              <option key={elem?.id} value={elem?.id}>
                {elem?.tds_name} ({elem?.tds_section})
              </option>
            ))}
          </FormSelect>
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path == "tds_section_id" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>
      </div>

      {/* <div className="mt-4"> */}
      <div>
        <FormLabel>
          Ref No<span className="text-red-500 ml-2">*</span>
        </FormLabel>
        <FormInput
          value={pickdataforEdit?.ref_no || ""}
          max={20}
          onChange={(e) => {
            const value = e.target.value
              .replace(/[^a-zA-Z0-9-]/g, "")
              .slice(0, 20);
            setPickDataforEdit((prev: any) => ({
              ...prev,
              ref_no: value,
            }));
          }}
        />
        <small style={{ color: "red" }}>
          {error?.map((val, index) => (
            <span key={index}>{val.path == "ref_no" ? val.msg : ""}</span>
          ))}
        </small>
      </div>

      <div className="mt-4">
        <FormLabel>Narration</FormLabel>
        <FormTextarea
          rows={3}
          maxLength={250}
          value={pickdataforEdit?.remarks || ""}
          disabled
          onChange={(e: any) => {
            const value = e.target.value.slice(0, 250);
            setPickDataforEdit((prev: any) => ({
              ...prev,
              remarks: value,
            }));
          }}
        />
        <small style={{ color: "red" }}>
          {error?.map((val, index) => (
            <span key={index}>{val.path == "remarks" ? val.msg : ""}</span>
          ))}
        </small>
      </div>

      <div className="mt-4">
        <FormLabel>
          TDS Challan / Return Copy<span className="text-red-500 ml-2">*</span>
        </FormLabel>
        <label
          htmlFor="create-challan-upload-input"
          className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
            createChallanError?.length
              ? "border-red-300 bg-red-50"
              : "border-slate-300 hover:border-mustard hover:bg-yellow-50"
          }`}
          onDragOver={(e: any) => e.preventDefault()}
          onDrop={(e: any) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer?.files?.[0];
            if (droppedFile) {
              validateAndSetCreateChallanFile(droppedFile);
            }
          }}
        >
          <input
            id="create-challan-upload-input"
            type="file"
            accept=".png,.jpeg,.jpg,.pdf"
            className="hidden"
            onChange={(e: any) => {
              const uploadFile = e.target.files[0];
              if (uploadFile) {
                validateAndSetCreateChallanFile(uploadFile);
              }
            }}
          />
          {createChallanFile ? (
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100 shrink-0">
                <File className="w-5 h-5 text-mustard" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {createChallanFile?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {createChallanFile?.size
                    ? `${(createChallanFile.size / 1024).toFixed(1)} KB`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCreateChallanFile("");
                  setCreateChallanError([]);
                }}
                className="text-gray-400 hover:text-red-500 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">
                <span className="text-mustard font-semibold">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPEG, JPG or PDF
              </p>
            </>
          )}
        </label>
        <small style={{ color: "red" }}>
          {createChallanError?.map((val: any, index: number) => (
            <span key={index}>
              {val.path == "challan" ? val.message || val.msg : ""}
            </span>
          ))}
          {error?.map((val, index) => (
            <span key={index}>{val.path == "challan" ? val.msg : ""}</span>
          ))}
        </small>
      </div>
    </>
  );
  const footer = (
    <>
      <Button
        type="button"
        variant="outline-secondary"
        // onClick={handleCancel}
        onClick={() => {
          setOpenModal(false);
          setPickDataforEdit({});
          setSelectedfranchisedata({
            franchisee_id: "",
            franchisee_name: "",
          });
          setSelectedTdsSectionId("");
          setCreateChallanFile("");
          setCreateChallanError([]);
          setError([]);
        }}
        className="w-20 mr-1 p-2"
      >
        Cancel
      </Button>

      <Button
        variant="mustard"
        type="button"
        className="w-20 p-2"
        onClick={() => handleCreateSubmit()}
        disabled={spinner}
        // onClick={handleSubmit}
        // ref={sendButtonRef}
      >
        Confirm{" "}
        {spinner ? (
          <LoadingIcon icon="puff" color="white" className="w-4 h-4 ml-2" />
        ) : (
          ""
        )}
      </Button>
    </>
  );

  const footerEdit = (
    <>
      <Button
        type="button"
        variant="outline-secondary"
        // onClick={handleCancel}
        onClick={() => {
          setOpenEditModal(false);
          setPayloadRemarks("");
          setError([]);
        }}
        className="w-20 mr-1 p-2"
      >
        Cancel
      </Button>

      <Button
        variant="mustard"
        type="button"
        className="w-20 p-2"
        disabled={
          !pickdataforEdit?.charge_id || !pickdataforEdit?.charge_amount
        }
        onClick={() => funcToSubmit()}
      >
        SAVE{" "}
        {alertwarning ? (
          <LoadingIcon icon="puff" color="white" className="w-4 h-4 ml-2" />
        ) : (
          ""
        )}
      </Button>
    </>
  );
  const modalEditDescription = (
    <div className="flex justify_between gap-2">
      <div>
        <FormLabel>
          Charge Type <span className="text-red-500 ml-2">*</span>
        </FormLabel>
        <FormSelect
          value={pickdataforEdit?.charge_id}
          onChange={(e) =>
            setPickDataforEdit((prev: any) => {
              return {
                ...prev,
                charge_id: e.target.value,
              };
            })
          }
        >
          <option value={""}>Select one</option>
          {chargehead?.map((elem: any) => (
            <option value={elem?.ref_sell_id}>
              {elem?.charge_name}{" "}
              {elem?.is_cargo == 1 ? <strong>(Cargo)</strong> : ""}
            </option>
          ))}

          {/* <option value={''}>Select one</option> */}
          {/* <option value={""}>All</option>
              <option value={2}>Additional</option>
              <option value={3}>Debit</option> */}
        </FormSelect>
      </div>
      <div>
        <FormLabel>
          Charge Amount <span className="text-red-500 ml-2">*</span>
        </FormLabel>
        <FormInput
          value={pickdataforEdit?.charge_amount}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              setPickDataforEdit((prev: any) => ({
                ...prev,
                charge_amount: value,
              }));
            }
          }}
        />
      </div>
      <div>
        <FormLabel>RTS Awb</FormLabel>
        <FormInput
          value={pickdataforEdit?.rts_awb}
          onChange={(e) =>
            setPickDataforEdit((prev: any) => {
              return {
                ...prev,
                rts_awb: e.target.value,
              };
            })
          }
        />
      </div>
    </div>
  );

  const modalChallanDescription = (
    <div className="flex flex-col items-center py-1">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-3">
        <Upload className="w-7 h-7 text-mustard" />
      </div>
      <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
        Attach the challan document for this record to complete the process.
      </p>

      <label
        htmlFor="challan-upload-input"
        className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
          challanError?.length
            ? "border-red-300 bg-red-50"
            : "border-slate-300 hover:border-mustard hover:bg-yellow-50"
        }`}
        onDragOver={(e: any) => e.preventDefault()}
        onDrop={(e: any) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer?.files?.[0];
          if (droppedFile) {
            validateAndSetChallanFile(droppedFile);
          }
        }}
      >
        <input
          id="challan-upload-input"
          type="file"
          accept=".png,.jpeg,.jpg,.pdf"
          className="hidden"
          onChange={(e: any) => {
            const uploadFile = e.target.files[0];
            if (uploadFile) {
              validateAndSetChallanFile(uploadFile);
            }
          }}
        />
        {challanFile ? (
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100 shrink-0">
              <File className="w-5 h-5 text-mustard" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-800 truncate">
                {challanFile?.name}
              </p>
              <p className="text-xs text-gray-400">
                {challanFile?.size
                  ? `${(challanFile.size / 1024).toFixed(1)} KB`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                setChallanFile("");
                setChallanError([]);
              }}
              className="text-gray-400 hover:text-red-500 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">
              <span className="text-mustard font-semibold">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPEG, JPG or PDF</p>
          </>
        )}
      </label>

      {challanError?.length > 0 && (
        <p className="text-xs text-red-500 mt-2 w-full text-left">
          {challanError?.map((val: any, index: number) => (
            <span key={index}>
              {val.path == "challan" ? val.message || val.msg : ""}
            </span>
          ))}
        </p>
      )}
    </div>
  );
  const footerChallan = (
    <>
      <Button
        type="button"
        variant="outline-secondary"
        onClick={() => {
          setOpenChallanModal(false);
          setChallanFile("");
          setChallanData(null);
          setChallanError([]);
        }}
        className="w-24 mr-1 p-2"
      >
        Cancel
      </Button>

      <Button
        variant="mustard"
        type="button"
        className="w-28 p-2 inline-flex items-center justify-center"
        disabled={!challanFile || challanSpinner}
        onClick={() => handleChallanSubmit()}
      >
        <Upload className="w-4 h-4 mr-1.5" />
        Upload
        {challanSpinner ? (
          <LoadingIcon icon="puff" color="white" className="w-4 h-4 ml-2" />
        ) : (
          ""
        )}
      </Button>
    </>
  );
  const onPageChange = (e: any) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    if (isResettingRef.current) return;
    getaddcharg("manual");
  }, [currentPage]);

  useEffect(() => {
    funTofranchiseeAll();
    getBankData();
    getLockdate();
    getTdsSectionList();
  }, []);

  useEffect(() => {
    if (!selectedTdsSectionId) {
      setPickDataforEdit((prev: any) => ({
        ...prev,
        remarks: "",
      }));
      return;
    }
    const sectionInfo = tdsSectionList.find(
      (elem: any) => String(elem?.id) === String(selectedTdsSectionId),
    );
    const sectionName = sectionInfo
      ? sectionInfo?.tds_section || sectionInfo?.tds_name || ""
      : "";
    const utrnDate = pickdataforEdit?.utrn_date
      ? pickdataforEdit.utrn_date.split("-").reverse().join("-")
      : "";
    const remarks = `TDS receivable of ₹${
      pickdataforEdit?.tds_amount || ""
    } deducted by ${currentFranchiseeName || ""} dated ${utrnDate} under Section ${sectionName}`;

    setPickDataforEdit((prev: any) => ({
      ...prev,
      remarks,
    }));
  }, [
    selectedTdsSectionId,
    pickdataforEdit?.tds_amount,
    pickdataforEdit?.utrn_date,
    currentFranchiseeName,
    tdsSectionList,
  ]);

  useEffect(() => {
    if (isResettingRef.current) return;

    setCurrentPage(1);
    getaddcharg("auto");
  }, [debouncedSearchTerm]);


  return (
    <div>
      <div className="mt-3  w-full py-5 sm:py-8  px-3 sm:px-5 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
          <div className="relative flex font-bold text-lg">TDS Recoverable</div>

          <div className="flex flex-wrap items-center gap-2 md:ml-5">
            <div className="w-full sm:w-auto">
              <FormInput
                placeholder="Search by REF No"
                className="w-full sm:w-52"
                value={searchAll}
                onChange={(e) => {
                  setSearchAll(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={() => {
                setOpenModal(true);
              }}
              className="btnAnimation overflow-hidden  duration-200 h-[37px]  inline-flex items-center justify-center cursor-pointer  bg-mustard text-white text-xs py-1.5 px-3 rounded-lg hover:bg-yellow-250 transition uppercase"
            >
              <Plus className="mr-1 w-[14px] h-[14px]" /> Create
            </button>
            {additionalchargeslist?.length > 0 && (
              <button
                disabled={chargesloading}
                onClick={() => csvDataForPrint()}
                className="btnAnimation overflow-hidden  duration-200 h-[37px]  inline-flex items-center justify-center cursor-pointer  bg-success text-white text-xs py-1.5 px-3 rounded-lg hover:bg-yellow-250 transition uppercase"
              >
                <Download className="mr-1 w-[14px] h-[14px]" /> Download
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
          {/* Status */}
          <div className="flex flex-col">
            <FormLabel>Status</FormLabel>
            <FormSelect
              value={selectStatus}
              onChange={(e) => setSelectStatus(e.target.value)}
            >
              <option value="">Select one</option>
              <option value={1}>Accept</option>
              <option value={2}>Reject</option>
            </FormSelect>
          </div>

          {/* From Date */}
          <div className="flex flex-col">
            <FormLabel>From Date</FormLabel>
            <FormInput
              type="date"
              max={toDate}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <FormLabel>To Date</FormLabel>
            <FormInput
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col mt-auto">
            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              <Button
                variant="mustard"
                onClick={() => {
                  setCurrentPage(1);
                  getaddcharg("manual");
                }}
                disabled={chargesloading}
                className="w-full sm:w-[150px] p-2 bg-mustard text-white"
              >
                <Search className="mr-2 text-white" />
                Search
                {chargesloading && (
                  <LoadingIcon icon="tail-spin" className="ml-2 w-4" />
                )}
              </Button>

              <Button
                onClick={() => getResetData()}
                className="w-full sm:w-[150px] p-2.5 bg-red-400 text-white"
              >
                Reset <RxReset className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full UPLOtABLE">
          <div className="overflow-x-auto pb-[20px]">
            {additionalchargeslist?.length > 0 ? (
              <CommonTable columns={columns} row={row} page={currentPage - 1} />
            ) : (
              <Nodatafound />
            )}
          </div>
        </div>
      </div>
      {openModal && (
        <CommonModal
          open={openModal}
          setOpen={setOpenModal}
          title="CREATE"
          description={modalDescription}
          footer={footer}
          size="md"
          gridcolumns={1}
        />
      )}

      {openChallanModal && (
        <CommonModal
          open={openChallanModal}
          setOpen={setOpenChallanModal}
          title="UPLOAD CHALLAN"
          description={modalChallanDescription}
          footer={footerChallan}
          size="md"
          gridcolumns={1}
        />
      )}

      {additionalchargeslist?.length > 0 ? (
        <CommonPagination
          totalpages={+count}
          onPageChange={onPageChange}
          page={currentPage}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default FranchiseeTDSReceivable;
