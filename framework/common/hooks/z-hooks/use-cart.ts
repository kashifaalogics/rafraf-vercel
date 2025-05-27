import { useEffect, useState } from "react";
import { handleSuccess } from "@common/utils/handlers";
import { useApiConfig } from "..";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Dispatch } from "@common/store";


function useCart() {
  
    const apiConfig = useApiConfig();

    const loggedOut = () => {
        const customerState = localStorage.getItem("CUSTOMER_STATE")
        console.log("customerState:", customerState)
        if(!customerState) return true
    }

    return {
        loggedOut
    }
}

export default useCart


