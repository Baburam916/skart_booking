import React, { useState, useEffect, useRef } from "react";
import { FormInput } from "../../base-components/Form";
import { commongetrequest } from "../../AllServices/services";
import { useDebounce } from "../../utils";
import ZipcodeLookupModal from "./ZipcodeLookupModal";

const CommonSearchableAll = (props: any) => {
  const {
    apiEndpoint,
    placeholder,
    zIndex,
    selecteddata,
    setSelecteddata,
    fun1,
    funtoempty,
    key1,
    border,
    comingselectedname,
    comingselectedid,
    key2,
    key2value,
    key3,
    key3value,
    questionmark,
    addcomingname2,
    addcomingname3,
    directapply,
    forwhat,
    openhandedfun,
    id = true,
    className,
    refValue,
    localData,
    enableZipcodeLookup,
    countryName,
    lookupType = "zipcode",
    lookupZipcode,
  } = props;
  const [query, setQuery] = useState(selecteddata[comingselectedname] || "");
  const [isUserTyping, setIsUserTyping] = useState(id ? false : true); // Track whether the user is typing
  const debouncedSearchTerm = useDebounce<any>(
    selecteddata[comingselectedname] || "",
    500
  );
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [zipcodeLookupOpen, setZipcodeLookupOpen] = useState(false);
  // Create a reference for the component container
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (localData) {
      if (isUserTyping && debouncedSearchTerm.length > 0) {
        const filtered = localData.filter((item: any) =>
          item?.[comingselectedname]
            ?.toLowerCase()
            ?.includes(String(debouncedSearchTerm).toLowerCase()),
        );
        setData(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
      return;
    }
    if (isUserTyping && debouncedSearchTerm.length > 2) {
      getdata();
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, apiEndpoint, isUserTyping, localData]);
  const getdata = async () => {
    try {
      setIsLoading(true);
      let main;
      if (directapply) {
        main = apiEndpoint + debouncedSearchTerm;
      }
      const res = await commongetrequest(
        `${directapply
          ? `${apiEndpoint + debouncedSearchTerm}`
          : `${apiEndpoint}${!questionmark ? "?" : "&"
          }${key1}=${debouncedSearchTerm}${key2 ? `&${key2}=key2value` : ""
          }${key3 ? `&${key3}=key3value` : ""}`
        }`
      );
      if (res?.status === 200) {
        setData(res?.data?.data || []);
        setShowSuggestions(true);
      } else {
        setData([]);
        setShowSuggestions(false);
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelect = (item: any) => {
    setIsUserTyping(false);
    setQuery(item[comingselectedname]);
    if (forwhat) {
      fun1(item, forwhat);
    } else {
      fun1(item);
    }
    setSelecteddata(item);
    setShowSuggestions(false);
  };
  const handleZipcodeLookupApply = (result: { zipcode?: string; city?: string }) => {
    const primaryValue =
      lookupType === "city" ? result?.city || "" : result?.zipcode || "";
    const item: any = { [comingselectedname]: primaryValue };
    if (comingselectedid) {
      item[comingselectedid] =
        lookupType === "city" ? primaryValue : result?.city || "";
    }
    if (addcomingname2) item[addcomingname2] = result?.city || "";
    if (addcomingname3) item[addcomingname3] = "";

    setIsUserTyping(false);
    setQuery(item[comingselectedname]);
    setSelecteddata(item);
    if (forwhat) {
      fun1(item, forwhat);
    } else {
      fun1(item);
    }
    setShowSuggestions(false);
    setZipcodeLookupOpen(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsUserTyping(true);
    setSelecteddata((pre: any) => ({
      ...pre,
      [comingselectedname]: value,
    }));
    if (!value) {
      setSelecteddata({
        [comingselectedid]: "",
        [comingselectedname]: "",
      });
      if (forwhat) {
        funtoempty(forwhat);
      } else {
        funtoempty();
      }
    }
    if (openhandedfun) {
      openhandedfun(forwhat, value);
    }
  };
  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={wrapperRef} className="relative w-full mx-auto">
      <FormInput
        type="text"
        ref={refValue}
        className={`w-full ${border ? "border border-red-400" : ""} ${className ? className : ""}`}
        placeholder={placeholder || "Search..."}
        value={selecteddata[comingselectedname]}
        onChange={handleInputChange}
      />
      {isLoading && (
        <div className="absolute top-[80%] left-0 right-0 bg-white p-2 border border-gray-300 mt-1">
          Loading...
        </div>
      )}
      {showSuggestions && !isLoading && (
        <ul
          className={`absolute top-[80%] left-0 right-0 bg-white border border-gray-300 mt-1 rounded max-h-60 overflow-y-auto z-${zIndex ? zIndex : "40"
            }`}
        >
          {data?.length > 0 ? (
            data?.map((item: any, index: number) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {`${item[comingselectedname]}${addcomingname2 && item[addcomingname2]
                    ? ` - ${item[addcomingname2]}`
                    : ""
                  }${addcomingname3 && item[addcomingname3]
                    ? `, ${item[addcomingname3]}`
                    : ""
                  }`}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500 flex items-center justify-between gap-2">
              <span>No results found</span>
              {enableZipcodeLookup && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setZipcodeLookupOpen(true);
                  }}
                  className="text-mustard font-semibold text-xs whitespace-nowrap shrink-0 hover:underline"
                >
                  {lookupType === "city" ? "City Lookup" : "Zipcode Lookup"}
                </button>
              )}
            </li>
          )}
        </ul>
      )}
      {enableZipcodeLookup && (
        <ZipcodeLookupModal
          open={zipcodeLookupOpen}
          onClose={() => setZipcodeLookupOpen(false)}
          countryName={countryName}
          mode={lookupType}
          zipcodeValue={
            lookupZipcode !== undefined
              ? lookupZipcode
              : lookupType !== "city"
                ? selecteddata?.[comingselectedname]
                : undefined
          }
          cityValue={
            lookupType === "city" ? selecteddata?.[comingselectedname] : undefined
          }
          onApply={handleZipcodeLookupApply}
        />
      )}
    </div>
  );
};
export default CommonSearchableAll;