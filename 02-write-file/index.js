const readline = require('readline');
const fileSystem = require('fs');

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filename = './02-write-file/output.txt';


function writeToFile(data) {
  fileSystem.appendFile(filename, data + '\n', (err) => {
    if (err) throw err;
    console.log('Данные добавлены в файл');
  });
}


console.log('Привет! Введите текст для записи в файл или введите "exit" для завершения.');

rlInterface.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Было приятно пообщаться, вы вышли из программы. До следующих встреч!');
    rlInterface.close();
  } else {
    writeToFile(input);
    console.log('Введите следующий текст или введите "exit" для завершения.');
  }
});

