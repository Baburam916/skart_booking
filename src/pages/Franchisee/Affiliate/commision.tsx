import { useState, useEffect } from "react";

import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Table from "../../../base-components/Table";
import { formatDate } from "../../../utils";
import { commongetrequest } from "../../../AllServices/services";
import CommonPagination from "../Pagination";
import LoadingIcon from "../../../base-components/LoadingIcon";


export default function AffiliateCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    from_date: "",
    to_date: "",
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchCommissions(1);
  }, [pagination?.page]);

  const fetchCommissions = async (value:any) => {
    const {from_date,to_date,status}=filters
    setDataLoading(true);
    const params:any={
      limit:20,
      page:pagination?.page

    }
    if(from_date){
      params.from_date=from_date
    }
    if(to_date){
      params.to_date=to_date
    }
    if(status){
      params.status=status
    }

    try {

      const response =value==1? await commongetrequest(`admin/affiliate/commissions`,{params:params}): await commongetrequest(`admin/affiliate/commissions`);
      if(response?.status==200){ setCommissions(response?.data?.data || []);
      setPagination((prev) => ({ ...prev, ...response?.data?.pagination }));}
      else{
        setCommissions([])
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
        });
      }
     
    } catch (error) {
      console.error("Error fetching commissions:", error);
    } finally {
      setDataLoading(false);
    }
  };
 const handlePagechange = (e: number) => {
   setPagination((pre: any) => ({ ...pre, page: e }));
 };
  const getStatusBadge = (status: any) => {
    const statusMap = {
      0: { label: "Pending", class: "badge-warning" },
      1: { label: "Approved", class: "badge-info" },
      2: { label: "Paid", class: "badge-success" },
    };
    const statusInfo = statusMap[status] || {
      label: "Unknown",
      class: "badge-secondary",
    };
    return (
      <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
    );
  };

  return (
    <div title="Commissions - sKart">
      <div className="container">
        <h2 className="text-xl font-bold text-primary uppercase mt-6">
          Commission Bookings
        </h2>

        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>
        <div className="bg-white shadow rounded-lg p-2 lg:p-6">
          {/* Filters */}
          <div className="grid gap-4 mb-5 grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
            <div>
              <FormLabel className="text-sm font-semibold text-gray-600 mb-1 block">
                Status
              </FormLabel>
              <FormSelect
                as="select"
                value={filters.status}
                className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Paid</option>
              </FormSelect>
            </div>

            <div>
              <FormLabel className="text-sm font-semibold text-gray-600 mb-1 block">
                From Date <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                type="date"
                value={filters?.from_date}
                max={filters?.to_date}
                className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />
            </div>

            <div>
              <FormLabel className="text-sm font-semibold text-gray-600 mb-1 block">
                To Date<span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                type="date"
                value={filters.to_date}
                className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                 
                }
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                disabled={!filters?.from_date || !filters?.to_date||dataLoading}
                className="p-2 bg-mustard text-white w-[100px]"
                onClick={() => fetchCommissions(1)}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  setFilters({ status: "", from_date: "", to_date: "" });
                  fetchCommissions(2);
                }}
                className="p-2 bg-red-400 text-white hover:bg-red-500 rounded-md w-[100px]"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border border-gray-200 h-[100vh]">
            <Table className="w-full text-sm">
              <Table.Thead className="bg-mustard text-white">
                <Table.Tr>
                  <Table.Th className="p-3 text-left uppercase">
                    Sr. No.
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    AWB No
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    Customer
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    Booking Date
                  </Table.Th>
                  <Table.Th className="p-3  uppercase text-right">
                    Freight
                  </Table.Th>
                  <Table.Th className="p-3  uppercase text-right">FSC</Table.Th>
                  <Table.Th className="p-3  uppercase text-right">Total</Table.Th>
                  <Table.Th className="p-3  uppercase text-right">
                    Commission %
                  </Table.Th>
                  <Table.Th className="p-3  uppercase text-right">
                    Commission
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    Status
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {commissions.length == 0 && !dataLoading ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan="9"
                      className="text-center py-10 text-gray-500"
                    >
                      No Data Found!!
                    </Table.Td>
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
                  commissions.map((commission: any,index:number) => (
                    <Table.Tr
                      key={commission.commission_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <Table.Td className="py-3 px-4">
                        {Number(pagination?.page - 1) * 20  + index + 1}
                      </Table.Td>
                      <Table.Td className="p-3 font-mono">
                        {commission.airwaybilno}
                      </Table.Td>
                      <Table.Td className="p-3">
                        {commission.customer_name}
                      </Table.Td>
                      <Table.Td className="p-3">
                        {formatDate(commission?.booking_date)}
                      </Table.Td>
                      <Table.Td className="p-3  text-right">
                        ₹{parseFloat(commission.freight_amount).toFixed(2)}
                      </Table.Td>
                      <Table.Td className="p-3  text-right">
                        ₹{parseFloat(commission.fsc_amount).toFixed(2)}
                      </Table.Td>
                      <Table.Td className="p-3  text-right">
                        ₹{parseFloat(commission.total_amount).toFixed(2)}
                      </Table.Td>
                      <Table.Td className="p-3  text-right">
                        {commission.commission_rate}%
                      </Table.Td>
                      <Table.Td className="p-3 font-semibold text-green-600 text-right">
                        ₹{parseFloat(commission.commission_amount).toFixed(2)}
                      </Table.Td>
                      <Table.Td className="p-3">
                        {getStatusBadge(commission.commission_status)}
                      </Table.Td>
                    </Table.Tr>
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
