import ProductCollection from "./ProductCollection";

export default async function ResortListing({ initialSearch = "" }) {
  return (
    <ProductCollection initialSearch={initialSearch} />
  );
}
