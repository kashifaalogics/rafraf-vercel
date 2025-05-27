import { create } from 'zustand'
    import { devtools, persist } from "zustand/middleware"

    interface ManufacturerOption {
      value: string;
      label: string;
    }
    interface TypeOptions {
      value: string;
      label: string;
    }

    interface StoreState {
  cartID: string | null;
  token: string | null;
  loggedIn: boolean;
  cartCount: number;
  toggleCartCall: boolean;
  carSelected: {
    isEmpty: boolean;
    cars: Array<{ name: string; id: string; year: string }>;
  };
  setCarSelected: (carSelected: any) => void;
  clearCarSelected: () => void;
  GrandTotal: number;
  gandTotalonDecrement: number;
  productQuant: boolean;
  uniqueManufacturer: ManufacturerOption[]; 
  setUniqueManufacturer: (manufacturer: ManufacturerOption[]) => void;
  setProductQuant: (condition: boolean) => void;
  setGrandDecrement: (granddecrement: number) => void;
  setToggleCartCall: () => void;
  setGrandTotal: (grandTotal: number) => void;
  setCartID: (cartID: string) => void;
  setCartCount: (count: number) => void;
  setUser: (user: any) => void;
  logOut: () => void;
}
    const store = (set: any, get: any) => ({

        cartID: null,
        token: null,
        loggedIn: false,
        cartCount: 0,
        toggleCartCall: false,
        carSelected: {
            isEmpty: true,
            cars: [{"name":"","id":""},{"name":"","id":""},{"year":""}]
        },
        setCarSelected: (carSelected: any) => set({ carSelected: {
            isEmpty: false,
            cars: carSelected
        }}),
        clearCarSelected: () => set({ carSelected: {
            isEmpty: true,
            cars: [{"name":"","id":""},{"name":"","id":""},{"year":""}]
        }}),
        GrandTotal: 0,
        gandTotalonDecrement: 0,
        productQuant: false,
        uniqueManufacturer: [] as ManufacturerOption[],
        productType : [] as TypeOptions[],
        CustomerAddress: {
          addressId: null,
          street: "",
          telephone: "",
          city: "",
          country: "",
          postCode: "",
        },
        firstName: "",
        lastName: "",
        phoneNum: "",
        LCity: "",
        _Address: "",
        _Street: "",

        setCustomeraddress: (customer: any) => set({CustomerAddress: customer}),

        set_Street: (st: any) => set({_Street: st}),
        set_Address: (add: any) => set({_Address: add}),
        setFirstName: (name: any) => set({firstName: name}),
        setLastName: (name: any) => set({lastName: name}),
        setPhone: (phone: any) => set({phoneNum: phone}),
        setLCity: (city: any) => set({LCity: city}),

        setProductType: (product: any) => set({productType: product}),
        setUniqueManufacturer: (manufacturer: any) => set({uniqueManufacturer: manufacturer}),
        setProductQuant: (condition: boolean) => set({productQuant: condition}),
        setGrandDecrement: (granddecrement: number) => set({ gandTotalonDecrement: granddecrement }),
        setToggleCartCall: () => set({ toggleCartCall: !get().toggleCartCall }),
        setGrandTotal: (grandTotal: number) => set({ GrandTotal: grandTotal }),
        setCartID: (cartID: string) => set({ cartID: cartID }),
        setCartCount: (count: number) => set({ cartCount: count }),
        setUser: (user: any) => set(() => (user)),
        setLogin: (loggedIn: boolean) => set({loggedIn: loggedIn}),
        logOut: () => {set({loggedIn: false}); localStorage.clear(); sessionStorage.clear()}
    })

    const useStore = create(
        persist(devtools(store), {name: 'STORE'})
    )

    export default useStore