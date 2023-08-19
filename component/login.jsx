"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        // alert("Invalid Credentials")
        setError("Invalid Credentials");
        return;
      }

      console.log(res);
      router.replace("admin/welcome");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin_login">
      <div className="admin_login_container">
        <h1 className="admin_login_header_text">Admin Login</h1>
<p className="admin_login_header_warning_text">Stay away if you are not <Link href={'https://www.calebareeveso.com'}>CALEB 😎</Link></p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            name="email"
            className="admin_login_input"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            name="password"
            className="admin_login_input"
          />
          <button className="admin_login_input_button">
            Login
          </button>
          {error && (
            <div className="admin_login_error">
              <p>{error}</p>
            </div>
          )}

         
        </form>
      </div>
    </div>
  );
}
