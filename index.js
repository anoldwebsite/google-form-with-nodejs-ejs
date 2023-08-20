const express = require("express");

const { google } = require("googleapis");

const app = express()

//**********************Front end code bgins here**************************
app.set("view engine", "ejs");
// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));
// app.use(express.static("public"));
//To receive form-encoded data.
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index")
})
//**********************Front end code bgins here**************************

app.post("/", async (req, res) => {
  const { request, name } = req.body;

  //You should have credentials.json in the root directory of your project.
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });


  // Create client instance for authentication.
  const client = await auth.getClient();

  //Instance of Google Sheets API.
  const googleSheets = google.sheets({
    version: "v4",
    auth: client
  });

  const spreadsheetId = "1OvqOr00qC8951yEPxywxvAY0EWeJjCvnYH7-NBJ5tgc";

  //Get metadata about spreadsheet
  const metadata = await googleSheets.spreadsheets.get({
    auth,  // auth: auth
    spreadsheetId,
  })

  //Read rows from spreadsheet.
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    //range: "Sheet1" // To get all the columns
    range: "Sheet1!A:B" // To get some columns e.g., only the first two columns.
  });

  // Write rows to the sheet.
  await googleSheets.spreadsheets.values.append({
    auth, spreadsheetId,
    range: "Sheet1!A:B", // Write only to the first two columns.
    //valueInputOption: "RAW", // Whatever values you put in the spreadsheet.
    valueInputOption: "USER_ENTERED", // Whatever the user entered in the form that feeds the spreadsheet. Date or number or string.
    resource: {
      values: [
        [request, name],
      ]
    },
  });
  res.send("Submitted successfully! Thank you!")

  // res.send(metadata)
  //res.send(metadata.data)
  //res.send(getRows.data)
});
/*
app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  
  // Create client instance for authentication.
  const client = await auth.getClient();

  //Instance of Google Sheets API.
  const googleSheets = google.sheets({
    version: "v4",
    auth: client
  });

  const spreadsheetId = "1OvqOr00qC8951yEPxywxvAY0EWeJjCvnYH7-NBJ5tgc";

  //Get metadata about spreadsheet
  const metadata = await googleSheets.spreadsheets.get({
    auth,  // auth: auth
    spreadsheetId,
  })

  //Read rows from spreadsheet.
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    //range: "Sheet1" // To get all the columns
    range: "Sheet1!A:B" // To get some columns e.g., only the first two columns.
  });

  // Write rows to the sheet.
  await googleSheets.spreadsheets.values.append({
    auth, spreadsheetId,
    range: "Sheet1!A:B", // Write only to the first two columns.
    //valueInputOption: "RAW", // Whatever values you put in the spreadsheet.
    valueInputOption: "USER_ENTERED", // Whatever the user entered in the form that feeds the spreadsheet. Date or number or string.
    resource: {
      values: [
        ["Upload files to Google Drive usign App Script!", "Rana"],
        ["Upload files to Google Drive usign Node.js!", "Dilshad"],
        ["Upload files to Google Drive usign Python!", "Russell"],
      ]
    }
  })

  // res.send(metadata)
  //res.send(metadata.data)
  res.send(getRows.data)
});
*/
port = 1337
app.listen(port, (req, res) => console.log("Running on port", port));
