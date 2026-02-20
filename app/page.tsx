"use client";
import dynamic from "next/dynamic";
const SummerQuiz = dynamic(() => import("../components/SummerQuiz"), { ssr: false });
export default function Home() { return <SummerQuiz />; }
