import React, { useState, useEffect, useCallback } from "react";
import { FormInput } from "../../base-components/Form";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      +func(...args);
    }, delay);
  };
};

const Main = ({ apiFunction, setBooking, booking, appliedOn }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  // const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [input, setInput] = useState("");

  const fetchSuggestions = useCallback(
    debounce(async (inputValue: any) => {
      const countryCode = localStorage.getItem("code");

      try {
        if (inputValue) {
          const response: any = await apiFunction(
            countryCode,
            booking?.destination_pincode,
            inputValue
          );
          if (response?.status == 200) {
            setFilteredSuggestions(response?.data?.data || []);
            setShowSuggestions(true);
          } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setFilteredSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      }
    }, 1000),
    [] // Ensure dependencies are listed here if any
  );

  // useEffect(() => {
  //   setInput(booking?.city || "")
  // }, [booking?.city]);

  useEffect(() => {
    fetchSuggestions(booking?.city);
  }, [booking?.city]);

  const handleChange = (e) => {
    setBooking((prev) => ({
      ...prev,
      city: e.target.value,
    }));
    // setActiveSuggestionIndex(0);
  };

  const onClick = (data) => {
    setFilteredSuggestions([]);
    // setInput(data?.city_area);
    setBooking((prev: any) => ({
      ...prev,
      // destination_pincode: data?.zipcode,
      city: data?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    // setActiveSuggestionIndex(0);
    setShowSuggestions(false);
  };

  // const handleKeyDown = (e) => {
  //   if (e.keyCode == 13) {
  //     setInput(filteredSuggestions[activeSuggestionIndex]);
  //     setActiveSuggestionIndex(0);
  //     setShowSuggestions(false);
  //   } else if (e.keyCode === 38) {
  //     if (activeSuggestionIndex == 0) {
  //       return;
  //     }
  //     setActiveSuggestionIndex(activeSuggestionIndex - 1);
  //   } else if (e.keyCode == 40) {
  //     if (activeSuggestionIndex + 1 == filteredSuggestions.length) {
  //       return;
  //     }
  //     setActiveSuggestionIndex(activeSuggestionIndex + 1);
  //   }
  // };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length > 0 ? (
      <div className="relative">
        <ul
          className={`border-gray-300 border-t-0 bg-white rounded absolute z-10 top-0 ${
            appliedOn == "booking" ? "w-96" : "w-72"
          }`}
        >
          {filteredSuggestions.map((elem, index) => {
            return (
              <li
                className="cursor-pointer text-gray-400  text-sm font-medium p-1 px-2 border-b border-x "
                key={index}
                onClick={() => onClick(elem)}
              >
                {`${elem?.city_area}${elem?.state ? ` , ${elem.state}` : ""}`}
              </li>
            );
          })}
        </ul>
      </div>
    ) : (
      <div className="text-gray-400 p-1.5 text-sm">No Data Found</div>
    );
  };

  return (
    <>
      <FormInput
        type="text"
        onChange={handleChange}
        // onBlur={() => setShowSuggestions(false)}
        // onKeyDown={handleKeyDown}
        className="w-full rounded-0 h-10"
        placeholder="Select Destination City"
        value={booking?.city}
      />
      {showSuggestions && booking?.city && <SuggestionsListComponent />}
    </>
  );
};

export default Main;
