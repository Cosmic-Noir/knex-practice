const ShoppingListService = {
  getAllProducts(knex) {
    return knex.select("*").from("shopping_list");
  }
};

module.exports = ShoppingListService;
