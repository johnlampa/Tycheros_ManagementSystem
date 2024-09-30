import Link from "next/link";
import { MenuHeaderSectionProps } from "../../../lib/types/props/MenuHeaderSectionProps";
import Header from "@/components/Header";

const MenuHeaderSection: React.FC<MenuHeaderSectionProps> = ({
  menuType,
  categories,
}) => {
  let text = "";
  if (menuType === "food") {
    text = "Food Menu";
  }
  if (menuType === "bar") {
    text = "Bar Menu";
  }

  return (
    <>
      <Header text={text} type={"menu"} color={"cream"}>
        <Link href={"/"} className="z-100">
          <button>
            <span className="text-white">Back</span>
          </button>
        </Link>
      </Header>
      <div className="h-[68px] border-x-0 border-y-[1px] border-primaryBrown bg-tealGreen flex justify-center items-center">
        <div className="w-max grid grid-cols-3 gap-x-5 gap-y-2">
          {categories.map((category) => (
            <Link key={category.categoryID} href={`#${category.categoryName}`}>
              <div
                className={`w-[88px] h-[25px] rounded-sm border border-white flex justify-center items-center ${
                  category.categoryID === 4 ? "text-md" : "text-lg"
                }  font-pattaya text-white`}
              >
                {category.categoryName}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuHeaderSection;
