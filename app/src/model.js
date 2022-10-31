export class Model {
    constructor() {
    }
}


export function getItems(callback){
  let items = [
    {id: 1, image: "/vite.svg"},
    {id: 2, image: "/vite.svg"},
    {id: 3, image: "/vite.svg"},
    {id: 4, image: "/vite.svg"},
    {id: 5, image: "/vite.svg"},
    {id: 6, image: "/vite.svg"},
    {id: 7, image: "/vite.svg"},
    {id: 8, image: "/vite.svg"},
    {id: 9, image: "/vite.svg"},
    {id: 10, image: "/vite.svg"},
  ]
  callback(items)
}
