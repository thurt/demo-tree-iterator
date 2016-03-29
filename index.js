class Leaf {
  constructor(opts) {
    this.val = opts.val
    this.type = 'Leaf'
  }
}

class Branch {
  constructor(opts) {
    this.type = 'Branch'
    this.items = opts.items.map(c_state => new c_state.type(c_state))
    this[Symbol.iterator] = function() {
      var self = this
      var i = 0
      var branches = []
      return {
        next() {
          if (i < self.items.length) {
            var item = self.items[i++]
            if (item instanceof Branch) {
              branches.push(item)
              return this.next()
            }
            else return { value: item }
          }
          else if (branches.length) {
            self = branches.shift()
            i = 0
            return this.next()
          }
          else return { done: true }
        }
      }
    }
  }
}

// L1: 1, 2, 3
// L2: 4, 5, 6, 7
// L3: 8, 9
// L4: 10, 11
const myTree = new Branch({
  items: [
    { type: Leaf, val: 1 },
    { type: Leaf, val: 2 },
    { type: Branch, items: [
        { type: Leaf, val: 4 },
        { type: Leaf, val: 5 },
        { type: Branch, items: [
            { type: Leaf, val: 8 },
            { type: Branch, items: [
                { type: Leaf, val: 10 }
              ]  },
            { type: Leaf, val: 9 }
          ]  },
      ] },
    { type: Leaf, val: 3 },
    { type: Branch, items: [
        { type: Branch, items: [
            { type: Branch, items: [
                { type: Leaf, val: 11 }
              ] }
          ] },
        { type: Leaf, val: 6 },
        { type: Leaf, val: 7 },
      ] }
  ]
})

for (var leaf of myTree) console.log(leaf)
  /* Result:
    { type: 'Leaf', val: 1 }
    { type: 'Leaf', val: 2 }
    { type: 'Leaf', val: 3 }
    { type: 'Leaf', val: 4 }
    { type: 'Leaf', val: 5 }
    { type: 'Leaf', val: 6 }
    { type: 'Leaf', val: 7 }
    { type: 'Leaf', val: 8 }
    { type: 'Leaf', val: 9 }
    { type: 'Leaf', val: 10 }
    { type: 'Leaf', val: 11 }
  */