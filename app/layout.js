import "../styles/App.scss";
import { headers } from "next/headers";
// component
import Nav from "@/component/nav";
import Header from "@/component/header";

// lib
import formattedDate from "@/lib/fDate";
import { AuthProvider } from "@/component/providers";
export const metadata = {
  title: "QnA",
  description:
    "Qna is a web application that enhances memory retention through active recall. Users create personalized question-and-answer collections, and the web app utilizes active recall techniques to prompt information retrieval, boosting long-term memory. QnA's intelligent review system highlights questions needing review after seven days or a set due date, ensuring effective learning and memory reinforcement.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
