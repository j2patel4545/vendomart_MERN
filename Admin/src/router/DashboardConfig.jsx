import {
  MdDashboard,
  MdPeople,
  MdCategory,
  MdInventory2,
  MdPhotoLibrary,
  MdSettings,
  MdPerson,
} from "react-icons/md";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import ProductType from "../pages/MasterPages/ProductType";
import ProductSlider from "../pages/MasterPages/ProductSlider";
import ProductMaster from "../pages/MasterPages/ProductMaster";

export const dashboardMenu = [
  {
    label: "Dashboard",
    path: "dashboard",
    icon: MdDashboard,
    element: <Dashboard />,
  },
  {
    label: "Users",
    path: "users",
    icon: MdPeople,
    element: <Users />,
  },
  {
    label: "Product Type",
    path: "productType",
    icon: MdCategory, // better icon for product type
    element: <ProductType />,
  },
  {
    label: "Product Master",
    path: "productMaster",
    icon: MdInventory2, // inventory icon for products
    element: <ProductMaster />,
  },
  {
    label: "Product Slider",
    path: "productSlider",
    icon: MdPhotoLibrary, // gallery/photo icon
    element: <ProductSlider />,
  },
  {
    label: "Settings",
    path: "settings",
    icon: MdSettings,
    element: <Settings />,
  },
  {
    label: "Profile",
    path: "profile",
    icon: MdPerson,
    element: <Profile />,
  },
];
