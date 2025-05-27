import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { singletonHook } from "react-singleton-hook";0
import { SEARCH_ENGINE_API, API_URL } from "@framework/const";
import { useRouter } from "next/router";
import { NextResponse } from 'next/server'
import { getAnalyticsId, getCookieData, getCustomerData } from "framework/analytics";
import { getConfig } from "@framework/api/config";


import {
  SearchAnalyticsRecord,
  SearchResultDaum,
  SearchFilters,
  SearchResultRoot,
  API_Records,
} from "@common/types/search";
import {uuid} from "@utils/common";
import { data } from "cheerio/lib/api/attributes";
import { arch } from "os";

interface UseSearchEngineResult {
  search: string;
  pageSize:number;
  Loading: boolean;
  result: SearchResultDaum[];
  searchCookie: string;
  ws_instance: any;
  setSearch: (q: string) => void;
  setPageSize: (s: number) => void;
  pageNumber: number;
  setPageNumber: (p: number) => void;
  totalPages: number;

  setIsGenuineFilter: (m: boolean) => void;
  setIsAltFilter: (m: boolean) => void;

  setManufacturerHyundaiFilter: (m: boolean) => void;
  setManufacturerToyotaFilter: (m: boolean) => void;
  setManufacturerACDelcoFilter: (m: boolean) => void;
  setManufacturerMotorcraftFilter: (m: boolean) => void;
  setManufacturerDeluxFilter: (m: boolean) => void;
  setManufacturerAvonFilter: (m: boolean) => void;
  setManufacturerUSstarFilter: (m: boolean) => void;
  setSortBy: (m: string) => void;


  isGenuineFilter: boolean;
  isAltFilter: boolean;
  manufacturerHyundaiFilter: boolean;
  manufacturerToyotaFilter: boolean;
  manufacturerACDelcoFilter: boolean;
  manufacturerMotorcraftFilter: boolean;
  manufacturerDeluxFilter: boolean;
  manufacturerAvonFilter: boolean;
  manufacturerUSstarFilter: boolean;

  sortBy: string;


  recordAnalytic: (record: SearchAnalyticsRecord) => Promise<void>;
  recordAPI: (record: API_Records) => Promise<void>;
}

const initialState: UseSearchEngineResult = {
  search: "",
  pageSize:10,
  result: [
    {
      description: "",
      price_0_1: 0,
      sku: "",
      category_id: "",
      Picture: "",
      name: "",
      url_key: "",
      type : "",
      // index: 0,
      // lang: "",
       //oem: "",
      // manufacturer: "",
      // Make: "",
      // Make_Arabic: "",
      // Model: "",
      // Model_Arabic: "",
      // Year: "",
      part_manufacturer_store_value: "",
      status_value: ""
    },
  ],
  isGenuineFilter: false,
  isAltFilter: false,
  manufacturerHyundaiFilter: false,
  manufacturerToyotaFilter: false,
  manufacturerACDelcoFilter: false,
  manufacturerMotorcraftFilter: false,
  manufacturerDeluxFilter: false,
  manufacturerAvonFilter: false,
  manufacturerUSstarFilter: false,

  sortBy: "",

  setIsGenuineFilter: (args) => {},
  setIsAltFilter: (args) => {},

  setManufacturerHyundaiFilter: (args) => {},
  setManufacturerToyotaFilter: (args) => {},
  setManufacturerACDelcoFilter: (args) => {},
  setManufacturerMotorcraftFilter: (args) => {},
  setManufacturerDeluxFilter: (args) => {},
  setManufacturerAvonFilter: (args) => {},
  setManufacturerUSstarFilter: (args) => {},
  setSortBy: (args) => {},


  searchCookie: "",
  ws_instance: null,
  setSearch: (args) => {},
  setPageSize: (args) => {},
  pageNumber: 1,
  Loading: false,
  setPageNumber: (args) => {},
  totalPages : 1,
  recordAnalytic: async (args) => {},
  recordAPI: async(args) => {},
};
 
