import { openDatabase } from "expo-sqlite/legacy";
// const db = openDatabase("db");
const db = openDatabase("db");

const createDatabase = (pin, email) => {
  // db.closeAsync();
  // db.deleteAsync();

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists Inward (id integer primary key AUTOINCREMENT, receivedDate integer, paymentDate integer, location TEXT, lotnumber TEXT, item TEXT, quantity INTEGER, unit TEXT, marka TEXT, balance INTEGER , imageExist INTEGER, imageName TEXT) ;",
        [],
        () => {
          console.log("Inward created successefully");
          tx.executeSql(
            "create table if not exists Outward (id integer primary key AUTOINCREMENT, receivedDate integer, gatePassDate integer, location TEXT, lotnumber TEXT, item TEXT, quantity INTEGER, issued INTEGER, unit TEXT, marka TEXT, balance INTEGER, receivedId INTEGER , gatepass TEXT) ;",
            [],
            () => {
              console.log("Outward created successefully");
              tx.executeSql(
                "create table if not exists User (id integer primary key AUTOINCREMENT, pin TEXT, email TEXT, biometric INTEGER) ;",
                [],
                () => {
                  console.log("UserT created successefully");
                  db.transaction((tx) => {
                    tx.executeSql(
                      "insert into User (pin, email) values (?,?);",
                      [pin, email],
                      () => {
                        resolve();
                      },
                      (_, err) => {
                        console.log(err);
                        reject(err);
                      }
                    );
                  });
                },
                (_, err) => {
                  console.log(err);
                  reject(err);
                }
              );
            },
            (_, err) => {
              console.log(err);
              reject(err);
            }
          );
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const checkDb = async () => {
  // db.closeAsync();
  // db.deleteAsync();
  return new Promise((resolve, reject) => {
    // console.log(receivedDate, paymentDate, location, lotnumber, item, quanity, unit, marka, balance);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='User';",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const checkUser = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from User",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, err) => {
          console.log(err);
          reject("error fetching");
        }
      );
    });
  });
};

const checkPassword = async (password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from User where pin = ?",
        [password],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, err) => {
          console.log(err);
          reject("error fetching");
        }
      );
    });
  });
};

const updateBiometric = async (biometric) => {
  return new Promise((resolve, reject) => {
    // console.log(biometric)
    db.transaction((tx) => {
      tx.executeSql(
        "update User set biometric=?;",
        [biometric],
        () => {
          resolve();
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const updateUserPin = async (pin) => {
  return new Promise((resolve, reject) => {
    // console.log(biometric)
    db.transaction((tx) => {
      tx.executeSql(
        "update User set pin=?;",
        [pin],
        () => {
          resolve();
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const insertInward = async (
  receivedDate,
  paymentDate,
  location,
  lotnumber,
  item,
  quanity,
  unit,
  marka,
  balance,
  imageExist,
  imageName
) => {
  return new Promise((resolve, reject) => {
    // console.log(receivedDate, paymentDate, location, lotnumber, item, quanity, unit, marka, balance);
    db.transaction((tx) => {
      tx.executeSql(
        "insert into Inward (receivedDate, paymentDate,location,lotnumber,item,quantity,unit,marka,balance, imageExist, imageName) values (?,?,?,?,?,?,?,?,?,?,?);",
        [
          receivedDate,
          paymentDate,
          location,
          lotnumber,
          item,
          quanity,
          unit,
          marka,
          balance,
          imageExist,
          imageName,
        ],
        () => {
          resolve();
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const getAllInwards = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from Inward",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        () => reject("error fetching")
      );
    });
  });
};

const getAllInwardsForOutwards = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from Inward where quantity is not null",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        () => reject("error fetching")
      );
    });
  });
};

const getInwardById = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from Inward where id = ?",
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        () => reject("error fetching")
      );
    });
  });
};

const insertOutward = async (
  receivedDate,
  gatePassDate,
  location,
  lotnumber,
  item,
  quantity,
  issued,
  unit,
  marka,
  balance,
  receivedId,
  gatepass
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into Outward (receivedDate, gatePassDate,location,lotnumber,item,quantity,issued,unit,marka,balance,receivedId,gatepass) values (?,?,?,?,?,?,?,?,?,?,?,?);",
        [
          receivedDate,
          gatePassDate,
          location,
          lotnumber,
          item,
          quantity,
          issued,
          unit,
          marka,
          balance,
          receivedId,
          gatepass,
        ],
        () => {
          tx.executeSql(
            "update Inward set balance=? where id=?",
            [balance, receivedId],
            () => {
              resolve();
            },
            (err) => {
              console.log(err);
              reject(err);
            }
          );
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const getAllOutward = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from Outward",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (err) => reject("error fetching")
      );
    });
  });
};

