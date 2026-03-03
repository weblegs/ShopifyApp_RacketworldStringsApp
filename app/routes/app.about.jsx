import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function About() {
  return (
    <s-page heading="About WebLegs Stringer">
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <img
          src="https://cdn.shopify.com/s/files/1/0830/3512/8126/files/weblegslogo.avif?v=1772532645"
          alt="Weblegs Logo"
          style={{ height: "50px" }}
        />
      </div>

      <s-section>
        <s-paragraph>
          At WebLegs, we're passionate about tennis and understand the importance
          of the perfect string setup. We've developed WebLegs Stringer, a custom
          Shopify app to simplify string selection and tension management for your
          tennis and racket shop. Our goal is to streamline your operations,
          enhance the customer experience, and ensure that every player finds the
          ideal strings for their game.
        </s-paragraph>
      </s-section>

      <s-section heading="Key Features">
        <s-unordered-list>
          <s-list-item>
            <strong>Intuitive Interface:</strong> Easily manage custom string
            selections and tensions within your Shopify store.
          </s-list-item>
          <s-list-item>
            <strong>Seamless Integration:</strong> Push string data directly to
            the cart and checkout for a smooth customer experience.
          </s-list-item>
          <s-list-item>
            <strong>Enhanced Customer Experience:</strong> Empower your customers
            to personalise their racket setup with confidence.
          </s-list-item>
          <s-list-item>
            <strong>Efficient Operations:</strong> Streamline your string
            management process and save valuable time.
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section>
        <s-paragraph>
          We're committed to helping your shop thrive in the competitive tennis
          market. With WebLegs Stringer, you can focus on providing exceptional
          service while we handle the technical details.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
