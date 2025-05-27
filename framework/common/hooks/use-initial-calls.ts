import { Dispatch, reset, RootState } from "@common/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApiConfig } from ".";
import { rafrafToast } from "@common/utils/feedback";
import useTranslation from "next-translate/useTranslation";
import { useSearchEngine } from "@common/hooks";
import { getCookieData, getCustomerData } from "framework/analytics";

const useInitialCalls = () => {
  const { customer, cart, loading } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<Dispatch>();
  // const [prevCart, setPrevCart] = useState([]) as any
  const apiConfig = useApiConfig();
  const router = useRouter();
  const { t } = useTranslation();
  // const { recordAPI } = useSearchEngine();

  useEffect(() => {

    console.log('Mounted ..')
    
    // if (cart.cartId !== cart.cart.id && customer.loggedIn) {
    //   // main cart not found => log out to reset settings
    //   dispatch.customer.forceLogout()
    //   router.reload()
    //   rafrafToast(t("common:signOut"));
    // }

    if (customer.loggedIn && !loading.effects.cart.getCustomerCart) {
      dispatch.cart.getCustomerCart({ ...apiConfig, token: customer.token });
    }
    if (!customer.loggedIn && customer.token === "Reset") {
      console.log('RESETTING ..')
      reset(dispatch);
      router.reload();
      rafrafToast(t("common:signOut"));
    }
    if (customer.loggedIn) {
      dispatch.customer.getCustomerData(apiConfig);
    }

    // will log out to reset the token
    if (!customer.customer?.email && customer.loggedIn && loading.effects.cart.getCustomerCart && loading.effects.customer.getCustomerData)
    {
      reset(dispatch);
      router.reload();
      rafrafToast(t("common:signOut"));
    }

    if (!customer.loggedIn) {
      reset(dispatch);
    }

  }, [customer.loggedIn]);

  useEffect(() => {
    if (cart.cart.id) {
      dispatch.cart.setCartId(cart.cart.id);
      // prevCart?.map((i: { product: any; quantity: any; }) => {
      //   addToCartAndSave({ apiConfig: apiConfig, product: i.product, quantity: i.quantity })
      // })
    }
  }, [cart.cart.id]);

  // get cart if there is
  useEffect(() => {
    if (!cart.cartId || cart.cart.id) return;
    dispatch.cart.getCart(apiConfig);
  }, []);

  useEffect(() => {
    dispatch.cart.getCountries(apiConfig);
  }, []);


  // useEffect (() => {
    // const onPageLoad = () => {
    //   const [userId, sessionId, sessionIndex] = getCookieData()
    //   const [cart_id, email, name, platform] = getCustomerData()

    //   const recordUser = async () => {
    //     const res = await fetch("https://pythondata.rafraf.com/i_u", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         uid: userId,
    //         cid: cart_id,
    //         e: email,
    //         n: name,
    //         plt: platform
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     })
    //   }
      
    //   const recordSession = async () => {
    //     const res = await fetch("https://pythondata.rafraf.com/i_s", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         uid: userId,
    //         sid: sessionId,
    //         sindex: sessionIndex,
    //         a: 59,
    //         ts: Date.now(),
    //     }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     })
    //   }
    //   recordSession();
    //   recordUser();
    // }

    // try {
    //   // Check if the page has already loaded
    //   if (document.readyState === 'complete') {
    //     onPageLoad();
    //   } else {
    //     window.addEventListener('load', onPageLoad);
    //     // Remove the event listener when component unmounts
    //     return () => window.removeEventListener('load', onPageLoad);
    //   }

    // }
    // catch (e) {
    //   console.error(e)
    // }

  // useEffect (() => {
  //   const onPageLoad = () => {
  //     const [userId, sessionId, sessionIndex] = getCookieData()
  //     const [cart_id, email, name, platform] = getCustomerData()

  //     const recordUser = async () => {
  //       const res = await fetch("https://pythondata.rafraf.com/i_u", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           uid: userId,
  //           cid: cart_id,
  //           e: email,
  //           n: name,
  //           plt: platform
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //     }
      
  //     const recordSession = async () => {
  //       const res = await fetch("https://pythondata.rafraf.com/i_s", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           uid: userId,
  //           sid: sessionId,
  //           sindex: sessionIndex,
  //           a: 59,
  //           ts: Date.now(),
  //       }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //     }
  //     recordSession();
  //     recordUser();
  //   }

  //   try {
  //     // Check if the page has already loaded
  //     if (document.readyState === 'complete') {
  //       onPageLoad();
  //     } else {
  //       window.addEventListener('load', onPageLoad);
  //       // Remove the event listener when component unmounts
  //       return () => window.removeEventListener('load', onPageLoad);
  //     }

  //   }
  //   catch (e) {
  //     console.error(e)
  //   }

    
  // }, [])
  useEffect(() => {
    dispatch.cart.getCountryStates({
      apiConfig,
      countryCode: cart.selectedCountry,
    });
  }, [cart.selectedCountry]);
};

export default useInitialCalls;
