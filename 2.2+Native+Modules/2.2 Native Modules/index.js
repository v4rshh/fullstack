console.log("Hello, World!");
const fs=require("fs");
// fs.writeFile("message2.txt", "wtf u doing in gym", (err) => {
//   if (err) throw err;
//   console.log("The file has been saved!");
// });
fs.readFile("./message2.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// utf 8 encodes the data into a string instead of a buffer.