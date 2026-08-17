import axios from "axios";

export const hostname = window.location.hostname;
const baseURL =
  hostname == "localhost"
    ? "http://localhost/api/v1"
    : hostname == "devbooking.skart-express.com"
    ? "https://devapiv2.skart-express.com/api/v1"
    : "https://apiv2.skart-express.com/api/v1";

export const GET = async (url: string) => {
  try {
    const response = await axios.get(baseURL + url);

    if (response.status == 401) {
      window.location.href = "/";
    }
    return response;
  } catch (err: any) {
    if (err?.response?.status == 401 && url !== "/auth/verify/4") {
      window.location.href = "/";
    }
    return err;
  }
};

export const POST = async (url: string, data: any) => {
  try {
    const response = await axios.post(baseURL + url, data, {
      withCredentials: true,
    });

    if (response.status == 401) {
      window.location.href = "/";
    }
    return response;
  } catch (err: any) {
    if (err?.response?.status == 401 && url !== "/auth/verify/4") {
      window.location.href = "/";
    }

    return err;
  }
};

export const PUT = async (url: string, data: any) => {
  try {
    const response = await axios.put(baseURL + url, data);

    if (response.status == 401) {
      window.location.href = "/";
    }

    return response;
  } catch (err: any) {
    if (err?.response?.status == 401 && url !== "/auth/verify/4") {
      window.location.href = "/";
    }

    return err;
  }
};

export const PATCH = async (url: string, data: any) => {
  try {
    const response = await axios.patch(baseURL + url, data);
    if (response.status == 401) {
      window.location.href = "/";
    }

    return response;
  } catch (err: any) {
    if (err?.response?.status == 401 && url !== "/auth/verify/4") {
      window.location.href = "/";
    }

    return err;
  }
};

export const DELETE = async (url: string) => {
  try {
    const response = await axios.delete(baseURL + url);

    if (response.status == 401) {
      window.location.href = "/";
    }

    return response;
  } catch (err: any) {
    if (err?.response?.status == 401 && url !== "/auth/verify/4") {
      window.location.href = "/";
    }
    return err;
  }
};

export const commongetrequest = async (endpoint?: string, params?: any) => {
  if (params) {
    try {
      const response = await axios.get(baseURL + `/${endpoint}`, params);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "auth/verify/4") {
        window.location.href = "/";
      }
      return err;
    }
  } else {
    try {
      const response = await axios.get(baseURL + `/${endpoint}`);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "auth/verify/4") {
        window.location.href = "/";
      }
      return err;
    }
  }
}
// common post request with only endpoint and data

export const commonpostrequest = async (endpoint?: string | undefined, obj?: any, extra?: any) => {
  try {

    const response = await axios.post(baseURL + `/${endpoint}`, obj, extra ? extra : "")
    return response
  } catch (err: any) {
    if (err?.response?.status == 401 && endpoint !== "/auth/verify/4") {
      window.location.href = "/";
    }
    return err;
  }
}


export const commonputrequest = async (endpoint?: string, obj?: any) => {
  try {
    const response = await axios.put(baseURL + `/${endpoint}`, obj)
    return response
  } catch (err: any) {
    if (err?.response?.status == 401 && endpoint !== "auth/verify/4") {
      window.location.href = "/";
    }
    return err
  }
}
export const commonpatchrequest = async (endpoint?: string, obj?: any) => {
  if (obj) {
    try {
      const response = await axios.patch(baseURL + `/${endpoint}`, obj);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "auth/verify/4") {
        window.location.href = "/";
      }
      return err;
    }
  } else {
    try {
      const response = await axios.patch(baseURL + `/${endpoint}`);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "/auth/verify/4") {
        window.location.href = "/";
      }
      return err;
    }
  }

};


export const universalpost = async (port?: string, endpoint?: string, data?: any) => {
  // console.log(data,"data")
  try {
    const response = await axios.post(
      `http://localhost:${port}/api/v1/${endpoint}`, data
    );
    return response;
  } catch (err: any) {
    return err;
  }
}
export const universalget = async (
  port?: string,
  endpoint?: string,
  params?: any

) => {
  // console.log(data,"data")
  try {
    const response = await axios.get(
      `http://localhost:${port}/api/v1/${endpoint}`, params ? params : "");
    return response;
  } catch (err: any) {
    return err;
  }
};
