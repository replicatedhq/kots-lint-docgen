#!/usr/bin/env node
import getStdin from 'get-stdin'

/* Uncomment if we end up needing args
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
const argv = yargs(hideBin(process.argv)).argv
const [, ...args] = argv._
console.log('args:', args)
*/

const extractOutputField = (output, fieldName) => {
  const field = output.find(outputItem => {
    return outputItem.find(({ type, value }) => {
      return type === 'string' && value === fieldName
    })
  })
  return field[1].value
}

const parse = json => {
  const input = JSON.parse(json)
  const rules = input.rules.filter(rule => rule.head.name === 'lint')
  const defs = rules.map(rule => {
    const body = rule.body.find(({ terms }) => {
      if (!terms.some) {
        return
      }
      return terms.some(({ type, value }) => {
        return type === 'var' && value === 'output'
      })
    })
    const termIndex = body.terms.findIndex(({ type, value }) => {
      return type === 'var' && value === 'output'
    }) + 1
    const output = body.terms[termIndex].value
    const name = extractOutputField(output, 'rule')
    const type = extractOutputField(output, 'type')
    const message = extractOutputField(output, 'message')
    return { rule: name, type, message }
  })
  const markdown = defs.map(({ rule, type, message }) => {
    return `
  ### ${rule}
  Level: ${type}

  ${message}
`
  }).join('\n')

  return markdown
}

const run = async () => {
  const json = await getStdin()
  const markdown = parse(json)
  console.log(markdown)
}

run()
