import SiteLayout from "./layout/SiteLayout";
import ProductCollection from "./ProductCollection";

export default async function ResortListing({ initialSearch = "" }) {
  return (
    <SiteLayout>
      <ProductCollection initialSearch={initialSearch} />
    </SiteLayout>
  );
}
