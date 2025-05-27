import { BlogArtical, BlogMini } from "@components/common";
import { A, H3, H4 } from "@components/typography";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const FacebookFilledIcon = ({ color = "#3C425A", className = "" }: any) => {
    return (
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="26" cy="26" r="25.5" fill={color} stroke={color} />
        <path
          d="M25.7116 45.9333V18.1999C25.7116 14.3708 28.8157 11.2666 32.6449 11.2666H34.3783M17.0449 25.1333H34.3783"
          stroke="#FEFEFE"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  const TwitterFilledIcon = ({ color = "#3C425A", className = "" }) => {
    return (
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="26" cy="26" r="25.5" fill={color} stroke={color} />
        <path
          d="M37.5208 15.8887L38.1194 15.849C38.1035 15.6083 37.9449 15.4006 37.717 15.3217C37.489 15.2428 37.236 15.3081 37.0747 15.4874L37.5208 15.8887ZM36.4725 20.7732C36.4725 20.4418 36.2039 20.1732 35.8725 20.1732C35.5411 20.1732 35.2725 20.4418 35.2725 20.7732H36.4725ZM25.983 20.9089H25.383V20.9089L25.983 20.9089ZM25.983 22.4918L26.583 22.4918V22.4918L25.983 22.4918ZM14.4453 34.0474V33.4474C14.181 33.4474 13.9478 33.6204 13.8711 33.8733C13.7944 34.1263 13.8923 34.3996 14.1121 34.5464L14.4453 34.0474ZM16.0936 15.8887L16.6555 15.6783C16.5717 15.4547 16.3634 15.302 16.125 15.2895C15.8865 15.277 15.6634 15.4071 15.5567 15.6207L16.0936 15.8887ZM22.6865 30.7458L23.1111 31.1697C23.258 31.0227 23.3182 30.8101 23.2705 30.6079C23.2227 30.4056 23.0737 30.2425 22.8765 30.1767L22.6865 30.7458ZM34.6115 17.4955L34.1665 17.8979L34.3826 18.137L34.7013 18.0888L34.6115 17.4955ZM36.9221 15.9284C37.0079 17.2237 36.9312 18.0394 36.7078 18.6689C36.4889 19.286 36.1081 19.7843 35.4574 20.4078L36.2876 21.2743C36.9989 20.5927 37.5301 19.9403 37.8388 19.0701C38.143 18.2125 38.2093 17.2046 38.1194 15.849L36.9221 15.9284ZM36.4725 21.976V20.7732H35.2725V21.976H36.4725ZM25.383 20.9089L25.383 22.4918L26.583 22.4918L26.583 20.9089L25.383 20.9089ZM25.383 22.4918L25.383 23.3172L26.583 23.3172L26.583 22.4918L25.383 22.4918ZM30.9955 15.2887C27.8949 15.2887 25.383 17.8058 25.383 20.9089H26.583C26.583 18.4668 28.5594 16.4887 30.9955 16.4887V15.2887ZM35.2725 21.976C35.2725 29.224 29.4061 35.0982 22.1715 35.0982V36.2982C30.0706 36.2982 36.4725 29.885 36.4725 21.976H35.2725ZM15.5317 16.0991C16.4088 18.4416 19.7128 23.0918 25.983 23.0918V21.8918C20.3859 21.8918 17.4266 17.7379 16.6555 15.6783L15.5317 16.0991ZM15.5567 15.6207C13.8506 19.0383 13.6008 22.3238 14.8231 25.1062C16.0434 27.8838 18.6783 30.0402 22.4965 31.3149L22.8765 30.1767C19.2777 28.9752 16.9678 27.0046 15.9218 24.6235C14.8778 22.2472 15.0401 19.3422 16.6304 16.1567L15.5567 15.6207ZM22.2619 30.3219C21.2394 31.3461 18.1969 33.4474 14.4453 33.4474V34.6474C18.6053 34.6474 21.9361 32.3466 23.1111 31.1697L22.2619 30.3219ZM35.0565 17.0931C34.0553 15.9858 32.6064 15.2887 30.9955 15.2887V16.4887C32.2528 16.4887 33.3829 17.0314 34.1665 17.8979L35.0565 17.0931ZM34.7013 18.0888C35.9032 17.9067 37.0814 17.2741 37.9668 16.29L37.0747 15.4874C36.3679 16.2731 35.4381 16.7635 34.5217 16.9023L34.7013 18.0888ZM14.1121 34.5464C16.7561 36.3118 19.5279 36.2982 22.1715 36.2982V35.0982C19.4882 35.0982 17.0793 35.0846 14.7785 33.5484L14.1121 34.5464Z"
          fill="#FEFEFE"
        />
      </svg>
    );
  };
  
  const InstagramFilledIcon = ({ color = "#3C425A", className = "" }) => {
    return (
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="26" cy="26" r="25.5" fill={color} stroke={color} />
        <path
          d="M31.7786 19.3967H33.4294M21.0485 14.4443H30.9532C34.6001 14.4443 37.5564 17.4007 37.5564 21.0475V30.9523C37.5564 34.5991 34.6001 37.5554 30.9532 37.5554H21.0485C17.4017 37.5554 14.4453 34.5991 14.4453 30.9523V21.0475C14.4453 17.4007 17.4017 14.4443 21.0485 14.4443ZM26.0009 30.9523C23.2657 30.9523 21.0485 28.735 21.0485 25.9999C21.0485 23.2648 23.2657 21.0475 26.0009 21.0475C28.736 21.0475 30.9532 23.2648 30.9532 25.9999C30.9532 28.735 28.736 30.9523 26.0009 30.9523Z"
          stroke="#FEFEFE"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  const YoutubeFilledIcon = ({ color = "#3C425A", className = "" }) => {
    return (
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="26" cy="26" r="25.5" fill={color} stroke={color} />
        <path
          d="M13.847 36.3256L13.7467 36.8154H13.7467L13.847 36.3256ZM38.1513 36.3256L38.2516 36.8154L38.1513 36.3256ZM38.1513 15.6742L38.2516 15.1844V15.1844L38.1513 15.6742ZM13.847 15.6742L13.9472 16.1641L13.847 15.6742ZM23.9356 22.0573L24.2042 21.6356C24.0503 21.5375 23.8551 21.5312 23.6951 21.619C23.5351 21.7068 23.4356 21.8748 23.4356 22.0573H23.9356ZM23.9356 29.9425H23.4356C23.4356 30.125 23.5351 30.293 23.6951 30.3808C23.8551 30.4686 24.0503 30.4622 24.2042 30.3642L23.9356 29.9425ZM30.1261 25.9999L30.3947 26.4216C30.5388 26.3298 30.6261 26.1708 30.6261 25.9999C30.6261 25.829 30.5388 25.67 30.3947 25.5782L30.1261 25.9999ZM11.0547 18.383V33.6168H12.0547V18.383H11.0547ZM40.9436 33.6168V18.383H39.9436V33.6168H40.9436ZM13.7467 36.8154C21.8234 38.4688 30.1749 38.4688 38.2516 36.8154L38.051 35.8357C30.1067 37.462 21.8916 37.462 13.9472 35.8357L13.7467 36.8154ZM38.2516 15.1844C30.1749 13.531 21.8234 13.531 13.7467 15.1844L13.9472 16.1641C21.8916 14.5378 30.1067 14.5378 38.051 16.1641L38.2516 15.1844ZM40.9436 18.383C40.9436 16.824 39.8061 15.5026 38.2516 15.1844L38.051 16.1641C39.1706 16.3933 39.9436 17.3294 39.9436 18.383H40.9436ZM39.9436 33.6168C39.9436 34.6704 39.1706 35.6065 38.051 35.8357L38.2516 36.8154C39.8061 36.4972 40.9436 35.1758 40.9436 33.6168H39.9436ZM11.0547 33.6168C11.0547 35.1758 12.1922 36.4972 13.7467 36.8154L13.9472 35.8357C12.8276 35.6065 12.0547 34.6704 12.0547 33.6168H11.0547ZM12.0547 18.383C12.0547 17.3294 12.8276 16.3933 13.9472 16.1641L13.7467 15.1844C12.1922 15.5026 11.0547 16.824 11.0547 18.383H12.0547ZM23.4356 22.0573V29.9425H24.4356V22.0573H23.4356ZM24.2042 30.3642L30.3947 26.4216L29.8575 25.5782L23.667 29.5207L24.2042 30.3642ZM30.3947 25.5782L24.2042 21.6356L23.667 22.4791L29.8575 26.4216L30.3947 25.5782Z"
          fill="#FEFEFE"
        />
      </svg>
    );
  };
  

const socialLinks = [
    {
      title: "Facebook",
      Icon: FacebookFilledIcon,
      link: "https://www.facebook.com/Rafrafsaudi",
    },
    {
      title: "Twitter",
      Icon: TwitterFilledIcon,
      link: "https://twitter.com/RafrafSA",
    },
    {
      title: "Instagram",
      Icon: InstagramFilledIcon,
      link: "https://www.instagram.com/rafrafsa",
    },
    {
      title: "Youtube",
      Icon: YoutubeFilledIcon,
      link: "https://www.youtube.com/channel/UCDoN5wHMsWCeKijnlhnzHxA",
    },
  ];
  

function RecentBlogs() {
    const { t } = useTranslation();
    const router = useRouter()
  
  return (
    <div className="mb-12">
    <BlogArtical h={"1054px"}>
      <>
        {/* First blog - Recent Posts */}
        <div className="py-6">
          <H3>{t("static/blogs:recent_posts")}</H3>
        </div>

        <div
          style={{
            flexDirection: "column",
          }}
          className="flex"
        >
          
            <BlogMini
                Image={t("static/blogs:blog_1.imageUrl")}
                BlogTitle={t("static/blogs:blog_1.title")}
                Date={t("static/blogs:blog_1.date")}
                BlogId={t("static/blogs:blog_1.id")}
            />
            <BlogMini
                Image={t("static/blogs:blog_2.imageUrl")}
                BlogTitle={t("static/blogs:blog_2.title")}
                Date={t("static/blogs:blog_2.date")}
                BlogId={t("static/blogs:blog_2.id")}
            />

            <BlogMini
                Image={t("static/blogs:blog_3.imageUrl")}
                BlogTitle={t("static/blogs:blog_3.title")}
                Date={t("static/blogs:blog_3.date")}
                BlogId={t("static/blogs:blog_3.id")}
            />

            <BlogMini
                Image={t("static/blogs:blog_4.imageUrl")}
                BlogTitle={t("static/blogs:blog_4.title")}
                Date={t("static/blogs:blog_4.date")}
                BlogId={t("static/blogs:blog_4.id")}
            />
            <BlogMini
                Image={t("static/blogs:blog_5.imageUrl")}
                BlogTitle={t("static/blogs:blog_5.title")}
                Date={t("static/blogs:blog_5.date")}
                BlogId={t("static/blogs:blog_5.id")}
            />
            <BlogMini
                Image={t("static/blogs:blog_6.imageUrl")}
                BlogTitle={t("static/blogs:blog_6.title")}
                Date={t("static/blogs:blog_6.date")}
                BlogId={t("static/blogs:blog_6.id")}
            />
            <BlogMini
                Image={t("static/blogs:blog_7.imageUrl")}
                BlogTitle={t("static/blogs:blog_7.title")}
                Date={t("static/blogs:blog_7.date")}
                BlogId={t("static/blogs:blog_7.id")}
            />
            <BlogMini
                Image={t("static/blogs:blog_8.imageUrl")}
                BlogTitle={t("static/blogs:blog_8.title")}
                Date={t("static/blogs:blog_8.date")}
                BlogId={t("static/blogs:blog_8.id")}
            />


          <div className="bottom-0 absolute pb-10">
            <H4>{t("static/blogs:stay_in_contact_social")}</H4>
            <div className="flex gap-6 mt-4">
              {socialLinks.map((sl, i) => (
                <A
                  key={i}
                  href={sl.link}
                  target="_blank"
                  className="flex flex-col justify-center items-center text-blue"
                >
                  <sl.Icon className="rounded-full shadow-lg" />
                  {/* <span>{sl.title}</span> */}
                </A>
              ))}
            </div>
          </div>
        </div>
      </>
    </BlogArtical>
  </div>

  )
}



export default RecentBlogs