export default function(babel) {
  const {types: t} = babel

  return {
    name: 'captains-log',
    visitor: {
      CallExpression(path) {
        if (
          !deepEqual(path, {
            node: {
              callee: {
                type: 'MemberExpression',
                object: {
                  name: 'console',
                },
              },
            },
          })
        ) {
          return
        }
        let prefix = ''
        const parentFunction = path.findParent(t.isFunctionDeclaration)
        if (parentFunction) {
          prefix += parentFunction.node.id.name
        }
        const start = path.node.loc.start
        prefix += ` ${start.line}:${start.column}`
        path.node.arguments.unshift(t.stringLiteral(prefix.trim()))
      },
    },
  }
}

function deepEqual(a, b) {
  return (
    a &&
    b &&
    Object.keys(b).every(bKey => {
      const bVal = b[bKey]
      const aVal = a[bKey]
      if (typeof bVal === 'function') {
        return bVal(aVal)
      }
      return isPrimative(bVal) ? bVal === aVal : deepEqual(aVal, bVal)
    })
  )
}
function isPrimative(val) {
  return val == null || /^[sbn]/.test(typeof val)
}
