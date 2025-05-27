

import {
  FormEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_URL } from "@framework/const";



interface Props {
  onSaved?: () => void;
}

const CustomerAddresses:  FunctionComponent<Props> = ({ onSaved = () => {} }) =>  {


  async function getCustomerData( locale : string ) {
    try {
      var queryGet =  `
      query getCustomerData{
        customer {
          addresses {
            city
            firstname
            lastname
            telephone
            street
            default_shipping
          }
        }
      }
    `;
    const currentToken = localStorage.getItem("TOKEN") || JSON.parse(window.localStorage.getItem('CUSTOMER_STATE') || '{}');
        const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet,
      locale: 'ar',
      
    }),
  
        headers: {
          "Content-Type": "application/json",
          ...(currentToken.token? {"Authorization" : `Bearer ${currentToken.token}`}: [])

        },
      });
  
      const data = await res.json();
      return data;
  }
  

    catch(e) {
      console.log('ERROR 500')
      console.log(e)
    }
  
 
}

  return (
     <ul>
        {/* //   {data.customer.addresses.map(address => (
    //     <li key={address.id}>
    //       {address.firstname} {address.lastname}
    //       <br />
    //       {address.street}
    //       <br />
    //       {address.city}, {address.region.region_code} {address.postcode}
    //       <br />
    //       {address.country.label}
    //       <br />
    //       {address.telephone}
    //     </li>
    //   ))} */}
     </ul>
  );
}

export default CustomerAddresses;

