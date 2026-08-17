import { useState, useEffect } from "react";
import { commongetrequest } from "../../../AllServices/services";
import Button from "../../../base-components/Button";
import { formatDate, formatDateProper } from "../../../utils/helper";
import { indianFormat } from "../../../utils";
import CommonPagination from "../Pagination";
import Table from "../../../base-components/Table";
import LoadingIcon from "../../../base-components/LoadingIcon";


export default function AffiliateCustomers() {

  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
   
  }, []);

  useEffect(() => {

      fetchCustomers();
    
  }, [pagination?.page]);
 const handlePagechange = (e: number) => {

setPagination((pre:any)=>({...pre,page:e}))
 };
  const fetchCustomers = async () => {
    setDataLoading(true);
    try {
      const response = await commongetrequest(`admin/affiliate/customers?limit=20&page=${pagination?.page}`)
      if(response?.status==200){
 setCustomers(response?.data?.data);
 setPagination((prev) => ({ ...prev, ...response?.data
  ?.pagination }));
      }else{
        setCustomers([])
      }
     
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setDataLoading(false);
    }
  };

  console.log(pagination,"pagination coming")
  

return (
  <div title="My Customers - sKart">
    <div className="container mx-auto p-2 lg:p-4">
      <h1 className=" text-xl font-bold text-[#2c3e50] mb-6 mt-6 uppercase">
        Affiliate Customers
      </h1>

      <div className="bg-white shadow rounded p-2 lg:p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">
            Total Customers: {pagination.total}
          </h2>
        </div>

        <div className="overflow-x-auto h-[100vh]">
          <Table className="w-full border-collapse text-sm ">
            <Table.Thead className="bg-mustard text-white">
              <Table.Tr>
                <Table.Th className="py-3 px-4 text-left uppercase">
                  Sr. No.
                </Table.Th>
                <Table.Th className="py-3 px-4 text-left  uppercase">
                  Customer Name
                </Table.Th>
                <Table.Th className="py-3 px-4 text-left uppercase">
                  Email
                </Table.Th>
                <Table.Th className="py-3 px-4 text-left uppercase">
                  Contact
                </Table.Th>

                <Table.Th className="py-3 px-4 text-right uppercase">
                  Total Bookings
                </Table.Th>
                <Table.Th className="py-3 px-4 text-right uppercase">
                  Total Commission
                </Table.Th>
                <Table.Th className="py-3 px-4 text-left uppercase">
                  Registered On
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {customers.length === 0 && !dataLoading ? (
                <Table.Tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No customers found. Share your affiliate URL to start
                    earning commissions!
                  </td>
                </Table.Tr>
              ) : dataLoading ? (
                <Table.Tr>
                  <td
                    colSpan="7"
                    className="text-center  text-gray-500 h-[100vh]"
                  >
                    <div className={`flex items-center justify-center `}>
                      <div className="animate-spin rounded-full border-t-4 border-primary border-t-primary h-12 w-12"></div>
                    </div>
                  </td>
                </Table.Tr>
              ) : (
                customers.map((customer: any, index: number) => (
                  <tr key={customer?.franchisee_id} className="border-b">
                    <Table.Td className="py-3 px-4">
                      {Number(pagination?.page - 1) * 20 + index + 1}
                    </Table.Td>
                    <Table.Td className="py-3 px-4">
                      {customer?.franchisee_name}
                    </Table.Td>
                    <Table.Td className="py-3 px-4">
                      {customer?.email_id}
                    </Table.Td>
                    <Table.Td className="py-3 px-4">
                      {customer?.contacts?.length >= 1
                        ? customer?.contacts[0]?.mobile_no
                        : "N.A"}
                    </Table.Td>

                    <Table.Td className="py-3 px-4 text-right">
                      {customer?.total_bookings}
                    </Table.Td>
                    <Table.Td className="py-3 px-4 font-semibold text-green-600 text-right">
                      ₹{indianFormat(Number(customer?.total_commission)) || 0}
                    </Table.Td>
                    <Table.Td className="py-3 px-4">
                      {formatDateProper(customer?.created_date)}
                    </Table.Td>
                  </tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>

        {/* Pagination */}

        {pagination?.totalPages > 1 && (
          <CommonPagination
            totalpages={pagination?.totalPages}
            onPageChange={handlePagechange}
            page={pagination?.page}
          />
        )}
      </div>
    </div>
  </div>
);
}
