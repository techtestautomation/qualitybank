import "dotenv/config";

async function main() {
  const { resetDemoData } = await import("../src/lib/test-data");

  await resetDemoData();

  console.log("QualityBank demo data seeded.");
}

main().catch((error) => {
  console.error("Failed to seed QualityBank demo data.", error);
  process.exit(1);
});