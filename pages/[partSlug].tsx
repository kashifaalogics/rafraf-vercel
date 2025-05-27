import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export async function getServerSideProps(
  context: GetServerSidePropsContext<any>
): Promise<GetServerSidePropsResult<any>> {
  try {
    return {
      redirect: {
        destination: "/" + context.locale + "/parts/all/product" + context.resolvedUrl.split("?")[0],
        permanent: true,
      },
    };
  
  }
  catch (error){
    console.log('ERROR OCCURED ON [partSlug] redirects')
    console.log(error)
    return {
      redirect: {
        destination: "/" + context.locale + "/parts/all/product" + context.resolvedUrl.split("?")[0],
        permanent: true,
      },
    };  
  }

}

export default function Part() {
  return <></>;
}
