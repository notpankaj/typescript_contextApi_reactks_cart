import { useContext, createContext, ReactNode, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import useLocalStorage from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppinCartContext = createContext({} as ShoppingCartContext);

const useShoppingCart = () => useContext(ShoppinCartContext);

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );

  const cartQuantity = cartItems.reduce((qty, item) => {
    qty = item.quantity + qty;
    return qty;
  }, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };
  const increaseCartQuantity = (id: number) => {
    setCartItems((prevState) => {
      if (!prevState.find((item) => item.id === id)) {
        return [...prevState, { id, quantity: 1 }];
      } else {
        return prevState.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
    });
  };
  const decreaseCartQuantity = (id: number) => {
    setCartItems((prevState) => {
      if (prevState.find((item) => item.id === id)?.quantity === 1) {
        return prevState.filter((item) => item.id !== id);
      } else {
        return prevState.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };
  const removeFromCart = (id: number) => {
    setCartItems((prevState) => {
      return prevState.filter((item) => item.id !== id);
    });
  };
  return (
    <ShoppinCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartQuantity,
        openCart,
        closeCart,
        cartItems,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppinCartContext.Provider>
  );
};

export { ShoppingCartProvider, useShoppingCart };
