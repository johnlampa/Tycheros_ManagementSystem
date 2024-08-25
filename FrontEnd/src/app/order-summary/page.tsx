import OrderCard from "@/components/OrderCard";

export default function Page() {
  const MenuData = [
    {
      productId: 1,
      productName: "Matcha",
      categoryName: "Milk Tea",
      sellingPrice: 90.0,
      imageUrl: "/assets/images/MilkTea.jpg",
    },
    {
      productId: 2,
      productName: "Match",
      categoryName: "Milk Tea",
      sellingPrice: 90.0,
      imageUrl: "/assets/images/MilkTea.jpg",
    },
  ];

  return (
    <>
      <div className="w-full flex justify-center items-center ">
        <div className="w-[360px] flex flex-col justify-center items-center gap-3 border border-black">
          <div className="font-semibold font-2xl">Order Summary</div>
          {/* <OrderCard order={}; //create a global order state accessed through contextapi
    menuData: ProductDataTypes[];
    quantityModalIsVisible: boolean;
    setQuantityModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;></OrderCard> */}
        </div>
      </div>
    </>
  );
}
