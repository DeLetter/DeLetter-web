import Papa from 'papaparse'
export const parseCSV = <T extends () => Promise<any>>(csv: File) => {
  //TODO: add type for the Promise
  return new Promise(async (resolve) => {
    Papa.parse(csv, {
      complete: (results) => {
        resolve(results.data)
      },
      error: (error) => {
        console.log('parseCSV error', error)
      },
    })
  })
}