const updateInward = async (
  receivedDate,
  paymentDate,
  location,
  lotnumber,
  item,
  quanity,
  unit,
  marka,
  balance,
  id,
  imageExist,
  imageName
) => {
  return new Promise((resolve, reject) => {
    // console.log(receivedDate, paymentDate, location, lotnumber, item, quanity, unit, marka, balance, id, imageExist, imageName);
    db.transaction((tx) => {
      tx.executeSql(
        "update Inward set receivedDate=?, paymentDate=?,location=?,lotnumber=?,item=?,quantity=?,unit=?,marka=?,balance=?,imageExist=?,imageName=? where id=?;",
        [
          receivedDate,
          paymentDate,
          location,
          lotnumber,
          item,
          quanity,
          unit,
          marka,
          balance,
          imageExist,
          imageName,
          id,
        ],
        () => {
          resolve();
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const deleteReceivedById = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from Inward where id=?;",
        [id],
        () => {
          resolve();
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const deleteIssuedById = async (id, issued, receivedId) => {
  return new Promise((resolve, reject) => {
    // console.log(id, issued, receivedId)
    db.transaction((tx) => {
      tx.executeSql(
        "delete from Outward where id=?;",
        [id],
        () => {
          tx.executeSql(
            "update Inward set balance = balance + ? where id=?",
            [issued, receivedId],
            () => {
              resolve();
            },
            (err) => {
              console.log(err);
              reject(err);
            }
          );
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const getOutwardById = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from Outward where id = ?",
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        () => reject("error fetching")
      );
    });
  });
};

const updateOutwards = async (
  receivedDate,
  gatePassDate,
  location,
  lotnumber,
  item,
  quantity,
  issued,
  unit,
  marka,
  balance,
  id,
  receivedId
) => {
  return new Promise((resolve, reject) => {
    // console.log(receivedDate, gatePassDate, location, lotnumber, item, quantity, issued, unit, marka, balance, receivedId, id);
    db.transaction((tx) => {
      tx.executeSql(
        "update Outward set receivedDate=?, gatePassDate=?,location=?,lotnumber=?,item=?,quantity=?,issued=?,unit=?,marka=?,balance=? where id=?",
        [
          receivedDate,
          gatePassDate,
          location,
          lotnumber,
          item,
          quantity,
          issued,
          unit,
          marka,
          balance,
          id,
        ],
        () => {
          tx.executeSql(
            "update Inward set balance=? where id=?",
            [balance, receivedId],
            () => {
              resolve();
            },
            (err) => {
              console.log(err);
              reject(err);
            }
          );
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });
};

const getInwardReport = async (fromDate, toDate, groupBy, orderby) => {
  var query =
    "select * from Inward where receivedDate >= ? and receivedDate <= ? ORDER by ?";

  if (groupBy) {
    query =
      "select * from Inward where receivedDate >= ? and receivedDate <= ? ORDER by item,?";
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [fromDate, toDate, orderby],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        () => reject("error fetching")
      );
    });
  });
};

const getOutwardReport = async (fromDate, toDate, groupBy, orderby) => {
  var query =
    "select * from Outward where gatePassDate >= ? and gatePassDate <= ? ORDER by ?";

  if (groupBy) {
    query =
      "select * from Outward where gatePassDate >= ? and gatePassDate <= ? ORDER by item,?";
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [fromDate, toDate, orderby],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        () => reject("error fetching")
      );
    });
  });
};

const getReceivedItems = async () => {
  var query = "select DISTINCT upper(item) from Inward ";

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, err) => {
          reject("error fetching");
          console.log(err);
        }
      );
    });
  });
};

