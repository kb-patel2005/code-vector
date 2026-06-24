require("dotenv").config();
const sequelize = require("./models/db");
const Product = require("./models/Product");

async function seed() {
  await sequelize.sync(); // ensure table exists

  const categories = ["Electronics", "Books", "Clothing", "Toys"];
  const batchSize = 10000;

  for (let batch = 0; batch < 20; batch++) {
    const bulk = [];
    for (let i = 0; i < batchSize; i++) {
      const idx = batch * batchSize + i;
      bulk.push({
        name: `Product ${idx}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: +(Math.random() * 500).toFixed(2),
        created_at: new Date(Date.now() - idx * 1000),
        updated_at: new Date(Date.now() - idx * 1000)
      });
    }
    await Product.bulkCreate(bulk);
    console.log(`Inserted batch ${batch + 1}/20`);
  }

  console.log("Seeded 200,000 products");
  process.exit();
}

seed().catch(console.error);
