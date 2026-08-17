import { useState, useEffect } from "react";

import { FiUsers, FiDollarSign, FiUserPlus, FiTrendingUp, FiCheck, FiCopy } from "react-icons/fi";
import Button from "../../../base-components/Button";
import { FormInput, FormLabel } from "../../../base-components/Form";
import { commongetrequest, hostname } from "../../../AllServices/services";
import { useLocation, useNavigate } from "react-router-dom";
import { IndianRupee } from "lucide-react";

export default function AFfiliateDashboard() {

 
  const [affiliateData, setAffiliateData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate=useNavigate()


  useEffect(() => {

      fetchAffiliateData();
 
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const response = await commongetrequest(`admin/affiliate/data`)
      if(response?.status==200){
setAffiliateData(response?.data?.data);
      }else{
        setAffiliateData([])
      }
      
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (affiliateData?.affiliate_code) {
      navigator.clipboard.writeText(`${hostname}/affiliate/${affiliateData?.affiliate_code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
 

return (
  <div title="Affiliate Dashboard - sKart">
    <div className="container mx-auto p-2 lg:p-4">
      <h1 className="text-[28px] font-bold text-[#2c3e50] mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div
          className="border-l-4 bg-white p-4 rounded shadow"
          style={{ borderLeftColor: "#3498db" }}
        >
          <FormLabel className="text-sm text-gray-500">
            Total Customers
          </FormLabel>
          <p className="text-2xl font-semibold">
            {affiliateData?.total_customers || 0}
          </p>
        </div>

        <div
          className="border-l-4 bg-white p-4 rounded shadow"
          style={{ borderLeftColor: "#27ae60" }}
        >
          <FormLabel className="text-sm text-gray-500">
            Total Commission Earned
          </FormLabel>
          <p className="text-2xl font-semibold">
            ₹
            {parseFloat(affiliateData?.total_commission_earned || 0).toFixed(2)}
          </p>
        </div>

        <div
          className="border-l-4 bg-white p-4 rounded shadow"
          style={{ borderLeftColor: "#f39c12" }}
        >
          <FormLabel className="text-sm text-gray-500">Total Paid</FormLabel>
          <p className="text-2xl font-semibold">
            ₹{parseFloat(affiliateData?.total_paid || 0).toFixed(2)}
          </p>
        </div>

        <div
          className="border-l-4 bg-white p-4 rounded shadow"
          style={{ borderLeftColor: "#9b59b6" }}
        >
          <FormLabel className="text-sm text-gray-500">
            Current Balance
          </FormLabel>
          <p className="text-2xl font-semibold">
            ₹{parseFloat(affiliateData?.current_balance || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Affiliate URL */}
      <div className="bg-white rounded shadow p-5 mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Affiliate URL</h2>

        <p className="text-sm text-gray-500 mb-4">
          Share this URL with potential customers.
        </p>

        <div className="flex gap-3 items-center bg-gray-100 p-3 rounded border">
          <FormInput
            value={
          `${hostname}/affiliate/${affiliateData?.affiliate_code||""}`} 
            readOnly
            className="flex-1 bg-white text-sm"
          />

          <Button
            onClick={copyToClipboard}
            className="min-w-[100px] flex items-center gap-1"
          >
            {copied ? (
              <>
                <FiCheck size={16} /> Copied!
              </>
            ) : (
              <>
                <FiCopy size={16} /> Copy
              </>
            )}
          </Button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          <strong>Affiliate Code:</strong> {
          affiliateData?.affiliate_code}
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded shadow p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FormLabel className="text-xs text-gray-500 mb-1">Name</FormLabel>
            <p className="text-[16px] font-medium text-gray-800">
              {affiliateData?.franchisee_name || "N.A"}
            </p>
          </div>

          <div>
            <FormLabel className="text-xs text-gray-500 mb-1">Email</FormLabel>
            <p className="text-[16px] font-medium text-gray-800">
              {affiliateData?.email_id || "N.A"}
            </p>
          </div>

          <div>
            <FormLabel className="text-xs text-gray-500 mb-1">
              Contact
            </FormLabel>
            <p className="text-[16px] font-medium text-gray-800">
              {affiliateData?.contact || "N/A"}
            </p>
          </div>

          <div>
            <FormLabel className="text-xs text-gray-500 mb-1">
              Commission Rate
            </FormLabel>
            <p className="text-[16px] font-medium text-green-600">
              {affiliateData?.commission_rate}%
            </p>
          </div>

          <div>
            <FormLabel className="text-xs text-gray-500 mb-1">
              GST Registered
            </FormLabel>
            <p className="text-[16px] font-medium text-gray-800">
              {affiliateData?.is_gst_registered ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <FormLabel className="text-xs text-gray-500 mb-1">Status</FormLabel>
            <span
              className={`px-2 py-1 rounded text-sm ${
                affiliateData?.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {affiliateData?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded shadow p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/franchisee/affiliate/customers")}
            className="flex items-center gap-1"
          >
            <FiUsers size={16} /> View My Customers
          </Button>

          <Button
            onClick={() => navigate("/franchisee/affiliate/commision")}
            className="flex items-center gap-1"
          >
            <IndianRupee size={16} /> View Commissions
          </Button>

          <Button
            onClick={() => navigate("/franchisee/affiliate/statement")}
            className="flex items-center gap-1"
          >
            <FiTrendingUp size={16} /> Account Statement
          </Button>
        </div>
      </div>
    </div>
  </div>
);












}
