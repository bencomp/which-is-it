export class Model {
    constructor() {
    }
}

export function querySparql(sp, callback){
	console.log("query sparql");
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
			  callback(items);
	return
}
/*	var engine = Comunica.newEngine();
  var self = this;
	engine.query(sp ,   { sources: [
			{ type: 'file', value: 'https://flow.recipes/ns/core' },
			{ type: 'file', value: 'https://flow.recipes/ns/schemes' }
		] }).then(function (result){
			engine.resultToString(result, 'application/sparql-results+json', result.context).then((d) => {
			var res = '';
			d.data.on('data', (a) => { res += a });
			d.data.on('end', () => {
				console.log(res) ;
				var prefix = "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix core:  <https://flow.recipes/ns/core#> .  @prefix skos: <http://www.w3.org/2008/05/skos#> . ";
        console.log(prefix + res);
			  callback(items);
			});
		});
    });
}*/

export function getItems(callback){
  function format(literals, ...substitutions) {
	    let result = '';
	
	    for (let i = 0; i < substitutions.length; i++) {
	        result += literals[i];
	        result += substitutions[i];
	    }
	    // add the last literal
	    result += literals[literals.length - 1];
	    return result;
	}
	
   	let query = format`
        SELECT * 
        WHERE { 
          ?s ?p ?o. 
        } 
        LIMIT 10`;
    this.querySparql(query, callback);
}
