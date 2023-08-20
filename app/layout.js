import "../styles/App.scss";

// lib
import { AuthProvider } from "@/component/providers";
export const metadata = {
  title: "QnA",
  description:
    "Qna is a web application that enhances memory retention through active recall. Users create personalized question-and-answer collections, and the web app utilizes active recall techniques to prompt information retrieval, boosting long-term memory. QnA's intelligent review system highlights questions needing review after seven days or a set due date, ensuring effective learning and memory reinforcement.",
};
export const revalidate = 0;
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
