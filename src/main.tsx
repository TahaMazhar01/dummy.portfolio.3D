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
    portrait="/sarah-guhaina-portrait.png"
    cvUrl="https://portfolio.view01.vercel.app/"
    cvNote="scan to visit my portfolio"
    colors={portfolioColors}
  />
)
