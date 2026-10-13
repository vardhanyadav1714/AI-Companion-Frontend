import { companions, type Companion } from "./companions";

const generatedPortraits = [
  { id: "portrait_anaya", name: "Anaya", image: { src: "/images/companions/portraits/portrait_anaya.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_meera", name: "Meera", image: { src: "/images/companions/portraits/portrait_meera.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_zoya", name: "Zoya", image: { src: "/images/companions/portraits/portrait_zoya.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_tara", name: "Tara", image: { src: "/images/companions/portraits/portrait_tara.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_isha", name: "Isha", image: { src: "/images/companions/portraits/portrait_isha.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_leena", name: "Leena", image: { src: "/images/companions/portraits/portrait_leena.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_noor", name: "Noor", image: { src: "/images/companions/portraits/portrait_noor.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_sana", name: "Sana", image: { src: "/images/companions/portraits/portrait_sana.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_maya", name: "Maya", image: { src: "/images/companions/portraits/portrait_maya.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_kiara", name: "Kiara", image: { src: "/images/companions/portraits/portrait_kiara.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_aditi", name: "Aditi", image: { src: "/images/companions/portraits/portrait_aditi.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } },
  { id: "portrait_rhea", name: "Rhea", image: { src: "/images/companions/portraits/portrait_rhea.webp", sheetPosition: "0% 0%", focalPoint: "50% 42%" } }
];

export const portraitOptions: Companion[] = [
  ...companions,
  ...generatedPortraits.map(portrait => ({ ...companions[0], ...portrait }))
];
