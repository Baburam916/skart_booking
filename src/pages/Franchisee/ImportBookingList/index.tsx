import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import LoadingIcon from "../../../base-components/LoadingIcon";
import CommonPagination from "../Pagination";
import { downloadAttachment, formatDate, get90DaysBeforeDate, getCurrentDate, indianFormat, useDebounce } from "../../../utils";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { bookShipmentApi, getImportBookingListApi, getShipmentTypesApi } from "../../../AllServices/config.service";
import Lucide from "../../../base-components/Lucide";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../ContextProvider/AlertContext";


const Index: React.FC = () => {
    const [fromDate, setFromDate] = useState(get90DaysBeforeDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState<number>(0);
    const [shipmentTypes, setShipmentTypes] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState([]);
    const { franchiseeId, availableCreditLimit } = useFranchisee();
    const [totalpages, setTotalPages] = useState<number>(1);
    const navigate = useNavigate();
    const [spinner, setSpinner] = useState({ status: false, index: "" });
    const { showAlert } = useAlert();

    const handlePagechange = (e: number) => {
        setPage(e);
    };

    const getData = async () => {
        setIsLoading(true);
        try {
            const response: any = await getImportBookingListApi(
                franchiseeId,
                fromDate,
                toDate,
                page,
                debouncedSearch.trim()
            );
            setBookingData(response?.data?.data);
            setTotalPages(Math.ceil(Number(response?.data?.total) / 20));
            setIsLoading(false);
        } catch (error) {
            // console.log(error);
            setIsLoading(false);
        }
    };

    const handleEdit = (data: any) => {
        const booking = {
            ...JSON.parse(data?.request_data),
            startPoint: "importlisting",
            airwaybillno: data?.airwaybilno,
            is_draft: "",
        };
        navigate("/franchisee/booking/book_courier_franchisee", {
            state: { booking },
        });
    };

    const handleBooking = async (data: any, index: any) => {
        if (Number(availableCreditLimit || 0) < Number(JSON.parse(data?.request_data)?.shipment_charges?.grand_total_with_gst)) {
            showAlert("Available credit limit is less than shipment rate", "warning");
            return
        }
        setSpinner(({ status: true, index: index }));
        try {
            const res = await bookShipmentApi({
                ...JSON.parse(data?.request_data),
                airwaybillno: data?.airwaybilno,
                is_draft:"",
            });
            if (res?.data?.status == 200) {
                getData();
                showAlert("Shipment Booked Successfully", "success");
            } else if (res?.response?.status == 500) {
                showAlert("Internal Server Error", "error");
            } else {
                showAlert(res?.data?.message, "error");
            }
        } catch (error) {
            showAlert("Something Went Wrong", "error");
        } finally {
            setSpinner(({ status: false, index: "" }));
        }
    };

    const handleTrack = async (awb: string) => {
        const url = `/franchisee/tracking?awb=${awb}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        getShipmentTypesApi()?.then((res: any) =>
            setShipmentTypes(res?.data?.data)
        );
    }, []);


    useEffect(() => {
        getData();
    }, [fromDate, toDate, page, debouncedSearch]);

    return (
        <div className="w-full max-w-8xl  p-3 px-2 lg:p-6 lg:px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16 z-[0] relative">
            <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-4  items-end gap-6 w-full">
                <div className="w-full">
                    <h1 className="text-2xl font-bold ">Import Draft Booking</h1>
                </div>
                <div className="w-full">
                    <FormLabel htmlFor="modal-form-5">
                        FROM DATE <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                        id="modal-form-5"
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <FormLabel htmlFor="modal-form-5">
                        TO DATE <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                        id="modal-form-5"
                        type="date"
                        value={toDate}
                        min={fromDate}
                        max={getCurrentDate()}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>


                <div className="flex w-full items-end">
                    <FormInput
                        type="text"
                        placeholder="Enter Draft Booking No."
                        value={search}
                        className="w-2/3"
                        onChange={(e) => {
                            setSearch(e.target.value.replace(/\s/g, ""));
                            setPage(0);
                        }}
                    />
                    <Button
                        className="w-1/3 rounded-lg bg-red-500 hover:bg-red-600 text-white ml-4"
                        onClick={() => {
                            setSearch("");
                            setPage(0);
                        }}
                    >
                        RESET
                    </Button>
                </div>
            </div>

            <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

            {bookingData?.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table className="table table-text-small mb-0 border">
                        <Table.Thead
                            variant="dark"
                            className="thead-primary table-sorting bg-mustard"
                        >
                            <Table.Tr className="text-center ">
                                <Table.Th className="whitespace-wrap border">SR.NO.</Table.Th>
                                <Table.Th className="whitespace-wrap border min-w-40">
                                    BOOKING DATE
                                </Table.Th>
                                <Table.Th className="whitespace-wrap border min-w-40">
                                    VENDOR NAME
                                </Table.Th>
                                <Table.Th className="whitespace-wrap border">DRAFT BOOKING NO.</Table.Th>
                                <Table.Th className="whitespace-wrap border min-w-32">
                                    ORIGIN
                                </Table.Th>
                                <Table.Th className="whitespace-wrap border">
                                    DESTINATION
                                </Table.Th>
                                <Table.Th className="whitespace-wrap border">
                                    SHIPMENT TYPE
                                </Table.Th>
                                <Table.Th className="whitespace-wrap border">
                                    AMOUNT (₹)
                                </Table.Th>

                                {/* <Table.Th className="whitespace-wrap border">
                                    DRAFT AWB LABEL
                                </Table.Th> */}
                                <Table.Th className="whitespace-wrap border">ACTION</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {bookingData?.map((data, index) => (
                                <Table.Tr
                                    key={index}
                                    className={`text-center intro-x ${index % 2 === 1 ? "bg-yellow-50" : ""
                                        } hover:bg-yellow-100`}
                                >
                                    <Table.Td className=" whitespace-wrap border">
                                        {page * 20 + (index + 1)}.
                                    </Table.Td>
                                    <Table.Td className=" whitespace-wrap border capitalize">
                                        {formatDate(data?.created_date) || "-"}
                                    </Table.Td>
                                    <Table.Td className=" whitespace-wrap border capitalize">

                                        {JSON.parse(data?.request_data)?.courier_name || "-"}
                                    </Table.Td>
                                    <Table.Td className=" whitespace-wrap border">
                                        <p
                                            className="text-mustard font-bold"
                                            // onClick={() => {
                                            //     handleTrack(data?.airwaybilno);
                                            // }}
                                        >
                                            {data?.airwaybilno || "-"}
                                        </p>
                                    </Table.Td>

                                    <Table.Td className=" whitespace-wrap border">
                                        {data?.origin_city || "-"}
                                    </Table.Td>
                                    <Table.Td className=" whitespace-wrap border">
                                        {" "}
                                        {data?.destination_city || "-"}
                                    </Table.Td>
                                    <Table.Td className=" whitespace-wrap border">

                                        {shipmentTypes?.find((item: any) => item?.booking_shipment_type_id == JSON.parse(data?.request_data)?.shipment_type)?.shipment_type || ""}
                                    </Table.Td>
                                    <Table.Td className=" whitespace-wrap border">
                                        {indianFormat(JSON.parse(data?.request_data)?.shipment_charges?.grand_total_with_gst)}
                                    </Table.Td>

                                    {/* <Table.Td className=" whitespace-wrap border">
                                        <div className="flex justify-center">
                                            {" "}
                                            <Lucide
                                                icon="FileText"
                                                className="stroke-2.5 text-mustard cursor-pointer"
                                                onClick={() =>
                                                    downloadAttachment(
                                                        JSON.parse(data?.response_data)?.data[0]?.dispatch_url,
                                                        data?.airwaybilno
                                                    )
                                                }
                                            />
                                        </div>
                                    </Table.Td> */}
                                    <Table.Td className=" whitespace-nowrap border">
                                        {new Date < new Date(data?.valid_till) ?
                                            (<div className="flex justify-between gap-3">
                                                <Button className="bg-blue-500 py-1 text-white flex items-center" onClick={() => handleEdit(data)}>
                                                    <Lucide
                                                        icon="Pencil"
                                                        className="mr-1 stroke-2 text-white cursor-pointer w-4 h-4 mb-1"

                                                    />
                                                    Edit
                                                </Button>
                                                <Button className="bg-mustard py-1 text-white flex items-center" onClick={() => handleBooking(data, index)} disabled={index == spinner?.index && spinner?.status == true}>
                                                    <Lucide
                                                        icon="Boxes"
                                                        className="mr-1 stroke-2 text-white cursor-pointer w-4 h-4 mb-1"

                                                    />
                                                    Final Booking    {spinner?.status == true && index == spinner?.index ? (
                                                        <LoadingIcon
                                                            icon="puff"
                                                            color="white"
                                                            className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                                        />
                                                    ) : <></>}
                                                </Button>


                                            </div>) : <span className="text-red-500">Expired</span>}
                                    </Table.Td>

                                    {/* <Table.Td className=" whitespace-wrap border">
                                        <div className="flex gap-2 items-end">
                                            {deviceType !== "Desktop" && (
                                                <Link to="tel:+919821300921">
                                                    <Lucide
                                                        icon="PhoneCall"
                                                        className="stroke-2.5 text-mustard cursor-pointer mb-1"
                                                    />
                                                </Link>
                                            )}
                                            <Link
                                                target="_blank"
                                                to={`https://mail.google.com/mail/u/0/?fs=1&to=cs@skart-express.com&su=Query+for+AWB+${data?.airwaybilno
                                                    }&body=Hi+Team+sKart,%0A%0AI+want+to+raise+a+query+for+${data?.airwaybilno
                                                    }+for+Network+${productTypes.find(
                                                        (item) => item.product_id === data?.courier_id
                                                    )?.parent_vendor || "-"
                                                    }.%0A%0AThanks,%0A${franchiseeName}&tf=cm`}
                                            >
                                                <Lucide
                                                    icon="Mail"
                                                    className="stroke-2.5 text-mustard cursor-pointer mb-1"
                                                />
                                            </Link>

                                            <Link
                                                to={`https://wa.me/919821300921?text=${encodeURIComponent(
                                                    `Hi Team sKart,\n\nI want to raise a query for ${data?.airwaybilno
                                                    } for Network ${productTypes.find(
                                                        (item) => item.product_id === data?.courier_id
                                                    )?.parent_vendor || "-"
                                                    }.\n\nThanks,\n${franchiseeName}`
                                                )}`}
                                                target="_blank"
                                            >
                                                <svg
                                                    fill="#EFB847"
                                                    width="32px"
                                                    height="32px"
                                                    viewBox="-207.43 -207.43 1155.68 1155.68"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    stroke="#EFB847"
                                                    stroke-width="4.444944"
                                                    className="cursor-pointer"
                                                >
                                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                    <g
                                                        id="SVGRepo_tracerCarrier"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke="#CCCCCC"
                                                        stroke-width="16.298128"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M630.056 107.658C560.727 38.271 468.525.039 370.294 0 167.891 0 3.16 164.668 3.079 367.072c-.027 64.699 16.883 127.855 49.016 183.523L0 740.824l194.666-51.047c53.634 29.244 114.022 44.656 175.481 44.682h.151c202.382 0 367.128-164.689 367.21-367.094.039-98.088-38.121-190.32-107.452-259.707m-259.758 564.8h-.125c-54.766-.021-108.483-14.729-155.343-42.529l-11.146-6.613-115.516 30.293 30.834-112.592-7.258-11.543c-30.552-48.58-46.689-104.729-46.665-162.379C65.146 198.865 202.065 62 370.419 62c81.521.031 158.154 31.81 215.779 89.482s89.342 134.332 89.311 215.859c-.07 168.242-136.987 305.117-305.211 305.117m167.415-228.514c-9.176-4.591-54.286-26.782-62.697-29.843-8.41-3.061-14.526-4.591-20.644 4.592-6.116 9.182-23.7 29.843-29.054 35.964-5.351 6.122-10.703 6.888-19.879 2.296-9.175-4.591-38.739-14.276-73.786-45.526-27.275-24.32-45.691-54.36-51.043-63.542-5.352-9.183-.569-14.148 4.024-18.72 4.127-4.11 9.175-10.713 13.763-16.07 4.587-5.356 6.116-9.182 9.174-15.303 3.059-6.122 1.53-11.479-.764-16.07-2.294-4.591-20.643-49.739-28.29-68.104-7.447-17.886-15.012-15.466-20.644-15.746-5.346-.266-11.469-.323-17.585-.323-6.117 0-16.057 2.296-24.468 11.478-8.41 9.183-32.112 31.374-32.112 76.521s32.877 88.763 37.465 94.885c4.587 6.122 64.699 98.771 156.741 138.502 21.891 9.45 38.982 15.093 52.307 19.323 21.981 6.979 41.983 5.994 57.793 3.633 17.628-2.633 54.285-22.19 61.932-43.616 7.646-21.426 7.646-39.791 5.352-43.617-2.293-3.826-8.41-6.122-17.585-10.714"
                                                        ></path>
                                                    </g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M630.056 107.658C560.727 38.271 468.525.039 370.294 0 167.891 0 3.16 164.668 3.079 367.072c-.027 64.699 16.883 127.855 49.016 183.523L0 740.824l194.666-51.047c53.634 29.244 114.022 44.656 175.481 44.682h.151c202.382 0 367.128-164.689 367.21-367.094.039-98.088-38.121-190.32-107.452-259.707m-259.758 564.8h-.125c-54.766-.021-108.483-14.729-155.343-42.529l-11.146-6.613-115.516 30.293 30.834-112.592-7.258-11.543c-30.552-48.58-46.689-104.729-46.665-162.379C65.146 198.865 202.065 62 370.419 62c81.521.031 158.154 31.81 215.779 89.482s89.342 134.332 89.311 215.859c-.07 168.242-136.987 305.117-305.211 305.117m167.415-228.514c-9.176-4.591-54.286-26.782-62.697-29.843-8.41-3.061-14.526-4.591-20.644 4.592-6.116 9.182-23.7 29.843-29.054 35.964-5.351 6.122-10.703 6.888-19.879 2.296-9.175-4.591-38.739-14.276-73.786-45.526-27.275-24.32-45.691-54.36-51.043-63.542-5.352-9.183-.569-14.148 4.024-18.72 4.127-4.11 9.175-10.713 13.763-16.07 4.587-5.356 6.116-9.182 9.174-15.303 3.059-6.122 1.53-11.479-.764-16.07-2.294-4.591-20.643-49.739-28.29-68.104-7.447-17.886-15.012-15.466-20.644-15.746-5.346-.266-11.469-.323-17.585-.323-6.117 0-16.057 2.296-24.468 11.478-8.41 9.183-32.112 31.374-32.112 76.521s32.877 88.763 37.465 94.885c4.587 6.122 64.699 98.771 156.741 138.502 21.891 9.45 38.982 15.093 52.307 19.323 21.981 6.979 41.983 5.994 57.793 3.633 17.628-2.633 54.285-22.19 61.932-43.616 7.646-21.426 7.646-39.791 5.352-43.617-2.293-3.826-8.41-6.122-17.585-10.714"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </Link>
                                        </div>
                                    </Table.Td> */}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
            ) : isLoading ? (
                <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
            ) : (
                <p className="text-gray-400 text-center">No Data Found!</p>
            )}

            {bookingData?.length > 0 && (
                <CommonPagination
                    totalpages={totalpages}
                    onPageChange={handlePagechange}
                    page={page + 1}
                />
            )}
        </div>
    );
};

export default Index;
