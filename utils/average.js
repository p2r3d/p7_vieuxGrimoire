// Calcul de la moyenne des notes
exports.calculateAverage = (notesArray) => {
  let sum = 0;
  for (let note of notesArray) {
    sum += note ;
  }
  // calcul de la moyenne avec 1 chiffre après la virgule
  const average = (sum / notesArray.length).toFixed(1);
  return (average);
}