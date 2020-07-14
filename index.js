//
const fs = require('fs')
const express = require('express')

const app = express()

app.use(express.json())

const path = './kodemia.json'

const getJson = path => {
  return JSON.parse(fs.readFileSync(path))
}

const saveOnFile = (path, newData) => {
  const jsonAsString = JSON.stringify(newData, '\n', 2)
  fs.writeFileSync(path, jsonAsString)
}

/* API REST */

app.get('/koders', (request, response) => {
  const koders = getJson(path).koders
  console.log(koders)
  response.status(200).json({
    success: true,
    data: {
      koders,
    },
  })
})

app.post('/koders', (request, response) => {
  console.log('Request body: ', request.body)
  const kodemia = getJson(path)
  kodemia.koders.push(request.body)

  saveOnFile(path, kodemia)
  response.json({
    success: true,
    data: {
      kodemia,
    },
  })
})

app.delete('/koders/:name', (request, response) => {
  const name = request.params.name.toLowerCase()
  const kodemia = getJson(path)
  const result = kodemia.koders.some(koder => {
    return koder.name.toLowerCase() === name
  })

  if (result) {
    const filteredKoders = kodemia.koders.filter(koder => {
      return koder.name.toLowerCase() !== name
    })
    kodemia.koders = filteredKoders
    saveOnFile(path, kodemia)
    response.json({
      success: true,
      data: {
        filteredKoders,
      },
    })
  } else {
    response.status(400).json({
      success: false,
      message: 'Koder does not exist',
    })
  }
})

app.patch('/koders/:name', (request, response) => {
  const currentName = request.params.name.toLowerCase()
  const newName = request.body.name
  const newGener = request.body.gender

  const kodemia = getJson(path)

  const indexKoder = kodemia.koders.findIndex(koder => {
    return koder.name.toLowerCase() === currentName
  })
  const koder = kodemia.koders[indexKoder]

	if (indexKoder != -1) {
	koder.name = koder.name != newName ? newName : koder.name
    koder.gender = koder.gender != newGender ? newGender : koder.gender
    saveOnFile(path, kodemia)
    response.status(200).json({
      success: true,
      data: kodemia,
    })
  } else {
    response.status(400).json({
      success: false,
      message: 'Not found',
    })
  }
})

app.listen(8080, () => {
  console.log('SERVER IS READY')
})
