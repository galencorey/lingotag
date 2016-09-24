angular.module('starter.services', [])

.factory('TagsFactory', function($http) {
    
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
         
         var tags = tags.join(', ');
         var url = 'https://www.googleapis.com/language/translate/v2?';
         url += 'key=' + secrets.Google;
         url += '&q=' + tags;
         url += '&source=en&target=es';

         return $http.get(url)
         .then(function(response){
               return response.data.data.translations[0].translatedText.split(', ');
          });
    }
         
    return TagsFactory;
         
});
