angular.module('starter.services', [])

.factory('TagsFactory', function($http, $rootScope) {
    
    var TagsFactory = {};
         
    TagsFactory.getTags = function(img){
         var url = 'https://api.clarifai.com/v1/tag/';
         return $http({
               method: 'POST',
               url: url,
               headers: {
                    Authorization: 'Bearer ' + secrets.Clarifai
               },
               data: {
                    encoded_data: img
               }
         })
         .then(function(response){
               return response.data.results[0].result.tag.classes;
          });
    };
         
         
    TagsFactory.translateTags = function(tags, lan){
         
         var language = $rootScope.language || 'de';
         var tags = tags.join(', ');
         var url = 'https://www.googleapis.com/language/translate/v2?';
         url += 'key=' + secrets.Google;
         url += '&q=' + tags;
         url += '&source=en&target=' + language;

         return $http.get(url)
         .then(function(response){
               return response.data.data.translations[0].translatedText.split(', ');
          });
    }
         
    return TagsFactory;
         
})

.factory('StorageFactory', function($q){
         
         var StorageFactory = {};
         var i = 0;
         
         StorageFactory.addCards = function(cards){
            cards = JSON.stringify(cards);
            localStorage.setItem(i.toString(), cards);
            i++;
         
//             cards.forEach(function(card){
//               localStorage.setItem(i.toString(), JSON.stringify(card));
//                i++;
//             })
         }
         
         StorageFactory.getAll = function(){
            var promises = [];
            for (var k = 0; k < localStorage.length; k++){
                promises.push(localStorage.getItem(k.toString()));
            }
         
            return promises.map(function(elem){return JSON.parse(elem)});
         }
         return StorageFactory;
         
});
