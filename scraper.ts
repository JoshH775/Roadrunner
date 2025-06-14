import { load } from "cheerio";
import { Car } from "./types";
import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_PUBLIC_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);
const SCRAPER_KEY = process.env.SCRAPER_KEY || "";

const cars: Car[] = []



async function scrapeCars() {
  console.log("Starting scraper...");
  const start = Date.now();
  const url = "https://forza.fandom.com/wiki/Forza_Horizon_5/Cars";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    const $ = load(html);

    const table = $("table.table.sortable").first();

    const rows = table.find("tbody tr");

    rows.each((index, row) => {
      if (index === 0) return; // Limit to first 5 rows for demonstration
      const fields = $(row).find("td");

      const nameField = fields.first().find("div").eq(1);
      const name = nameField.find("a").text().trim();
      const year = nameField.text().split(" ").at(-1)?.trim() || "";

      const pi = fields.eq(12).text().trim().slice(-3);

      const car: Car = {
        id: index, // Using index as a simple ID
        name,
        year: parseInt(year, 10),
        pi: parseInt(pi, 10),
      };

      cars.push(car);
    });

    await supabase.from("cars").upsert(cars);
    const end = Date.now();
    console.log(`Scraped ${cars.length} cars in ${end - start} ms`);
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
}

scrapeCars();