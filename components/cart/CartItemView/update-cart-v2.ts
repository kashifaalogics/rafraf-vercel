import React from 'react';

interface Props {
  cart_item_id: any;
  quantity: number;
}

function buildRequestBody(cartID: string, cartItemId: any, quantity: number): string {
  return `{
    "query": "mutation updateCartItems($cartId: String!, $cartItems: [CartItemUpdateInput]!) { updateCartItems(input: { cart_id: $cartId, cart_items: $cartItems }) { cart { total_quantity id items { id quantity product { id sku } } prices { subtotal_with_discount_excluding_tax { value } subtotal_including_tax { value } subtotal_excluding_tax { value } grand_total { currency value } } } } } ",
    "variables": {
      "cartId": "${cartID}",
      "cartItems": [
        {
          "cart_item_id": ${cartItemId},
          "quantity": ${quantity}
        }
      ]
    }
  }`;
}

function updateCartV2({ cart_item_id, quantity }: Props) {
  const cartID = localStorage.getItem("CART_ID") || "";
  const token = localStorage.getItem("TOKEN")

  const header = {
    method: 'POST',
    hostname: 'api.rafraf.com',
    headers: {
        Authorization: `Bearer ${token}`,
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-platform': '"macOS"',
        'Referer': 'http://localhost:3000/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Content-Type': 'application/json;UTF-8',
        'Cookie': 'PHPSESSID=tas4gvopv3lhag25017jnk8q2t; private_content_version=22765790c43ba8a4420e494a6e6d2c17'
    },
    maxRedirects: 20,
  };

  const body = buildRequestBody(cartID, cart_item_id, quantity);

  return fetch("https://api.rafraf.com/graphql", {
    body: body,
    ...header,
  });
}

export default updateCartV2;
