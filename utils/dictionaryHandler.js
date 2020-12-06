const dictionary = require('../datas/dictionary');

module.exports = {

    init: (letters) => {

        var tempString = '';

        // Search first query occurence in dictionary
        let index = dictionary.datas.search('\\n' + letters.query);

        let reading = true;

        while(reading) {

            // Add each dictionary's character from index to a temporary string
            tempString += dictionary.datas[index];
            
            // For each back line, add data to occurences
            let occurencies = [...tempString.matchAll('\\n')];

            // Looking for occurence of dictionary endpoint
            let endPoint = tempString.match('/END/');

            // At fourth back line or endpoint, get input values
            if((occurencies.length == 5) || (endPoint)) {

                reading = false;

                const results = occurencies[0].input;

                // filter occurences matching with query
                let finalResult = [...results.matchAll("\n" + letters.query + '.*')];

                finalResult = finalResult.map(elt => elt[0].replace('\n',''))

                return (finalResult.length > 0) ? finalResult : 'aucune valeur correspondante';
            }

            index++
        }

    }

};

