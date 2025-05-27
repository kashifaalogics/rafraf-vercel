import { FunctionComponent, useEffect } from "react";
import { CategoriesNav, Footer, Navbar } from "@components/common";
import { Category } from "@common/types/category";
import { useRouter } from "next/router";
import { useUI } from "@components/ui/constext";
import { Image, Modal, Sidebar } from "@components/ui";
import MobileHeaderSidebar from "../MobileHeaderSidebar";
import { A } from "@components/typography";
import { WhatsAppSticky } from "../WhatsAppSticky";

interface Props {
  categories: Category[];
}

const Layout: FunctionComponent<Props> = ({ categories, children }) => {
  const router = useRouter();
  const {
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    isSidebarOpen,
    closeSidebar,
  } = useUI();


  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Modal open={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
      <WhatsAppSticky />
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <MobileHeaderSidebar categories={categories} />
      </Sidebar>
      <CategoriesNav categories={categories || []} />
      <main className="fit min-height">{children}</main>
      <Footer categories={categories} />
    </div>
  );
};

export default Layout;
