import React from 'react'
import { Link, Image } from "@components/ui";
import { BlogArtical, BlogMini } from "@components/common";
import { A, H5 } from "@components/typography";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useViewport } from "@common/hooks";

interface Props {
    id: string
    title: string
    image: string
    date: string
    // h: any,
    // children: any,
}

function BlogRow(props: Props) {
  const { t } = useTranslation();
  const router = useRouter()
  const { breakpoint } = useViewport();

  return (
    <div className='sm:my-4 md:my-0'>
        <Link href={`/blog/${props.id}`}>
            <A>
            <BlogArtical h={breakpoint === "sm"? "330px" : "392px"}>
                <div
                style={{
                    height: breakpoint === "sm"? "210px" : "220px",
                }}
                >
                <Image
                    src={props.image}
                    alt="blog-photo"
                />
                </div>
                <div>
                <div
                    className="flex"
                    style={{ justifyContent: "space-between" }}
                >
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
                    <button
                        onClick={() => {
                        router.push(`/blog/${props.id}`);
                        }}
                    >
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
                    {props.date}
                    </div>
                </div>

                <div className="pt-3">
                    <H5>{props.title}</H5>
                </div>
                </div>
            </BlogArtical>
            </A>
        </Link>
    </div>
  )
}

export default BlogRow