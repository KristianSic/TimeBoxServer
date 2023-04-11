let _ = {}

_.name = () => {
  const regex = "[-'A-Za-z0-9 ]+"
  const constraints = {
    presence: {
      allowEmpty: false
    },
    type: 'string',
    format: {
      pattern: regex,
      flags: 'i',
      message: 'invalid name format'
    }
  }
  return constraints
}

_.email = () => {
  const constraints = {
    presence: {
      allowEmpty: false
    },
    email: true,
    type: 'string'
  }
  return constraints
}

_.password = () => {
  const constraints = {
    presence: {
      allowEmpty: false
    },
    type: 'string',
    length: {
      minimum: 5,
    }
  }
  return constraints
}


export default _
