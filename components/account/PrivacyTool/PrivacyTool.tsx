import { useAuth, useCustomer } from "@common/hooks";
import { rafrafToast } from "@common/utils/feedback";
import { isValidEmail } from "@common/utils/validation";
import { H5 } from "@components/typography";
import { Button, Input } from "@components/ui";
import { API_URL, BASE_URL } from "@framework/const";
import useTranslation from "next-translate/useTranslation";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { Dispatch } from "@common/store";

import {
  FormEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { $CombinedState } from "redux";

interface Props {
  onSaved?: () => void;
}

const PrivacyTool: FunctionComponent<Props> = ({ onSaved = () => {} }) => {
  const { t } = useTranslation();
  const { customer, updateCustomerInfo, updateCustomerInfoLoading } =
    useCustomer();

    const router = useRouter();
  const { loggedIn, logout, loggingOut } = useAuth();


  const [firstname, setFirstname] = useState({
    value: customer?.firstname,
    valid: false,
  });
  const [lastname, setLastname] = useState({
    value: customer?.lastname,
    valid: false,
  });
  const [email, setEmail] = useState({
    value: customer?.email,
    valid: false,
  });
 

  useEffect(() => {
    setFirstname({ value: customer?.firstname, valid: true });
    setLastname({ value: customer?.lastname, valid: true });
    setEmail({ value: customer?.email, valid: true });
  }, [customer]);

  async function deleteCustomer() {
          try {
          logout()
            var queryGet =  `
            mutation{
              deleteCustomer(
                input: {
                    email: "${email.value}"
              })
                {
                  message
                  status
                }
            }   
          `;
          
        const currentToken = JSON.parse(window.localStorage.getItem('CUSTOMER_STATE') || '{}');
            const res = await fetch(`${API_URL}/graphql`, {
            method: "POST",
            body: JSON.stringify({ query: queryGet
        }),
      
            headers: {
              "Content-Type": "application/json",
              "Store" : "ar",
              "Authorization": `Bearer ${currentToken.token}`
    
            },
          });
          
          const data = await res.json();
          //  if(data?.data.deleteCustomer.status == "true"){
          //  }else{
          //    console.log("Delete Customer Response----->:", data);
          //  }          
          //logout();
          //return data.customer.addresses[0];
          setModalOpen(false);
          router.push('/');
          
          }
          catch(e) {
            console.log('ERROR 500')
            console.log( "failed to ????", e)
          }
         
        }       
    
       const [modalOpen, setModalOpen] = useState(false);
        const handleModalOpen = () => {
          setModalOpen(true);
        };
        const handleModalClose = () => {
          setModalOpen(false);
          
        };
        const handleModalOk = () => {
          console.log('OK button clicked');
          setModalOpen(false);
        };

  return (
    <div className="privacy-policy-page">
    <div className="heading">
      <h1>{t("account:PrivacyTool")}</h1>
    </div>
    <div className="text-data-wrapper-accepted-consents">
      {/* <h4 className="heading-data">Accepted Consents</h4> */}
      <div className="text-data">
        <h6>{t("account:toUseWebsitePrivacyPolicy")}</h6>
        <h6>{t("account:wishtoWithdrawAcceptance")}</h6>
      </div>
    </div>
  
    <div className="text-data-wrapper-delete-btn">
      {/* <h4 className="heading-data">Delete Account</h4> */}
      <div className="text-data">
        <h6>{t("account:deleteYourData")}</h6>
        {/* <button>Delete My Data</button> */}
        <Button
          type="button"
          color="red"
          className="p-3"
          onClick={handleModalOpen}
          >
          {t("common:delete")}
        </Button>
          <div className={`modal-overlay ${modalOpen ? 'open' : ''}`}>
            <div className="modal">
              <div className="modal-content">
                <p>{t("account:sureDeleteAccount")}</p>
                <div className="modal-actions">
                  <button onClick={handleModalClose}>{t("account:no")}</button>
                  <button onClick={deleteCustomer}>{t("account:yes")}</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  );
};

export default PrivacyTool;
