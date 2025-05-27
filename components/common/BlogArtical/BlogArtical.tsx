interface Props {
    h: any,
    children: any,
}
function BlogArtical (props: Props) {
  return (
    <>  
      <div
        className="rounded-md p-2 md:pt-11 md:pb-4 md:px-6 bg-white h-full relative"
        style={{
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
          width: "360px",
          height: props.h
        }}
      >
        {props.children}
      </div>
    </>
  );
}
export default BlogArtical;
