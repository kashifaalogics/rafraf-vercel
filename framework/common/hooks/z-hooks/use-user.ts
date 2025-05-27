import { useEffect, useState } from "react";
import { handleSuccess } from "@common/utils/handlers";
import { useApiConfig } from "..";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Dispatch } from "@common/store";


interface Props {
    email: string;
    password: string;
}

function useUser() {
  
    const apiConfig = useApiConfig();
    const router = useRouter()
    const dispatch = useDispatch<Dispatch>();

    const logout = () => {
        dispatch.customer.resetCustomer()
        dispatch.cart.reset()
        localStorage.removeItem("CART_ID")
        localStorage.removeItem("TOKEN")
        handleSuccess("logout", apiConfig.locale);
        window.location.reload()
    }

    const loggedOut = () => {
        const customerState = localStorage.getItem("CUSTOMER_STATE")
        console.log("customerState:", customerState)
        if(!customerState) return true


    }

    // const login = async ({email, password}: Props) {

    // }


    return {
        logout,
        loggedOut
    }
}

export default useUser


