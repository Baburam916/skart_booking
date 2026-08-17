import React, { useEffect, useState } from "react";
import { FormSelect } from "../../../base-components/Form";
import { Link } from "react-router-dom";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import {
  getfranchiseeThreshold,
  updatefranchiseeThreshold,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { Truck, Plane, Settings, Save } from "lucide-react";

import kgs from "../../../assets/images/kgs.png";

type RadioPillProps = {
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
  icon: React.ReactNode;
};

const RadioPill = ({ value, checked, onChange, label, icon }: RadioPillProps) => (
  <button
    type="button"
    onClick={() => onChange(value)}
    className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer select-none ${
      checked
        ? "bg-amber-50 border-amber-400 text-[#e7a72c]"
        : "bg-white border-slate-200 text-slate-400 hover:border-amber-300"
    }`}
  >
    <span className={checked ? "text-[#fdc04b]" : "text-slate-400"}>{icon}</span>
    <span>{label}</span>
    <span
      className={`ml-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        checked ? "border-[#fdc04b]" : "border-slate-300"
      }`}
    >
      {checked && <span className="w-2 h-2 rounded-full bg-[#fdc04b] inline-block" />}
    </span>
  </button>
);

const index = () => {
  const [vendor, setVendor] = useState("1");
  const [Threshold, setThreshold] = useState("1.00");
  const [confirm, setConfirm] = useState(true);
  const { franchiseeId } = useFranchisee();
  const { showAlert } = useAlert();
  const [spinner, setSpinner] = useState(false);
  const [initial, setInitial] = useState({
    threshold: "",
    weight_consideration: "",
  });

  const [vendor2, setVendor2] = useState("2");
  const [Threshold2, setThreshold2] = useState("1.00");
  const [initial2, setInitial2] = useState({
    threshold: "",
    weight_consideration: "",
  });

  const handleUpdateAll = async () => {
    if (!confirm) {
      showAlert("Please accept the terms and conditions", "warning");
      return;
    }
    if (!vendor) {
      showAlert("Please select vendor for Courier", "warning");
      return;
    }
    if (!Threshold) {
      showAlert("Please select threshold limit for Courier", "warning");
      return;
    }
    if (Number(Threshold) < 1) {
      showAlert("Courier threshold limit cannot be less than 1", "warning");
      return;
    }
    if (!vendor2) {
      showAlert("Please select vendor for Commercial", "warning");
      return;
    }
    if (!Threshold2) {
      showAlert("Please select threshold limit for Commercial", "warning");
      return;
    }
    if (Number(Threshold2) < 1) {
      showAlert("Commercial threshold limit cannot be less than 1", "warning");
      return;
    }

    setSpinner(true);
    try {
      const res = await updatefranchiseeThreshold({
        franchisee_id: franchiseeId,
        weight_consideration: vendor,
        threshold: Threshold,
        com_weight_consideration: vendor2,
        com_threshold: Threshold2,
      });

      if (res?.status == 200) {
        showAlert(res?.data?.message);
        getData();
      } else {
        showAlert(
          res?.data?.message ||
            res?.response?.data?.message ||
            res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };

  const getData = async () => {
    try {
      const res = await getfranchiseeThreshold(franchiseeId);
      if (res?.status == 200) {
        setThreshold(res?.data?.threshold || "1.00");
        setVendor(res?.data?.weight_consideration || "1");
        setInitial({
          threshold: res?.data?.threshold || "",
          weight_consideration: res?.data?.weight_consideration || "",
        });
        setThreshold2(res?.data?.com_threshold || "1.00");
        setVendor2(res?.data?.com_weight_consideration || "2");
        setInitial2({
          threshold: res?.data?.com_threshold || "",
          weight_consideration: res?.data?.com_weight_consideration || "",
        });
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const courierChanged =
    initial?.weight_consideration != vendor ||
    Number(Threshold) != Number(initial?.threshold);
  const commercialChanged =
    initial2?.weight_consideration != vendor2 ||
    Number(Threshold2) != Number(initial2?.threshold);

  const isDisabled =
    !confirm || spinner || (!courierChanged && !commercialChanged);

  return (
    <div className="lg:w-[860px] m-auto w-full">

<div className="w-full text-center text-[20px] lg:text-[24px] font-medium uppercase mt-8 lg:mb-4 mb-2" >integrator</div>

      <div className="p-2 lg:p-6 w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Two-column section */}
        <div className="flex flex-col gap-5 lg:flex-row mb-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Courier */}
          <div className="flex-1  border border-[#fff3e5] rounded-[12px]">
            {/* Card header */}

            <div className="flex items-center gap-3 p-3 bg-[#fff9ed] rounded-t-xl border-b border-[#fff3e5]">
              <div className="w-11 h-11 rounded-xl bg-[#ffebc5] flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#e9ac36]" />
              </div>
              <div>
                <p className="text-base font-bold text-[#3a3a3a] leading-tight">Courier</p>
                <p className="text-xs text-[#fdc04b] font-medium">Chargeable weight</p>
              </div>
            </div>
   <div className="p-4">
            {/* Weight settings */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Chargeable Weight Settings
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <RadioPill
                value="1"
                checked={vendor === "1"}
                onChange={setVendor}
                label="sKart Express"
                icon={<Truck className="w-4 h-4" />}
              />
              <RadioPill
                value="2"
                checked={vendor === "2"}
                onChange={setVendor}
                label="Integrator"
                icon={<Settings className="w-4 h-4" />}
              />
            </div>

            {/* Threshold */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Threshold Limit (Kgs)
            </p>
         
                     <div className="relative w-full border border-[#E5E7EB] rounded-[8px] flex ">
                              
                              <i className="border-r border-[#E4E4E4] bg-[#FBFBFB] w-[45px] h-[38px] flex items-center justify-center rounded-l-[7px]">
                               <img src={kgs} className="w-[24px] opacity-50" alt=""/></i>
                              <div className="w-full">
            <FormSelect
          className="border-0 rounded-r-[9px] rounded-l-[0px] shadow-none outline-none border-none focus:outline-none focus:ring-0 focus:border-none h-[38px]"
              aria-label="Courier threshold limit"
              value={Threshold}
              onChange={(e) => setThreshold(e.target.value.replace(/[^0-9.]/g, ""))}
            >
              <option value="">Select Limit</option>
              <option value="1.00">1</option>
              <option value="2.00">2</option>
              <option value="3.00">3</option>
            </FormSelect>
          </div>   </div>
</div>   </div>   
          {/* Commercial */}
          <div className="flex-1  !border !border-[#fff3e5] rounded-[12px]">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-[#fff3e5]  p-3 bg-[#fff9ed] rounded-t-xl">
              <div className="w-11 h-11 rounded-xl bg-[#ffebc5] flex items-center justify-center flex-shrink-0">
                <Plane className="w-6 h-6 text-[#e9ac36]" />
              </div>
              <div>
                <p className="text-base font-bold text-[#3a3a3a]  leading-tight">Commercial</p>
                <p className="text-xs text-[#fdc04b] font-medium">Chargeable weight</p>
              </div>
            </div>

<div className="p-4">
            {/* Weight settings */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Chargeable Weight Settings
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <RadioPill
                value="1"
                checked={vendor2 === "1"}
                onChange={setVendor2}
                label="sKart Express"
                icon={<Truck className="w-4 h-4" />}
              />
              <RadioPill
                value="2"
                checked={vendor2 === "2"}
                onChange={setVendor2}
                label="Integrator"
                icon={<Settings className="w-4 h-4" />}
              />
            </div>

            {/* Threshold */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Threshold Limit (Kgs)
            </p>

                     <div className="relative w-full border border-[#E5E7EB] rounded-[8px] flex ">
                              
                              <i className="border-r border-[#E4E4E4] bg-[#FBFBFB] w-[45px] h-[38px] flex items-center justify-center rounded-l-[7px]">
                               <img src={kgs} className="w-[24px] opacity-50" alt=""/></i>
                              <div className="w-full">

            <FormSelect
           className="border-0 rounded-r-[9px] rounded-l-[0px] shadow-none outline-none border-none focus:outline-none focus:ring-0 focus:border-none h-[38px]"
              aria-label="Commercial threshold limit"
              value={Threshold2}
              onChange={(e) => setThreshold2(e.target.value.replace(/[^0-9.]/g, ""))}
            >
              <option value="">Select Limit</option>
              <option value="1.00">1</option>
              <option value="2.00">2</option>
              <option value="3.00">3</option>
            </FormSelect>
          </div></div></div>
        </div></div>

        {/* Footer: Terms & Conditions + Update button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-0 pt-5 pb-2 border-t border-slate-100">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              checked={confirm}
              disabled={spinner}
              onChange={(e) => setConfirm(e.target.checked)}
            />
            I agree to the{" "}
            <Link
              className="text-[#fdc04b] font-semibold hover:underline"
              to="" 
              target="_blank"
            >
              Terms and Conditions
            </Link>
          </label>

          <button
            type="button"
            onClick={handleUpdateAll}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isDisabled
                ? "bg-[#fdc04b] text-white cursor-not-allowed"
                : "bg-[#fdc04b] hover:bg-amber-500 text-white cursor-pointer"
            }`}
          >
            {spinner ? (
              <LoadingIcon icon="puff" color="white" className="w-4 h-4 stroke-2.5" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Update settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default index;
