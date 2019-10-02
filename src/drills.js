require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

function getSearchTerm(searchTerm) {
  knexInstance
    .select("name")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// getSearchTerm("burger");

function paginateProducts(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select("id", "name", "price", "category")
    .from("shopping_list")
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// paginateProducts(2);

function addedAfterDate(daysAgo) {
  knexInstance
    .select("id", "name", "price", "category", "date_added")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result);
    });
}

// addedAfterDate(7);

function costPerCategory() {
  knexInstance
    .select("category")
    .sum("price as total")
    .from("shopping_list")
    .groupBy("category")
    .then(result => {
      console.log(result);
    });
}

costPerCategory();
