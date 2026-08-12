import { openDatabase } from "expo-sqlite/legacy";

// Centralized database instance
const db = openDatabase("db");

// Validation constants
const VALID_SORT_COLUMNS = ['id', 'receivedDate', 'paymentDate', 'location', 'lotnumber', 'item', 'quantity', 'unit', 'marka', 'balance'];
const VALID_SORT_ORDERS = ['asc', 'desc'];
const VALID_TABLES = ['Inward', 'Outward', 'User'];

// Validation functions
const validateSortColumn = (column) => {
  return VALID_SORT_COLUMNS.includes(column) ? column : 'id';
};

const validateSortOrder = (order) => {
  return VALID_SORT_ORDERS.includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';
};

const validateTableName = (tableName) => {
  return VALID_TABLES.includes(tableName) ? tableName : null;
};

class DatabaseService {
  // Generic query execution
  static async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error('Database query error:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Generic transaction execution
  static async transaction(callback) {
    return new Promise((resolve, reject) => {
      db.transaction(
        callback,
        (error) => {
          console.error('Database transaction error:', error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  }

  // Check if database exists
  static async checkDatabase() {
    try {
      const result = await this.query(
        "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='User'"
      );
      return result.rows.item(0).count > 0;
    } catch (error) {
      console.error('Error checking database:', error);
      return false;
    }
  }

  // Create database and tables
  static async createDatabase(pin, email) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // Create Inward table
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Inward (id INTEGER PRIMARY KEY AUTOINCREMENT, receivedDate INTEGER, paymentDate INTEGER, location TEXT, lotnumber TEXT, item TEXT, quantity INTEGER, unit TEXT, marka TEXT, balance INTEGER, imageExist INTEGER, imageName TEXT)",
          [],
          () => {
            console.log("Inward table created successfully");
            
            // Create Outward table
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS Outward (id INTEGER PRIMARY KEY AUTOINCREMENT, receivedDate INTEGER, gatePassDate INTEGER, location TEXT, lotnumber TEXT, item TEXT, quantity INTEGER, issued INTEGER, unit TEXT, marka TEXT, balance INTEGER, receivedId INTEGER, gatepass TEXT)",
              [],
              () => {
                console.log("Outward table created successfully");
                
                // Create User table
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT, pin TEXT, email TEXT, biometric INTEGER)",
                  [],
                  () => {
                    console.log("User table created successfully");
                    
                    // Insert initial user
                    tx.executeSql(
                      "INSERT INTO User (pin, email) VALUES (?, ?)",
                      [pin, email],
                      () => {
                        console.log("User created successfully");
                        resolve();
                      },
                      (_, error) => {
                        console.error("Error creating user:", error);
                        reject(error);
                      }
                    );
                  },
                  (_, error) => {
                    console.error("Error creating User table:", error);
                    reject(error);
                  }
                );
              },
              (_, error) => {
                console.error("Error creating Outward table:", error);
                reject(error);
              }
            );
          },
          (_, error) => {
            console.error("Error creating Inward table:", error);
            reject(error);
          }
        );
      });
    });
  }

  // User operations
  static async getUser() {
    try {
      const result = await this.query("SELECT * FROM User LIMIT 1");
      return result.rows._array;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async checkUser() {
    try {
      const result = await this.query("SELECT * FROM User LIMIT 1");
      return result.rows._array;
    } catch (error) {
      console.error('Error checking user:', error);
      throw error;
    }
  }

  static async checkPassword(password) {
    try {
      const result = await this.query("SELECT * FROM User WHERE pin = ?", [password]);
      return result.rows._array;
    } catch (error) {
      console.error('Error checking password:', error);
      throw error;
    }
  }

  static async updateUserPin(pin) {
    try {
      await this.query("UPDATE User SET pin = ?", [pin]);
    } catch (error) {
      console.error('Error updating user PIN:', error);
      throw error;
    }
  }

  static async updateBiometric(biometric) {
    try {
      await this.query("UPDATE User SET biometric = ?", [biometric]);
    } catch (error) {
      console.error('Error updating biometric:', error);
      throw error;
    }
  }

  // Inward operations
  static async insertInward(data) {
    try {
      await this.query(
        "INSERT INTO Inward (receivedDate, paymentDate, location, lotnumber, item, quantity, unit, marka, balance, imageExist, imageName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.receivedDate,
          data.paymentDate,
          data.location,
          data.lotnumber,
          data.item,
          data.quantity,
          data.unit,
          data.marka,
          data.balance,
          data.imageExist,
          data.imageName,
        ]
      );
    } catch (error) {
      console.error('Error inserting inward:', error);
      throw error;
    }
  }

  static async getAllInwardsWithCount(limit, offset, sortBy, sortOrder, searchQuery) {
    try {
      let dataQuery = "SELECT * FROM Inward";
      let countQuery = "SELECT count(*) as count FROM Inward";
      const params = [];

      if (searchQuery) {
        const searchCondition = " WHERE item LIKE ? OR lotnumber LIKE ? OR marka LIKE ?";
        dataQuery += searchCondition;
        countQuery += searchCondition;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
      }

      if (sortBy) {
        const validatedSortBy = validateSortColumn(sortBy);
        const validatedSortOrder = validateSortOrder(sortOrder);
        dataQuery += ` ORDER BY ${validatedSortBy} ${validatedSortOrder}`;
      }

      dataQuery += " LIMIT ? OFFSET ?";
      params.push(limit, offset);

      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          // Execute count query first
          tx.executeSql(
            countQuery,
            searchQuery ? params.slice(0, 3) : [],
            (_, countResult) => {
              const totalCount = countResult.rows.item(0).count;
              
              // Then execute data query
              tx.executeSql(
                dataQuery,
                params,
                (_, dataResult) => {
                  resolve({
                    data: dataResult.rows._array,
                    totalCount: totalCount
                  });
                },
                () => reject("error fetching data")
              );
            },
            () => reject("error fetching count")
          );
        });
      });
    } catch (error) {
      console.error('Error getting inwards with count:', error);
      throw error;
    }
  }

  static async getInwardById(id) {
    try {
      const result = await this.query("SELECT * FROM Inward WHERE id = ?", [id]);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting inward by ID:', error);
      throw error;
    }
  }

  static async updateInward(data) {
    try {
      await this.query(
        "UPDATE Inward SET receivedDate = ?, paymentDate = ?, location = ?, lotnumber = ?, item = ?, quantity = ?, unit = ?, marka = ?, balance = ?, imageExist = ?, imageName = ? WHERE id = ?",
        [
          data.receivedDate,
          data.paymentDate,
          data.location,
          data.lotnumber,
          data.item,
          data.quantity,
          data.unit,
          data.marka,
          data.balance,
          data.imageExist,
          data.imageName,
          data.id,
        ]
      );
    } catch (error) {
      console.error('Error updating inward:', error);
      throw error;
    }
  }

  static async deleteInward(id) {
    try {
      await this.query("DELETE FROM Inward WHERE id = ?", [id]);
    } catch (error) {
      console.error('Error deleting inward:', error);
      throw error;
    }
  }

  // Outward operations
  static async insertOutward(data) {
    try {
      await this.query(
        "INSERT INTO Outward (receivedDate, gatePassDate, location, lotnumber, item, quantity, issued, unit, marka, balance, receivedId, gatepass) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.receivedDate,
          data.gatePassDate,
          data.location,
          data.lotnumber,
          data.item,
          data.quantity,
          data.issued,
          data.unit,
          data.marka,
          data.balance,
          data.receivedId,
          data.gatepass,
        ]
      );
    } catch (error) {
      console.error('Error inserting outward:', error);
      throw error;
    }
  }

  static async getOutwardCount() {
    try {
      const result = await this.query("SELECT COUNT(*) as count FROM Outward");
      return result.rows.item(0).count;
    } catch (error) {
      console.error('Error getting outward count:', error);
      throw error;
    }
  }

  static async getAllOutward(limit, offset, sortBy, sortOrder, searchQuery) {
    try {
      let query = "SELECT * FROM Outward";
      const params = [];

      if (searchQuery) {
        query += " WHERE item LIKE ? OR lotnumber LIKE ? OR marka LIKE ?";
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
      }

      if (sortBy) {
        const validatedSortBy = validateSortColumn(sortBy);
        const validatedSortOrder = validateSortOrder(sortOrder);
        query += ` ORDER BY ${validatedSortBy} ${validatedSortOrder}`;
      }

      query += " LIMIT ? OFFSET ?";
      params.push(limit, offset);

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting outwards:', error);
      throw error;
    }
  }

  static async getOutwardById(id) {
    try {
      const result = await this.query("SELECT * FROM Outward WHERE id = ?", [id]);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting outward by ID:', error);
      throw error;
    }
  }

  static async updateOutward(data) {
    try {
      await this.query(
        "UPDATE Outward SET receivedDate = ?, gatePassDate = ?, location = ?, lotnumber = ?, item = ?, quantity = ?, issued = ?, unit = ?, marka = ?, balance = ?, receivedId = ? WHERE id = ?",
        [
          data.receivedDate,
          data.gatePassDate,
          data.location,
          data.lotnumber,
          data.item,
          data.quantity,
          data.issued,
          data.unit,
          data.marka,
          data.balance,
          data.receivedId,
          data.id,
        ]
      );
    } catch (error) {
      console.error('Error updating outward:', error);
      throw error;
    }
  }

  static async deleteOutward(id, issued, receivedId) {
    try {
      await this.transaction(async (tx) => {
        // Delete outward record
        await new Promise((resolve, reject) => {
          tx.executeSql(
            "DELETE FROM Outward WHERE id = ?",
            [id],
            () => resolve(),
            (_, error) => reject(error)
          );
        });

        // Update inward balance
        await new Promise((resolve, reject) => {
          tx.executeSql(
            "UPDATE Inward SET balance = balance + ? WHERE id = ?",
            [issued, receivedId],
            () => resolve(),
            (_, error) => reject(error)
          );
        });
      });
    } catch (error) {
      console.error('Error deleting outward:', error);
      throw error;
    }
  }

  // Search and filter operations
  static async searchInwardsForDropdown(searchQuery = '', limit = 20) {
    try {
      let query = "SELECT id, lotnumber, marka, quantity, location, item, balance FROM Inward WHERE quantity IS NOT NULL AND balance > 0";
      const params = [];

      if (searchQuery && searchQuery.trim()) {
        query += " AND (lotnumber LIKE ? OR marka LIKE ? OR item LIKE ? OR location LIKE ?)";
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
      }

      query += " ORDER BY lotnumber LIMIT ?";
      params.push(limit);

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error searching inwards for dropdown:', error);
      throw error;
    }
  }

  static async getAllInwardsForOutwards(limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') {
    try {
      const validatedSortColumn = validateSortColumn(sortColumn);
      const validatedSortOrder = validateSortOrder(sortOrder);
      
      let query = "SELECT id, lotnumber, marka, quantity, location, item, balance FROM Inward WHERE quantity IS NOT NULL AND balance > 0";
      const params = [];

      if (searchQuery && searchQuery.trim()) {
        query += " AND (lotnumber LIKE ? OR marka LIKE ? OR item LIKE ? OR location LIKE ?)";
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
      }

      query += ` ORDER BY ${validatedSortColumn} ${validatedSortOrder} LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting inwards for outwards:', error);
      throw error;
    }
  }

  static async getAvailableItems(searchQuery = '', limit = 100) {
    try {
      let query = "SELECT DISTINCT item FROM Inward WHERE item IS NOT NULL AND item != ''";
      const params = [];

      if (searchQuery && searchQuery.trim()) {
        query += " AND item LIKE ?";
        params.push(`%${searchQuery}%`);
      }

      query += " ORDER BY item LIMIT ?";
      params.push(limit);

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting available items:', error);
      throw error;
    }
  }

  // Report operations
  static async getInwardReport(fromDate, toDate, groupBy, orderby) {
    try {
      let query = "SELECT * FROM Inward WHERE receivedDate BETWEEN ? AND ?";
      const params = [fromDate, toDate];

      if (groupBy) {
        query += " GROUP BY item";
      }

      if (orderby) {
        query += ` ORDER BY ${orderby}`;
      }

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting inward report:', error);
      throw error;
    }
  }

  static async getOutwardReport(fromDate, toDate, groupBy, orderby) {
    try {
      let query = "SELECT * FROM Outward WHERE gatePassDate BETWEEN ? AND ?";
      const params = [fromDate, toDate];

      if (groupBy) {
        query += " GROUP BY item";
      }

      if (orderby) {
        query += ` ORDER BY ${orderby}`;
      }

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting outward report:', error);
      throw error;
    }
  }

  static async getStockPosition(reportType, findLotNumber, order, toDate, item, selectedItems) {
    try {
      let query = "SELECT a.id, a.receivedDate, a.paymentDate, a.location, a.lotnumber, a.item, a.quantity, a.unit, a.marka, a.balance, b.gatePassDate, b.issued, b.gatepass FROM Inward AS a LEFT JOIN Outward AS b ON a.id = b.receivedId WHERE ((b.gatePassDate IS NULL AND a.receivedDate <= ?) OR (b.gatePassDate IS NOT NULL AND b.gatePassDate <= ?))";
      const params = [toDate, toDate];

      if (reportType === "1") {
        query += " AND a.lotnumber = ?";
        params.push(findLotNumber);
      } else if (reportType === "2") {
        query += " AND a.balance > 0";
      } else if (reportType === "3") {
        query += " AND a.balance = 0";
      } else if (reportType === "5") {
        query += " AND a.balance = a.quantity";
      }

      if (item === "2" && selectedItems.length > 0) {
        const placeholders = selectedItems.map(() => "?").join(",");
        query += ` AND UPPER(a.item) IN (${placeholders})`;
        params.push(...selectedItems);
      }

      // Validate order parameter
      const validOrderOptions = ['a.id, b.id', 'a.receivedDate, a.id, b.gatePassDate, b.id', 'a.item, a.id, b.id'];
      const validatedOrder = validOrderOptions.includes(order) ? order : 'a.id, b.id';
      query += " ORDER BY " + validatedOrder;

      const result = await this.query(query, params);
      return result.rows._array;
    } catch (error) {
      console.error('Error getting stock position:', error);
      throw error;
    }
  }

  // Backup and restore operations
  static async getAllData(tableName) {
    try {
      const validatedTableName = validateTableName(tableName);
      if (!validatedTableName) {
        throw new Error("Invalid table name");
      }

      const result = await this.query(`SELECT * FROM ${validatedTableName}`);
      const tableData = [];
      for (let i = 0; i < result.rows.length; i++) {
        tableData.push(result.rows.item(i));
      }
      return tableData;
    } catch (error) {
      console.error('Error getting all data:', error);
      throw error;
    }
  }

  static async clearDatabase() {
    try {
      await this.transaction(async (tx) => {
        await new Promise((resolve, reject) => {
          tx.executeSql("DELETE FROM Inward", [], () => resolve(), (_, error) => reject(error));
        });
        await new Promise((resolve, reject) => {
          tx.executeSql("DELETE FROM Outward", [], () => resolve(), (_, error) => reject(error));
        });
        await new Promise((resolve, reject) => {
          tx.executeSql("DELETE FROM sqlite_sequence", [], () => resolve(), (_, error) => reject(error));
        });
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }

  static async insertData(data) {
    try {
      await this.transaction(async (tx) => {
        Object.keys(data).forEach((tableName) => {
          const validatedTableName = validateTableName(tableName);
          if (validatedTableName && tableName !== "User") {
            data[tableName].forEach((row) => {
              const columns = Object.keys(row).join(", ");
              const placeholders = Object.keys(row).map(() => "?").join(", ");
              const values = Object.values(row);
              
              tx.executeSql(
                `INSERT INTO ${validatedTableName} (${columns}) VALUES (${placeholders})`,
                values
              );
            });
          }
        });
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
  }

  static async restoreDatabase(data) {
    try {
      await this.clearDatabase();
      await this.insertData(data);
      console.log("Database restored successfully.");
    } catch (error) {
      console.error('Error restoring database:', error);
      throw error;
    }
  }

  // CSV import operations
  static async importCSVData(csvData) {
    try {
      await this.transaction(async (tx) => {
        csvData.forEach((element) => {
          tx.executeSql(
            "INSERT INTO Inward (receivedDate, paymentDate, location, lotnumber, item, quantity, unit, marka, balance, imageExist, imageName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              element.receivedDate || null,
              element.paymentDate || null,
              element.location,
              element.lotnumber?.toString(),
              element.item,
              element.quantity,
              element.unit,
              element.marka,
              element.quantity,
              0, // imageExist
              '', // imageName
            ]
          );
        });
      });
    } catch (error) {
      console.error('Error importing CSV data:', error);
      throw error;
    }
  }
}

export default DatabaseService; 