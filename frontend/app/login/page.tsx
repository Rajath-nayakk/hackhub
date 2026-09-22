import AuthConsole from "@/components/auth/AuthConsole";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Portal | HackHub",
  description: "Secure login portal for engineering builders and hackathon teams.",
};

export default function LoginPage() {
  return <AuthConsole initialMode="login" />;
}