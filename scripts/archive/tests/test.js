async function fetchSheetData(spreadsheetId, queryStr) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&${queryStr}&headers=1`;
  console.log(url);
}
fetchSheetData('1mdFJwRXRB-xBYiDMJK0LoUD9n3Jf9iF1x6NH1V4W1gY', 'gid=0');
