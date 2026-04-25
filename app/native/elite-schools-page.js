import fs from "node:fs";
import path from "node:path";
import schoolsData from "@/elite-schools-influence-2025.json";
import EliteSchoolsClient from "@/app/elite-schools/EliteSchoolsClient";

export default function EliteSchoolsPage() {
  const provinceData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "elite-schools-provinces.geojson"), "utf8"),
  );

  return <EliteSchoolsClient schoolsData={schoolsData} provinceData={provinceData} />;
}