const getStockPosition = async (
  reportType,
  findLotNumber,
  order,
  toDate,
  item,
  selectedItems
) => {
  var query =
    "select a.id, a.receivedDate, a.paymentDate,a.location,a.lotnumber,a.item,a.quantity,a.unit,a.marka,a.balance, b.gatePassDate,b.issued,b.gatepass from Inward as a LEFT JOIN Outward as b on a.id = b.receivedId where ((b.gatePassDate is null and a.receivedDate<=" +
    toDate +
    ") or (b.gatePassDate is not null and b.gatePassDate <=" +
    toDate +
    "))";

  if (reportType === "1") {
    query += " and a.lotnumber='" + findLotNumber + "'";
  } else if (reportType === "2") {
    query += " and a.balance > 0";
  } else if (reportType === "3") {
    query += " and a.balance = 0";
  } else if (reportType === "5") {
    query += " and a.balance = a.quantity";
  }

  if (item === "2") {
    query += " and upper(a.item) in (";
    selectedItems.forEach((element, index) => {
      query += "'" + element + "'";
      if (index < selectedItems.length - 1) {
        query += ",";
      }
    });
    query += ")";
  }

  query += " order by " + (order ? order : "a.id, b.id");

  // console.log(query);

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, err) => {
          reject("error fetching");
          console.log(err);
        }
      );
    });
  });
};

const getTableNames = () => {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'",
        [],
        (transaction, result) => {
          const tableNames = [];
          for (let i = 0; i < result.rows.length; i++) {
            tableNames.push(result.rows.item(i).name);
          }
          resolve(tableNames);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

const getAllData = (tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        (transaction, result) => {
          const tableData = [];
          for (let i = 0; i < result.rows.length; i++) {
            tableData.push(result.rows.item(i));
          }
          resolve(tableData);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

const restoreDb = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Clear existing data if needed (optional)
      await clearDatabase();

      // Iterate over the extracted data and perform INSERT operations
      await insertData(data);

      console.log("Database restored successfully.");
      resolve();
    } catch (error) {
      console.error("Error restoring database:", error);
      reject(error);
    }
  });
};

// Function to clear existing data (including sqlite_sequence)
async function clearDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(
      async (tx) => {
        tx.executeSql("DELETE FROM Inward;");
        tx.executeSql("DELETE FROM Outward;");
        tx.executeSql("DELETE FROM sqlite_sequence;");
      },
      (_, error) => {
        console.error("Error clearing database:", error);
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
}

// Function to insert data
async function insertData(data) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Iterate over the data and perform INSERT statements for each table
        Object.keys(data).forEach((tableName) => {
          if (tableName !== "User") {
            data[tableName].forEach((row) => {
              const columns = Object.keys(row).join(", ");
              const placeholders = Object.keys(row)
                .map(() => "?")
                .join(", ");
              const values = Object.values(row);
              tx.executeSql(
                `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`,
                values
              );
            });
          }
        });
      },
      (_, error) => {
        console.error("Error inserting data:", error);
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
}

const Transaction = {
  createDatabase,
  insertInward,
  getAllInwards,
  getAllInwardsForOutwards,
  getInwardById,
  insertOutward,
  getAllOutward,
  updateInward,
  deleteReceivedById,
  deleteIssuedById,
  getOutwardById,
  updateOutwards,
  getInwardReport,
  getOutwardReport,
  getReceivedItems,
  getStockPosition,
  checkUser,
  checkPassword,
  updateBiometric,
  checkDb,
  updateUserPin,
  getAllData,
  getTableNames,
  restoreDb,
};

export default Transaction;
