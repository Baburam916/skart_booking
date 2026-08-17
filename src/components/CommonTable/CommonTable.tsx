// import LoadingIcon from "../../../../base-components/LoadingIcon";
// import Table from "../../../../base-components/Table";
// import useFetch from "../../GetCustomHook.tsx/GetCustomHook";
import LoadingIcon from "../../base-components/LoadingIcon";
import Table from "../../base-components/Table";
import styles from "./commontable.module.css";
// import IsLoading from "../isLoading/isLoading";

export default function CommonTable(data: any) {
  const {
    page,
    heightTable,
    columns,
    row,
    currentPage,
    loading,
    height,
    bgcolor,
    bgstyle,
    style
  } = data;

  return (
    <>
      <div className={`${!loading ? "bg-white overflow-auto" : "" } ${height?height:""} `}>
        {loading ? (
          <LoadingIcon />
        ) : (
          <div
            className={`${height ? "overflow-y-auto " : ""} ${style?style:""}`}
            style={height ? { maxHeight: height } : {}}
          >
            <Table sm striped >
              <Table.Thead className="bg-mustard text-white whitespace-nowrap">
                <Table.Tr>
                  <Table.Th className="text-center">S.NO.</Table.Th>
                  {columns?.map((col: any, ind: number) => (
                    <Table.Th key={ind} className={col.text}>
                      {col.headerName}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {row?.map((item: any, rowIndex: number) => (
                  <Table.Tr
                    key={rowIndex}
                    className={`text-center capitalize whitespace-nowrap ${
                      bgcolor
                        ? item?.purchase_type == 1
                          ? "bg-red-200"
                          : item?.purchase_type == 2
                          ? "bg-orange-100"
                          : item?.purchase_type == 3
                          ? "bg-purple-200"
                          : ""
                        : ""
                    }
                     ${bgstyle ? (item?.void == 1 ? "bg-red-200" : "") : ""}
                    `}
                  >
                    <Table.Td>
                      {/* {page ? page * 20 + rowIndex + 1 : rowIndex + 1}. */}
                      {currentPage ? (currentPage - 1) * 10 + rowIndex + 1 : page ? page * 20 + rowIndex + 1 : rowIndex + 1}.

                    </Table.Td>
                    {columns?.map((col: any, colIndex: number) => (
                      <Table.Td
                        key={colIndex}
                        className={`${col?.text} ${col?.style}`}
                      >
                        {item[col.field] ?? ""}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}