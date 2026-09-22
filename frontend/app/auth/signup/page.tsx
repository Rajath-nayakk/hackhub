import AuthConsole from "@/components/auth/AuthConsole";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Initialize Engineer Profile | HackHub",
  description: "Create your student developer credentials to join teams and showcase builds.",
};

export default function SignupPage() {
  return <AuthConsole initialMode="signup" />;
}