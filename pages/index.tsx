import type { NextPage } from 'next'
import Head from "next/head";
import Image from "next/image";
import logo from "../images/logo.png";
import Client, { Product } from "shopify-buy";
import React, { useEffect, useState } from "react";
import { Carousel } from "../components/carousel";
import { InputNumber, Button, Divider, Layout, Typography, Modal } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { useMediaQuery } from "react-responsive";
import Loading from "../components/loader";

const client = Client.buildClient({
  domain: "brewhaus-dog-bones.myshopify.com",
  storefrontAccessToken: "faf16306f4b8ed42c5c15fe00eb7fbed",
});

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getPrice = (product: any) =>
  formatter.format(product.variants[0].price.amount);

const Home: NextPage = () => {
  const [raffleTicket, setRaffleTicket] = useState<Product>();
  const [purchaseCount, setPurchaseCount] = useState<number>(0);
  const [checkoutId, setCheckoutId] = useState<string>();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [is21, setIs21] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProducts = async () => {
      const newProducts = await client.product.fetchAll();
      setRaffleTicket(newProducts[0]);
      const newCheckout = await client.checkout.create();
      setCheckoutId(newCheckout.id.toString());
      setIsLoading(false);
    };
    getProducts();
  }, []);

  const handleBuyNow = async () => {
    const newItem = [
      {
        variantId: raffleTicket?.variants[0].id ?? "",
        quantity: purchaseCount,
      },
    ];
    await client.checkout.addLineItems(checkoutId ?? "", newItem);
    const checkout = await client.checkout.fetch(checkoutId ?? "");
    window.location.href = checkout.webUrl;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div>
        <Head>
          <title>Brewhaus Bourbon Raffle</title>
          <meta
            name="description"
            content="Fundraiser for Brewhaus Dog Bones"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header
          style={{
            minHeight: isTabletOrMobile ? 100 : 150,
            padding: 0,
          }}
        >
          <div
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              maxWidth: 960,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: 10,
              paddingLeft: isTabletOrMobile ? 10 : 0,
              paddingRight: isTabletOrMobile ? 10 : 0,
            }}
          >
            <Image
              src={logo}
              alt="Brewhaus Dog Bones Logo"
              height={120}
              width={150}
            />
            <Typography.Title
              level={isTabletOrMobile ? 4 : 2}
              style={{
                color: "white",
                marginBottom: 0,
                marginLeft: 10,
                textAlign: "right",
              }}
            >
              Brewhaus Dog Bones Bourbon Raffle 2022
            </Typography.Title>
          </div>
        </Header>

        <Content style={{ minHeight: "90vh" }}>
          <Loading isLoading={isLoading}>
            <div
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                maxWidth: 960,
              }}
            >
              <Carousel />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                {raffleTicket && (
                  <div>
                    <div style={{ marginBottom: 10 }}>
                      <b>Price per ticket:</b> {getPrice(raffleTicket)}
                    </div>
                    <div style={{ flexDirection: "row" }}>
                      <b>Quantity:</b>
                      <InputNumber
                        style={{ marginLeft: 10 }}
                        min={0}
                        onChange={(count) => {
                          setPurchaseCount(count as number);
                        }}
                        value={purchaseCount}
                      />
                    </div>
                  </div>
                )}
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBuyNow}
                  disabled={purchaseCount < 1}
                >
                  Buy Now
                </Button>
              </div>
              <Divider />
              <Typography.Paragraph
                style={{ paddingLeft: 10, paddingRight: 10 }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography.Paragraph>
              <Divider />
              <Typography.Paragraph
                style={{ paddingLeft: 10, paddingRight: 10 }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography.Paragraph>
            </div>
            <Modal
              title="Are you 21 years old?"
              open={!is21}
              onOk={() => setIs21(true)}
              onCancel={() => (window.location.href = "https://www.google.com")}
              okText="Yes, Proceed!"
              cancelText="No"
              closable={false}
            >
              <p>You must be 21 years old to enter this site.</p>
            </Modal>
          </Loading>
        </Content>

        <Footer
          style={{
            textAlign: "center",
          }}
        >
          <Divider />
          Brewhaus Dog Bones 2022
        </Footer>
      </div>
    </Layout>
  );
};

export default Home
