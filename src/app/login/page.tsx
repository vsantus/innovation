import Image from "next/image";

import { LoginForm } from "@/features/auth/components/LoginForm";
import menWorkedImage from "@/assets/men_worked.png";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Image
        src={menWorkedImage}
        alt="Profissional usando notebook"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />


      <section
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "grid",
          alignItems: "center",
          justifyItems: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            width: "min(100%, 980px)",
            display: "grid",
            justifyItems: "center",
            gap: "2.4rem",
          }}
        >
          <h1
            style={{
              margin: 0,
              textAlign: "center",
              color: "#8ec605",
              fontSize: "clamp(2rem, 4vw, 3.3rem)",
              lineHeight: 1.08,
              fontWeight: 600,
            }}
          >
            Bem-vindo à Innovation Brindes
          </h1>

          <div
            style={{
              width: "min(100%, 760px)",
              borderRadius: "16px",
              background: "#8ec605",
              padding: "3rem 1.5rem",
              boxShadow: "0 24px 50px rgba(79, 117, 7, 0.22)",
              display: "grid",
              justifyItems: "center",
            }}
          >
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
