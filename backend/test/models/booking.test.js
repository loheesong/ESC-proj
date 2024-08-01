const {
  validate_input,
  create_booking,
  get_bookings_by_userid,
  delete_by_bookingid,
} = require("../../models/booking");
const db = require("../../models/db");
afterAll(() => {
  // Closing the DB connection allows Jest to exit successfully.
  db.cleanup();
});

jest.mock("../../models/db");
const table_name = "bookings";

let valid_json = {
  hotel_name: "testHotel",
  room_name: "testRoom",
  location: "testLocation",
  price: "testPrice",
  checkin_date: "testCIDate",
  checkout_date: "testCOdate",
  book_date: "testBDate",
  room_img_src: "imageurl",
  message: "testMSG",
  userID: 100000,
  name: "testName",
  cardNumber: "0123456789123456",
  expiryDate: "01/01",
  cvv: "111",
};

describe("booking model functions", () => {
  describe("JSON validation tests (func validate_input(json))", () => {
    test("Invalid Datatype: hotel_name -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.hotel_name = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: room_name -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.room_name = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: location -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.location = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: price -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.price = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: checkin_date -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.checkin_date = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: checkout_date -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.checkout_date = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: book_date -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.book_date = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: room_img_src -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.room_img_src = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: message -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.message = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: userID -> string", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.userID = "420";
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: name -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.name = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: cardNumber -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.cardNumber = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: expiryDate -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.expiryDate = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Invalid Datatype: cvv -> int", async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      invalid_json.cvv = 1;
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test('Invalid replaced key: "cvv" with "security_code"', async () => {
      let invalid_json = JSON.parse(JSON.stringify(valid_json));
      delete invalid_json.cvv;
      invalid_json.security_code = "111";
      const actual_res = validate_input(invalid_json);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
    });

    test("Valid input: all json fields are correct", async () => {
      const actual_res = validate_input(valid_json);
      const expected_res = true;
      expect(actual_res).toStrictEqual(expected_res);
    });
  });

  describe("delete validation tests: (func delete_by_bookingid(booking_id))", () => {
    // this is a unit test for the function, and mocking response from the database is sufficient
    test("Non-existent id: bookingid not found", async () => {
      const booking_id = "non_existing_id";
      db.cnx.query = jest.fn().mockResolvedValue([{ affectedRows: 0 }, []]);
      const consoleSpy = jest.spyOn(console, "log");
      const actual_res = await delete_by_bookingid(booking_id);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
      expect(db.cnx.query).toHaveBeenCalledWith(
        `DELETE FROM ${table_name} WHERE booking_id = ?`,
        [booking_id]
      );
      expect(consoleSpy).toHaveBeenCalledWith("bookingid not found");
      consoleSpy.mockRestore();
    });

    test("Erronous id: error occurs during deletion", async () => {
      const booking_id = "any_id";
      db.cnx.query = jest.fn().mockRejectedValue(new Error("Database error"));
      const consoleSpy = jest.spyOn(console, "log");
      const actual_res = await delete_by_bookingid(booking_id);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
      expect(consoleSpy).toHaveBeenCalledWith("Failed to delete booking:", new Error("Database error"));
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to delete booking:",
        new Error("Database error")
      );
      consoleSpy.mockRestore();
    });

    test("Valid id: bookingid found and deleted", async () => {
      const booking_id = "existing_id";
      db.cnx.query = jest.fn().mockResolvedValue([{ affectedRows: 1 }, []]);
      const actual_res = await delete_by_bookingid(booking_id);
      const expected_res = true;
      expect(actual_res).toStrictEqual(expected_res);
      expect(db.cnx.query).toHaveBeenCalledWith(
        `DELETE FROM ${table_name} WHERE booking_id = ?`,
        [booking_id]
      );
    });
  });

  describe("Get bookings validation tests: (func get_bookings_by_userid(useridjson))", () => {
    test("Error occured: should handle error during database query", async () => {
      const user_id = { user: 1 };
      const consoleSpy = jest.spyOn(console, "log");
      db.cnx.query = jest.fn().mockRejectedValue(new Error("Database error"));
      const actual_res = await get_bookings_by_userid(user_id);
      const expected_res = false;
      expect(actual_res).toStrictEqual(expected_res);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to get_bookings_by_userid"
      );
      expect(db.cnx.query).toHaveBeenCalledWith(
        `select * from ${table_name} where userid=${user_id.user}`
      );
      consoleSpy.mockRestore();
    });

    test("Non-existent user: should return empty array if user_id not found", async () => {
      const user_id = { user: 2 };
      const consoleSpy = jest.spyOn(console, "log");
      db.cnx.query = jest.fn().mockResolvedValue([[], []]);
      const actual_res = await get_bookings_by_userid(user_id);
      const expected_res = [];
      expect(actual_res).toStrictEqual(expected_res);
      expect(consoleSpy).toHaveBeenCalledWith(
        `select * from ${table_name} where userid=${user_id.user}`
      );
      expect(db.cnx.query).toHaveBeenCalledWith(
        `select * from ${table_name} where userid=${user_id.user}`
      );
    });

    test("Existing booking and user: should return bookings for the given user_id", async () => {
      const user_id = { user: 1 };
      const consoleSpy = jest.spyOn(console, "log");
      // mocked response
      const expectedRows = [
        {
          hotel_name: "Hotel A",
          room_name: "Super suite",
          location: "SUTD",
          price: "2000000",
          checkin_date: "2024-08-01",
          checkout_date: "2024-08-05",
          book_date: "2024-07-15",
          room_img_src: "image_url_1",
          message: "I'm broke",
          userID: 1,
          name: "Peepee Poopoo",
          cardNumber: "0123456789123456",
          expiryDate: "12/24",
          cvv: "123",
        },
        {
          hotel_name: "Hotel B",
          room_name: "smol room",
          location: "SUTD",
          price: "1",
          checkin_date: "2024-09-10",
          checkout_date: "2024-09-12",
          book_date: "2024-08-20",
          room_img_src: "image_url_2",
          message: "I'm in pain",
          userID: 1,
          name: "Peepee Poopoo",
          cardNumber: "6543210987654321",
          expiryDate: "11/23",
          cvv: "456",
        },
      ];
      db.cnx.query = jest.fn().mockResolvedValue([expectedRows, []]);
      const actual_res = await get_bookings_by_userid(user_id);
      const expected_res = expectedRows;
      expect(actual_res).toStrictEqual(expected_res);
      expect(consoleSpy).toHaveBeenCalledWith(
        `select * from ${table_name} where userid=${user_id.user}`
      );
      expect(db.cnx.query).toHaveBeenCalledWith(
        `select * from ${table_name} where userid=${user_id.user}`
      );
      consoleSpy.mockRestore();
    });
  });

  describe("Create bookings validation tests: (func create_booking(details_json))", () => {
    let consoleSpy;

    beforeAll(async () => {
      consoleSpy = jest.spyOn(console, "log"); //.mockImplementation(() => {}); // Mock implementation to avoid actual console.log during tests
      // await db.cnx.query(`CREATE TABLE IF NOT EXISTS ${table_name} (
      //     booking_id INT AUTO_INCREMENT PRIMARY KEY,
      //     hotel_name VARCHAR(255),
      //     room_name VARCHAR(255),
      //     location VARCHAR(255),
      //     price VARCHAR(255),
      //     checkin_date VARCHAR(255),
      //     checkout_date VARCHAR(255),
      //     book_date VARCHAR(255),
      //     room_img_src VARCHAR(255),
      //     message TEXT,
      //     userID INT,
      //     name VARCHAR(255),
      //     cardNumber VARCHAR(255),
      //     expiryDate VARCHAR(255),
      //     cvv VARCHAR(255)
      // )`);
    });

    afterAll(async () => {
      await db.cleanup(); // Close the DB connection to allow Jest to exit successfully
    });

    afterEach(async () => {
      consoleSpy.mockRestore(); // Restore original console.log after each test
      await db.cnx.query(`DELETE FROM ${table_name}`); // Clean up the table after each test
    });

    test('Invalid json: should return false and log "invalid json" for invalid input', async () => {
      const details_json = { invalid: "data" };

      // Call the function
      const actual_res = await create_booking(details_json);

      // Define the expected result
      const expected_res = false;

      // Verify the function returns the expected result
      expect(actual_res).toStrictEqual(expected_res);

      // Check that the appropriate log message was logged
      expect(consoleSpy).toHaveBeenCalledWith("Validating...");

    });

    test("Valid json: should create booking for valid input and log messages", async () => {
      const details_json = valid_json;

      // Mock the database query to simulate successful insertion
      db.cnx.query = jest.fn().mockResolvedValue([{}, []]);

      // Call the function
      const actual_res = await create_booking(details_json);

      // Define the expected result
      const expected_res = true;

      // Verify the function returns the expected result
      expect(actual_res).toStrictEqual(expected_res);

      // Check that the appropriate log messages were logged
      // expect(consoleSpy).toHaveBeenCalledWith("Validating...");
      // expect(consoleSpy).toHaveBeenCalledWith("valid input");
      // expect(consoleSpy).toHaveBeenCalledWith("Validated :D");
      // expect(consoleSpy).toHaveBeenCalledWith("successfully created booking");

      // Query the database to ensure the row was inserted
      const [rows] = await db.cnx.query(
        `SELECT * FROM ${table_name} WHERE userID = ?`,
        [details_json.userID]
      );
      expect(rows.length).toBe(1);
      expect(rows[0]).toMatchObject(details_json);
    });

    test('should handle error during booking creation and log "Failed to create booking"', async () => {
      const details_json = {
        hotel_name: "Hotel A",
        room_name: "Deluxe Suite",
        location: "New York",
        price: "200",
        checkin_date: "2023-08-01",
        checkout_date: "2023-08-05",
        book_date: "2023-07-15",
        room_img_src: "image_url_1",
        message: "Looking forward to my stay!",
        userID: 1,
        name: "John Doe",
        cardNumber: "0123456789123456",
        expiryDate: "12/24",
        cvv: "123",
      };

      // Simulate a database error by throwing an error in the query
      db.cnx.query = jest.fn().mockRejectedValue(new Error("Database error"));

      // Call the function
      const actual_res = await create_booking(details_json);

      // Define the expected result
      const expected_res = false;

      // Verify the function returns the expected result
      expect(actual_res).toStrictEqual(expected_res);

      // Check that the error message was logged
      expect(consoleSpy).toHaveBeenCalledWith("Failed to create booking");
    });
  });
});