const useSearchEngine = (): UseSearchEngineResult => {
  const [search, setSearch] = useState(initialState.search);
  const [pageSize, setPageSize] = useState(100);
  const [result, setResult] = useState<SearchResultDaum[]>(initialState.result);
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, settotalPages] = useState(1)


  const [isGenuineFilter, setIsGenuineFilter] = useState(false)
  const [isAltFilter, setIsAltFilter] = useState(false)

  const [manufacturerHyundaiFilter, setManufacturerHyundaiFilter] = useState(false)
  const [manufacturerToyotaFilter, setManufacturerToyotaFilter] = useState(false)
  const [manufacturerACDelcoFilter, setManufacturerACDelcoFilter] = useState(false)
  const [manufacturerMotorcraftFilter, setManufacturerMotorcraftFilter] = useState(false)
  const [manufacturerDeluxFilter, setManufacturerDeluxFilter] = useState(false)
  const [manufacturerAvonFilter, setManufacturerAvonFilter] = useState(false)
  const [manufacturerUSstarFilter, setManufacturerUSstarFilter] = useState(false)
  const [sortBy, setSortBy] = useState("")

  const allResults = useRef([] as any[]);
  const [Loading, setLoading] = useState(true);
  const router = useRouter();
  const searchCookie = useMemo(
    () => {
      const SEARCH_COOKEI_KEY = "SEARCH_COOKEI";
      if(!localStorage) return "";

      let id = localStorage.getItem(SEARCH_COOKEI_KEY);
      if(!id) {
        localStorage.setItem(SEARCH_COOKEI_KEY, uuid());
        id = localStorage.getItem(SEARCH_COOKEI_KEY) || "";
      }
      return id;
    }, 
    []
  )

  const ws_instance = useMemo(
    () => {
    //   console.log('Connection started ..')
    //   const socket = io("localhost:5001/", {
    //     transports: ["websocket"],
    //     reconnection: true,
    //     reconnectionAttempts: 5,
    //     reconnectionDelay: 2
    //   })
      
    //   console.log("socket:", socket)
    //   socket.on("connect", () => {
    //     console.log('Connected successfully');
    //     // sessionStorage.setItem('active_session', 'connected')
    //     socket.on("disconnect", (u) => {
    //       console.log(u)
    //     })
    // });


    //   return socket;
      },
    []
  )

  const [wsInstance, setWsInstance] = useState(null);

  useEffect (() => {
    (async () => {

      try {
        setLoading(true);
      
        const res = await fetch(`${SEARCH_ENGINE_API}`, {
          method: "GET",
          // body: JSON.stringify({ message: search, page: pageNumber, Filters: 
          //   { isGenuineFilter,
          //     isAltFilter, 
          //     manufacturerHyundaiFilter, 
          //     manufacturerToyotaFilter, 
          //     manufacturerACDelcoFilter,
          //     manufacturerMotorcraftFilter, 
          //     manufacturerDeluxFilter, 
          //     manufacturerAvonFilter, 
          //     manufacturerUSstarFilter, 
          //     sortBy}
          // }),
  
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data: SearchResultRoot = await res.json();
  
        try {
          allResults.current.push({
            data: data["hits"]["hits"].map((d) => ({
              ...d,
            })),
            timestamp: data["timestamp"],
          });
  
          allResults.current = allResults.current.slice(-5);
          allResults.current.sort((a, b) => {
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
          });
          
          setResult(allResults.current[allResults.current.length - 1].data);
          setLoading(false);
        }
        catch (error) {}
  
      }
      catch(e) {
        console.log('ERROR 500')
        console.log(e)
      }
    })();
  }, [isGenuineFilter,isAltFilter, manufacturerHyundaiFilter, manufacturerToyotaFilter, manufacturerACDelcoFilter,
        manufacturerMotorcraftFilter, manufacturerDeluxFilter, manufacturerAvonFilter, manufacturerUSstarFilter, sortBy]);


  useEffect(()=> {
    const q = router.query.q as string;
    if (q) {
      setSearch(q)
    }
  }, [router.query])

  useEffect(() => {
    (async () => {

      try {
        setLoading(true);
        const locale = router.locale as string;

        let esIndexer = process.env.NEXT_PUBLIC_ES_EN_INDEX;
        
        if(locale == 'ar')
        {
           
          esIndexer = process.env.NEXT_PUBLIC_ES_AR_INDEX;
        }
        if(search.length >= 4){
        const res = await fetch(`${SEARCH_ENGINE_API}/${esIndexer}/_search`, {
          method: "POST",
          body: JSON.stringify( 
            {
              query: 
              {
                "query_string":
                {
                  "query": `*${search}*`,
                  "fields" : ["name","sku","description","part_number_store"]
                }
              },
              size : pageSize
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        var resultAPi : any; 
        // var skus : any[][] = [];
        var skus = new Array;
        // var categoryFilter = new Array;
        var pageSku = new Array;
        var currentTraverse = 0;        
        const data: SearchResultRoot = await res.json();
        data["hits"]["hits"].map((d : any) => {
        //  resultAPi = getProducts(d._source.sku).then((data) =>
        //  {
        //      d._source.name = data.data.products.items[0].name; 
        //      console.log(data);   
        //  })
        //skus.push("\"" + d._source.sku + "\"")
           
        // if(currentTraverse >= 9){
            //   skus.push(pageSku)
            //   currentTraverse = 0;
            //   pageSku = new Array 
            // }else{
            //   pageSku.push("\"" + d._source.sku + "\"")
            //   currentTraverse = currentTraverse + 1;
            // }
            // if(data["hits"]["hits"].length < 10){ 
            //   skus = [];
            //   skus.push(pageSku);
            // }     
             skus.push("\"" + d._source.sku + "\"")
            
      })
         Array.isArray(skus) ?  settotalPages(skus.length) : settotalPages(1);    
        const products: any = getProducts(skus, locale).then((products) =>
        {
         if(products && products.hasOwnProperty('data')){ 
            try {
              allResults.current.push({
                data: products.data.products.items.map((item : any ) => ({
                  ...item
                })),
                timestamp: data["timestamp"],
              });
    
              allResults.current = allResults.current.slice(-1);
              allResults.current.sort((a, b) => {
                if (a.timestamp < b.timestamp) return -1;
                if (a.timestamp > b.timestamp) return 1;
                return 0;
              });
              setResult(allResults.current[allResults.current.length - 1].data);
              setLoading(false);
            } 
            catch (error) {}
         }
         else
         {
          // setResult([]);
          // setLoading(false);
         }    
        });
       

        
        const entries = Object.entries(data);
        // console.log(entries);
       
      }
      }
      catch(e) {
        console.log('ERROR 500')
        console.log(e)
      }

    })();
  }, [search, pageNumber, pageSize]);



  async function getProducts( skus : any , locale : string) {
    try {
      let category_id = "";
      const mainCategory = localStorage.getItem("MAIN_CATEGORY");
      if (mainCategory) {
        category_id = mainCategory;
      }  
      if(Array.isArray(skus) ? skus.length > 0 : false){
        const categoryFilter = category_id ? `, category_id: { eq: ${category_id} }` : '';
        var queryGet =  `
        query {
          products(
            filter: {
              sku: { in: [${skus}]}
              ${categoryFilter}
            }
            pageSize: 500
          ) {
            total_count,
            items {
              id
              name
              sku
              url_key
              stock_status
              new_from_date
              new_to_date
              special_price
              special_from_date
              special_to_date
              __typename
              short_description {
                html
              }
              description {
                html
              }
              part_type_new
              sale  
              new
              attribute_set_id
              meta_title
              meta_keyword
              meta_description
              part_manufacturer_store
              country_of_manufacture
              gift_message_available
              image {
                url
                label
              }
              small_image {
                url
                label
              }
              thumbnail {
                url
                label
              }
              swatch_image
              media_gallery {
                url
                label
              }
              price_range {
                minimum_price {
                  regular_price {
                    value
                    currency
                  }
                  final_price {
                    value
                    currency
                  }
                }
                maximum_price {
                  regular_price {
                    value
                    currency
                  }
                  final_price {
                    value
                    currency
                  }
                }
              }
              price_tiers {
                quantity
                final_price {
                  value
                  currency
                }
              }
              related_products {
                id
                name
                sku
                url_key
                __typename
              }   
            }
          }
        }
`;
  
        const apiConfig = getConfig({ locale: "ar" });
        const res = await fetch(`${API_URL}/graphql`, {
          method: "POST",
          body: JSON.stringify({ query: queryGet,
                        locale: apiConfig.locale,
            token: apiConfig.token
          }),
  
          headers: {
            "Content-Type": "application/json",
            "Store" : locale

          },
        });
  
        const data = await res.json();
        return data;
// product.variants[0].attributes[0].uid = data.data.products.items[0].variants[0].attributes[0].uid
    
      }
      return null;
        }


      catch(e) {
        console.log('ERROR 500')
        console.log(e)
  }

   
  } 
  
  const recordAnalytic = useCallback(async (r: SearchAnalyticsRecord) => {
    try {
      const res = await fetch(`${SEARCH_ENGINE_API}/searchdb`, {
        method: "POST",
        body: JSON.stringify(r),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {}
  }, []);

  const recordAPI = useCallback(async (r: API_Records) => {
    // try {
    //   const action_id = getAnalyticsId({behaviour: r.behaviour, source: r.source})

    //   const [userId, sessionId, sessionIndex] = getCookieData()
    //   const [cart_id, email, name, platform] = getCustomerData()
  

    //   // Insert Product
    //   if (r.product !== '' && r.product) {
    //     console.log("product:", r.product)
    //   try {
    //     const res = await fetch(`https://pythondata.rafraf.com/i_p`, {
    //       method: "POST",
    //       body: JSON.stringify({
    //         sid: sessionId,
    //         sindex: sessionIndex,
    //         a: action_id,
    //         sku: r.product,
    //         ts: Date.now(),
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //   }
    //   catch (error) {
    //     // console.log(error)
    //   }
    // }
    //   // Insert Session
    //   try {
    //     const res = await fetch(`https://pythondata.rafraf.com/i_s`, {
    //       method: "POST",
    //       body: JSON.stringify({
    //         uid: userId,
    //         sid: sessionId,
    //         sindex: sessionIndex,
    //         a: action_id,
    //         ts: Date.now(),
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //   }
    //   catch (error) {
    //     // console.log(error)
    //   }

    //   // Insert User
    //   try {
    //     const res = await fetch(`https://pythondata.rafraf.com/i_u`, {
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
    //     });
    //   }
    //   catch (error) {
    //     // console.log(error)
    //   }
        
    // }
    // catch (e) {
    //   // console.log(e)
    // }
  }, [])
    

  // const ws = useCallback(async (r: any) => {
  //   console.log(socket)
  //   console.log(r)

    
  //   socket.on("measure", () => {
  //     console.log("measure has sent");
  //     console.log()
  //   });
    
  //   socket.emit("measure", "Hello poeple")

  //   socket.on("disconnect", (data) => {
  //     console.log(data);
  //   });  
    
  // }, [])

  return {
    search,
    pageSize,
    result,
    searchCookie,
    Loading,
    setSearch: (q: string) => setSearch(q),
    setPageSize: (s: number) => setPageSize(s),
    recordAnalytic,
    recordAPI,
    pageNumber,
    setPageNumber: (p: number) => setPageNumber(p),
    totalPages,
    ws_instance,
    isGenuineFilter,
    isAltFilter,
    manufacturerHyundaiFilter,
    manufacturerToyotaFilter,
    manufacturerACDelcoFilter,
    manufacturerMotorcraftFilter,
    manufacturerDeluxFilter,
    manufacturerAvonFilter,
    manufacturerUSstarFilter,
    sortBy,


    setIsGenuineFilter: (m: boolean) => setIsGenuineFilter(m),
    setIsAltFilter: (m: boolean) => setIsAltFilter(m),
  
    setManufacturerHyundaiFilter: (m: boolean) => setManufacturerHyundaiFilter(m),
    setManufacturerToyotaFilter: (m: boolean) => setManufacturerToyotaFilter(m),
    setManufacturerACDelcoFilter: (m: boolean) => setManufacturerACDelcoFilter(m),
    setManufacturerMotorcraftFilter: (m: boolean) => setManufacturerMotorcraftFilter(m),
    setManufacturerDeluxFilter: (m: boolean) => setManufacturerDeluxFilter(m),
    setManufacturerAvonFilter: (m: boolean) => setManufacturerAvonFilter(m),
    setManufacturerUSstarFilter: (m: boolean) => setManufacturerUSstarFilter(m),
    setSortBy: (m: string) => setSortBy(m),
  
  
  };
};

export default singletonHook(initialState, useSearchEngine);
