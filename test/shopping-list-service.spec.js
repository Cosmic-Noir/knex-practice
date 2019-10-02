const ShoppingListService = require("../src/shopping-list-service");

const knex = require("knex");

describe(`ShoppingList service object`, () => {
  // Set up db, test items, and handle removing after testing
  let db;
  let testItems = [
    {
      id: 1,
      name: "First test product",
      price: 10,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      category: "Lunch",
      checked: false
    },
    {
      id: 2,
      name: "Second test product",
      price: 9,
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      category: "Breakfast",
      checked: false
    },
    {
      id: 3,
      name: "Third test product",
      price: 6,
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      category: "Main",
      checked: false
    }
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });
  after(() => db.destroy());
  before(() => db("shopping_list").truncate());
  afterEach(() => db("shopping_list").truncate());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    it(`getAllProducts() resolves all products from 'shopping_list' table`, () => {
      // test that ShoppingListService.getAllProducts() gets all data from table
      return ShoppingListService.getAllProducts(db).then(actual => {
        expect(actual).to.eql(testItems);
      });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestItem.name,
          price: thirdTestItem.price,
          date_added: thirdTestItem.date_added,
          category: thirdTestItem.category,
          checked: false
        });
      });
    });

    it(`updateItem() updates an item from 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "updated name",
        price: 10,
        category: "Lunch",
        checked: false,
        date_added: new Date()
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData
          });
        });
    });

    it(`deleteItem() removes an item by id from 'shoppping_list' table`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllProducts(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        name: "New test product",
        price: 11,
        date_added: new Date("2029-01-22T16:28:32.615Z"),
        category: "Lunch",
        checked: false
      };
      return ShoppingListService.insertItem(db, newItem).then(actual => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: new Date(newItem.date_added),
          category: newItem.category,
          checked: false
        });
      });
    });
  });
});
