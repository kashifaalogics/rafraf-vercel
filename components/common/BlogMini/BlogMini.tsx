import { H6, Caption3 } from "@components/typography";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { Link } from "@components/ui";
import { A } from "@components/typography";

interface Props {
  // children: any,
  BlogTitle: string;
  Date: string;
  BlogId: string;
  Image: string;
}
function BlogMini(props: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <>
    <Link href={`/blog/${props.BlogId}`}>
      <A>
      <div
        className="flex"
        style={{
          // boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
          width: "320px",
          height: "78px",
          marginBottom: "20px"
        }}
      >
        <div className="px-1 mt-2">
          <img
            src={props.Image}
            alt="blog-photo"
            width={"95px"}
          />
        </div>

        <div className="px-2">
          <div className="pb-1" >
               <H6 style={{color: "#3C425A"}}>{props.BlogTitle}</H6>
          </div>
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "3px 10px 3px 10px",
                height: "20px",
                background: "#DDEBEB",
                borderRadius: "2px",
              }}
            >
              <button onClick={()=> {
                router.push(`/blog/${props.BlogId}`);
              }}>
              <div
                style={{
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "12px",
                  lineHeight: "14px",
                  color: "#3C425A",
                }}
              >
                {t("static/blogs:overview")}
              </div>
              </button>
            </div>

            <div
              style={{
                // fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "14px",
                color: "#999999",
                paddingTop: "4px",
              }}
            >
              {props.Date}
            </div>
          </div>
        </div>

        {/* {props.children} */}
      </div>
      </A>
    </Link>
    </>
  );
}
export default BlogMini;
