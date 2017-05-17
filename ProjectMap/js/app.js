
var markers = []; //array of  markers

// array of locations
var locations = [{
        title: 'Lucknow',
        location: {
            lat: 26.8466937,
            lng: 80.946166
        },
        show: true,
        selected: false,
        venueId: '4d160de9816af04d502447c2'
       
    },
    {
        title: 'Agra',
        location: {
            lat: 27.1766701,
            lng: 78.0080745
        },
        show: true,
        selected: false,
        venueId: '4b741405f964a520bec62de3'
       
    },
    {
        title: 'Allahabad',
        location: {
            lat: 25.4358011,
            lng: 81.846311
        },
        show: true,
        selected: false,
        venueId: '4d8b97f2cdfbb60c9fc35707'
       
    },
    {
        title: 'Meerut',
        location: {
            lat: 28.9844618,
            lng: 77.7064137
     },
        show: true,
        selected: false,
        venueId: '4d42b3c07fb05481e17e6d79'
      
},
    {
        title: 'Mathura',
        location: {
            lat: 27.4924134,
            lng: 77.673673
        },
        show: true,
        selected: false,
        venueId: '4d1eabb3d7b0b1f7e895069f'
        
  },
    {
        title: 'Saharanpur',
        location: {
            lat: 29.967079,
            lng: 77.5510172
        },
        show: true,
        selected: false,
        venueId: '4d6121f15b276dcb67211fc6'
        
}
];

var Model = function()//view model function
{

this.errorDisplay = ko.observable(' ');

var defaultIcon = makeMarkerIcon('0091ff'); 
var highlightedIcon = makeMarkerIcon('FFFF24');
var largeInfowindow = new google.maps.InfoWindow();

var marker;
var bounds = new google.maps.LatLngBounds();
for (var i =0 ;i< locations.length; i++)
{
var position = locations[i].location;
var title = locations[i].title;
marker = new google.maps.Marker({
map: map,
position: position,
title: title,
icon: defaultIcon,
animation: google.maps.Animation.DROP,
selected :locations[i].selected,
venue: locations[i].venueId,
rating:' ',
image:' ',
likes:' ',
show: ko.observable(true)
});

//push markers
markers.push(marker);
//extend bounds
bounds.extend(marker.position);
map.fitBounds(bounds);

//adding listeners

marker.addListener('mouseover',function(){
this.setIcon(highlightedIcon);
});

marker.addListener('mouseout',function(){
this.setIcon(defaultIcon);
});

// to open info window
marker.addListener('click',function(){
populateInfoWindow(this, largeInfowindow);
});

//to bounce markers when clicked 
 marker.addListener('click', function(){
toggleBounce(this);
});
}

//bounce function
function toggleBounce(marker) {

        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } 
  else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(stopMarkerBounce,800);
          function stopMarkerBounce() 
             { marker.setAnimation(null);
             }     
}
}
 

this.query = ko.observable('');
this.filterList = function() {
var inSearch = this.query();
largeInfowindow.close();

  //list for user serach

if(inSerarch.length === 0) {
this.showAll(true);
}
else{
for(i=0;i<this.markers.length; i++){
  if(this.markers[i].title.toLowerCase().indexOf(inSearch.toLowerCase())>=0){
      this.markers[i].show(true);
      this.markers[i].setVisible(true);
}
else
{
    this.markers[i].show(false);
     this.markers[i].setVisible(false);
}
}
}
largeInfowindow.close();
};

this.showAll = function(v) {
for(i=0;i<this.markers.length;i++) {
this.markers[i].show(v);
this.markers[i].setVisible(v);
}
};
this.selectAll = function(marker) {
populateInfoWindow(marker, largeInfowindow);
marker.selected = true;
marker.setAnimation(google.maps.Animation.BOUNCE);
setTimeout(stopBounce,500);
function stopBounce(){
marker.setAnimation(null);
}
};

markers.forEach(function(marker)
{
$.ajax({
method: 'GET',
datatype: "json",
url: "https://api.foursquare.com/v2/venues" + marker.venue + "?client_id=986448138067-nm3l17r16jfogl0acee54ti3av8e2g1g.apps.googleusercontent.com  ",
success: function(data){
var venue = data.response.venue;
var imgurl = data.response.venue.photos.groups[0].items[0];
if((likes.hasOwnProperty('likes')) || (venue.hasOwnProperty('rating')) || ((imgurl.hasOwnProperty('prefix')) && (imgurl.hasOwnProperty('suffix'))))
{
marker.likes= venue.likes;
marker.rating = venue.rating;
marker.image = imgurl.prefix + "100x100" + imgurl.suffix;
}
else
{
marker.rating = '0';
marker.imgurl = '0';
marker.likes = '0';
}
},
error: function(e) {
 this.errorDisplay("Error in fetching foursquare data,Please try later");
}

});
});


function populateInfoWindow(marker , infowindow) {
 if(infowindow.marker !=marker) {
  infowindow.marker = marker;
  infowindow.setContent('<div>'+ '<h3>'  + marker.title + '</h3>' + "<h4>Ratings:" + marker.rating + '</h4>'+ "<h4>Likes:" + marker.likes +'</h4></div><div><img src="' + marker.image + '"></div>');
if(marker.rating!==null || marker.image !==null){  
infowindow.open(map, marker);
}
  infowindow.addListener('closeclick',function(){
  infowindow.setMarker(null);
});
}
}


function makeMarkerIcon(markerColor) {
 var markerImage = new google.maps.MarkerImage(
  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+markerColor+'|40|_|%E2%80%A2',
  new google.maps.Size(21, 34),
   new google.maps.Point(0, 0),
new google.maps.Point(10, 34),
new google.maps.Size(21, 34));
return markerImage;
}

};