import { useState, useEffect } from "react";

import { FiPlus, FiTrash2, FiCheckCircle } from "react-icons/fi";
import Button from "../../../../base-components/Button";
import { DELETE, POST, PUT, commongetrequest } from "../../../../AllServices/services";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import { FormCheck, FormInput, FormLabel, FormSwitch } from "../../../../base-components/Form";

export default function AffiliateBank() {

  const [bankAccounts, setBankAccounts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    account_number: "",
    ifsc_code: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
const {showAlert}=useAlert()


  useEffect(() => {
 
    fetchBankAccounts();
   
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const response = await commongetrequest("admin/affiliate/bank");
      if(response?.status==200){
        setBankAccounts(response?.data?.data||[])
      }else{
          setBankAccounts([]);
      }
   
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
     const res= await POST("/admin/affiliate/bank/add",addForm);
     if(res?.status==200||res?.status==201){
        showAlert(res?.data?.message||res?.data?.msg||"Added Successfully")
        setShowAddModal(false);
        setAddForm({ account_number: "", ifsc_code: "" });
 fetchBankAccounts();
     }else{
        showAlert(res?.response?.data?.message||res?.response?.data?.msg||"Something going wrong please try after some time!!..","error")
     }

      
     
    //   alert("Bank account added and verified successfully!");
    } catch (error:any) {
     console.log(error?.message)
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = async (bankDetailId?:any) => {
  

    if (confirm("Set this as primary bank account for payouts?")) {
      try {
      const res = await PUT(`/admin/affiliate/bank/set-primary`, {
        bank_detail_id: bankDetailId,
      });
      if(res?.status==200){
        showAlert(
          res?.data?.message ||
            res?.data?.msg ||
            "Primary bank account updated successfully!"
        );
          fetchBankAccounts();
         
      }else{
        showAlert(res?.response?.data?.message||res?.response?.data?.msg||"Something going wrong please try after some time","error")
      }
      
      } catch (error:any) {
        console.log(error?.message)
      }
    }
  };

  const handleDelete = async (bankDetailId?:any) => {
    if (confirm("Are you sure you want to delete this bank account?")) {
      try {
      const res = await DELETE(`/admin/affiliate/bank/${bankDetailId}`);
      if(res?.status==200){
        showAlert(res?.data?.message || "Bank account deleted successfully!");
         fetchBankAccounts();
      }else{
        showAlert(res?.response?.data?.message||"Something going Wrong please try after sometime!!..","error")
      }
       

      } catch (error:any) {
     console.log(error?.msg)
      }
    }
  };



return (
  <div title="Bank Details - sKart" className="bg-gray-100 text-gray-800">
    <div className=" mx-auto px-5">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-3xl font-bold mb-2 ">Bank Details</h1>

        <Button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary bg-mustard text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-mustard transition"
        >
          <FiPlus size={16} />
          Add Bank Account
        </Button>
      </div>
      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      {bankAccounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg mb-2 font-medium">
              No bank accounts added yet
            </p>
            <p className="text-sm mb-6">
              Add a bank account to receive commission payouts
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-mustard text-white px-5 py-2 rounded-md flex items-center gap-2 mx-auto hover:bg-mustard transition"
            >
              <FiPlus size={16} />
              Add Your First Bank Account
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5">
          {bankAccounts?.map((account: any) => (
            <div
              key={account?.bank_detail_id}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {account.beneficiary_name}
                    </h3>

                    {account.is_primary === 1 && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-md flex items-center">
                        <FiCheckCircle size={12} className="mr-1" />
                        Primary
                      </span>
                    )}

                    {account.verification_status === 1 && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-md">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Account Number
                      </p>
                      <p className="font-mono font-medium">
                        {account.account_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                      <p className="font-mono font-medium">
                        {account.ifsc_code}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                      <p className="font-medium">{account.bank_name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Branch</p>
                      <p className="font-medium">{account.branch_name}</p>
                    </div>
                  </div>
                </div>

                <div className="">
                 

                  {account?.is_primary != 1 && (
                    <FormCheck className=" mr-2">
                        <FormLabel className="mr-2 mt-2">Primary</FormLabel>
                      <FormCheck.Input
                        // id={item?.bill_no}
                        type="checkbox"
                        // checked={emaildata?.attachments?.includes(
                        //   item?.invoice_pdf
                        // )}
                        onChange={(e) => {
                          handleSetPrimary(account.bank_detail_id);
                        }}
                      />
                      {/* <FormCheck.Label htmlFor="horizontal-form-3">
                           Cash Booking
                         </FormCheck.Label> */}
                    </FormCheck>
                  )}
                  <Button
                    onClick={() => handleDelete(account.bank_detail_id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-4"
                  >
                    <FiTrash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          //   onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl"
            // onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-900">
              Add Bank Account
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded mb-4">
              Your bank account will be verified using Cashfree Bank
              Verification API
            </div>

            <form onSubmit={handleAddBank}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  value={addForm.account_number}
                  onChange={(e) =>
                    setAddForm({ ...addForm, account_number: e.target.value })
                  }
                  placeholder="Enter account number"
                  pattern="[0-9]{9,18}"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  9-18 digit account number
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none uppercase"
                  value={addForm.ifsc_code}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      ifsc_code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Enter IFSC code"
                  pattern="[A-Z]{4}0[A-Z0-9]{6}"
                  maxLength={11}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: SBIN0001234
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
                  disabled={submitting}
                >
                  {submitting ? "Verifying..." : "Add & Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);

}
