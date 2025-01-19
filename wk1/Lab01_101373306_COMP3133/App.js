const fs = require('fs');
const csv = require('csv-parser');

const canadaFile = 'canada.txt';
const usaFile = 'usa.txt';

// 1. Delete canada.txt if it exists
if (fs.existsSync(canadaFile)) {
  fs.unlinkSync(canadaFile);
}

// 2. Delete usa.txt if it exists
if (fs.existsSync(usaFile)) {
  fs.unlinkSync(usaFile);
}

// 3. Create write streams
const writeStreamCanada = fs.createWriteStream(canadaFile);
const writeStreamUSA = fs.createWriteStream(usaFile);

// 4. Optional: Write header lines
writeStreamCanada.write('country,year,population\n');
writeStreamUSA.write('country,year,population\n');

// 5. Read the CSV and filter
fs.createReadStream('input_countries.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (row.country === 'Canada') {
      writeStreamCanada.write(`${row.country},${row.year},${row.population}\n`);
    } else if (row.country === 'United States') {
      writeStreamUSA.write(`${row.country},${row.year},${row.population}\n`);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
    console.log('Filtered data has been written to canada.txt and usa.txt');
  });
