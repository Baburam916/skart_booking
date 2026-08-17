import { useState, useEffect } from "react";
import Button from "../../../../base-components/Button";
import Table from "../../../../base-components/Table";
import { FormInput, FormLabel } from "../../../../base-components/Form";
import { commongetrequest } from "../../../../AllServices/services";
import { formatDateProper } from "../../../../utils/helper";
import CommonPagination from "../../Pagination";
import {
  FiDollarSign,
  FiFileText,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

export default function AffiliateStatement() {
  const [statements, setStatements] = useState([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,

    total: 0,
  });
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchStatements(1);
  }, [pagination?.page]);
  const handlePagechange = (e: number) => {
    setPagination((pre: any) => ({ ...pre, page: e }));
  };
  const fetchStatements = async (value: any) => {
    const { from_date, to_date } = filters;
    setDataLoading(true);
    const params: any = {
      limit: 20,
      page: pagination?.page,
    };
    if (from_date) {
      params.from_date = from_date;
    }
    if (to_date) {
      params.to_date = to_date;
    }

    setDataLoading(true);

    try {
      const response =
        value == 1
          ? await commongetrequest(`admin/affiliate/statement`, {
              params: params,
            })
          : await commongetrequest(`admin/affiliate/statement`);
      if (response?.status == 200) {
        setStatements(response.data.data || []);
        setPagination((prev) => ({ ...prev, ...response?.data?.pagination }));
      } else {
        setStatements([]);
        setPagination((prev) => ({
          page: 1,

          total: 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const getTransactionTypeClass = (type) => {
    switch (type) {
      case "COMMISSION":
        return "badge-success";
      case "PAYOUT":
        return "badge-danger";
      case "ADJUSTMENT":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  };
  const getTransactionIcon = (type: any) => {
    switch (type) {
      case "COMMISSION":
        return <FiTrendingUp className="text-green-600" size={20} />;
      case "PAYOUT":
        return <FiTrendingDown className="text-red-600" size={20} />;
      case "ADJUSTMENT":
        return <FiDollarSign className="text-blue-600" size={20} />;
      default:
        return <FiFileText className="text-gray-600" size={20} />;
    }
  };
  const getTransactionTypeBadge = (type: any) => {
    const typeMap: any = {
      COMMISSION: {
        label: "Commission",
        class: "bg-green-100 text-green-800",
      },
      PAYOUT: { label: "Payout", class: "bg-red-100 text-red-800" },
      ADJUSTMENT: { label: "Adjustment", class: "bg-blue-100 text-blue-800" },
    };
    const typeInfo = typeMap[type] || {
      label: type,
      class: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${typeInfo.class}`}
      >
        {typeInfo.label}
      </span>
    );
  };
  return (
    <div title="Account Statement - sKart">
      <div className=" mx-auto px-5 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Account Statement
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          {/* Filters */}
          <div className="grid gap-4 mb-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <FormLabel className="text-sm font-semibold text-gray-600 mb-1 block">
                From Date <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                type="date"
                className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                value={filters.from_date}
                max={filters?.to_date}
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
                min={filters?.from_date}
                className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                value={filters.to_date}
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => fetchStatements(1)}
                disabled={
                  !filters?.from_date || !filters?.to_date || dataLoading
                }
                className="p-2 bg-mustard text-white w-[100px]"
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  setFilters({ from_date: "", to_date: "" });
                  fetchStatements(2);
                }}
                className=" bg-red-300 hover:bg-red-400 text-white p-2 rounded-md transition w-[100px]"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border border-gray-200 h-[100vh]">
            <Table className="w-fulltext-sm">
              <Table.Thead
                variant="dark"
                className="thead-primary table-sorting bg-mustard text-white"
              >
                <Table.Tr>
                  <Table.Th className="p-3 text-left uppercase">
                    Sr. No.
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">Date</Table.Th>
                  <Table.Th className="p-3 text-left uppercase">Type</Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    Description
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">Debit</Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    Credit
                  </Table.Th>

                  <Table.Th className="p-3 text-left uppercase">
                    Balance
                  </Table.Th>
                  <Table.Th className="p-3 text-left uppercase">
                    Remarks
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {statements.length === 0 && !dataLoading ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan="7"
                      className="text-center py-10 text-gray-500"
                    >
                      No transactions found
                    </Table.Td>
                  </Table.Tr>
                ) : dataLoading ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan="7"
                      className="text-center  text-gray-500 h-[100vh]"
                    >
                      <div className={`flex items-center justify-center `}>
                        <div className="animate-spin rounded-full border-t-4 border-primary border-t-primary h-12 w-12"></div>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  statements?.map((statement: any, index: number) => (
                    <Table.Tr
                      key={statement?.statement_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <Table.Td className="py-3 px-4">
                        {Number(pagination?.page - 1) * 20 + index + 1}
                      </Table.Td>
                      <Table.Td className="p-3">
                        {formatDateProper(statement?.transaction_date)}
                      </Table.Td>
                      <Table.Td className="p-3">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(statement?.transaction_type)}
                          {getTransactionTypeBadge(statement?.transaction_type)}
                        </div>
                      </Table.Td>

                      <Table.Td className="p-3">
                        <div className="text-sm text-gray-900 max-w-md">
                          {statement?.description}
                        </div>
                        {statement.remarks && (
                          <div className="text-xs text-gray-500 mt-1">
                            {statement?.remarks}
                          </div>
                        )}
                      </Table.Td>

                      <Table.Td className="p-3 font-semibold text-green-600">
                        {parseFloat(statement?.credit_amount) > 0 ? (
                          <span className="text-sm font-semibold text-green-600">
                            +₹
                            {parseFloat(
                              statement?.credit_amount
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </Table.Td>

                      <Table.Td className="p-3 font-semibold text-red-600">
                        {parseFloat(statement?.debit_amount) > 0 ? (
                          <span className="text-sm font-semibold text-red-600">
                            -₹
                            {parseFloat(statement?.debit_amount).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </Table.Td>

                      <Table.Td className="p-3 font-bold text-gray-800">
                        <span className="text-sm font-bold text-gray-900">
                          ₹
                          {(Number(statement?.balance) || 0).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </Table.Td>

                      <Table.Td className="p-3 text-gray-500 text-xs">
                        {statement?.remarks || "-"}
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
