import * as React from "react"
import { createRoot } from "react-dom/client"
import MarginaliaPortfolioTemplate from "../components/marginalia-portfolio-template/marginalia-portfolio-template"
import "./style.css"

// Adjust the page backgrounds and pencil colours here.
const portfolioColors = {
  paper: "#f3edf7",
  night: "#292331",
  ink: "#28212f",
  pen: "#087570",
  penNight: "#73e0d3",
}

createRoot(document.getElementById("root")!).render(
  <MarginaliaPortfolioTemplate
    name="Sarah Guhaina"
    docLabel="Portfolio"
    portrait="/sarah-guhaina-portrait.png"
    cvUrl="https://3dportfolioview01.vercel.app/"
    cvNote="scan to visit my portfolio"
    education={[
      { title: "UX/UI Design Studies", place: "University of the Arts London", period: "2025" },
      { title: "Digital Design Studies", place: "University of Westminster", period: "2024" },
      { title: "Visual Communication", place: "University of Leeds", period: "2023", circled: true },
      { title: "Digital Media and Design", place: "University of Manchester", period: "2021 — 2026", circled: true },
    ]}
    languages={[
      { name: "English", level: "C1", value: 0.86 },
      { name: "Urdu", level: "Native", value: 1 },
      { name: "Arabic", level: "B2", value: 0.72 },
    ]}
    colors={portfolioColors}
  />
)
