import type { MetadataRoute } from "next";
import { person, home } from "@/app/resources";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${person.name} – ${person.role}`,
    short_name: person.firstName,
    description: home.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    icons: [{ src: "/images/profile/profile.jpg", sizes: "512x512", type: "image/jpeg" }],
  };
}
