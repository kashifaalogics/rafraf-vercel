import React from 'react'
// import { WhatsAppSticky } from "../components/common/WhatsAppSticky";
import { A } from "@components/typography";
import { Image } from "@components/ui";

function Maintenance() {
  return (
    <div>
      <div className='grid place-items-center mt-20'>
        <img src="/logo/rafraf.webp" alt="rafraf-logo" width={200} />

        <div className='pt-28'>
          نعمل حاليًا على صيانة الموقع لتجربة أفضل, سنعاود العمل بعد بضع ساعات, شكرًا لإنتظاركم
        </div>

        <div className='pt-4'>
          للإستفسارات على الواتس اب
          <A
            href={"https://wa.me/966536722255"}
            target="_blank"
            title="تواصل على الواتسآب"
            >
              <div className='grid place-items-center pt-4'>
                <img src="/images/whatsapp.webp" width={64} />
              </div>
          </A>

        </div>
      </div>

    </div>
  )
}

export default Maintenance