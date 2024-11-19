import { IoLogoWhatsapp } from "react-icons/io5"

const WhatsAppButton = () => {
  const whatsappNumber = "+5491138126428";
  const message = "Hola! :) Necesito ayuda con mi compra de letsChu!";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition opacity-35 hover:opacity-100"
    >
      <IoLogoWhatsapp 
        className="text-white text-2xl"
        size={18}
      />
    </a>
  );
};

export default WhatsAppButton;
