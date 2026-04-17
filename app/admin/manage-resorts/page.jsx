import ManageResorts from "../../components/ManageResorts";
import AdminNav from "../../components/AdminNav";

const ManageResortsPage = async () => {
  return (
    <div className="flex flex-col min-h-screen bg-luxury-cream md:flex-row">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <ManageResorts />
      </main>
    </div>
  );
};

export default ManageResortsPage;
