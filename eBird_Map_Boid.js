const flock = [];

var mapimg;
var obs;

// chicago downtown: 41.8781, -87.6298
// cricket hill: 41.964344, -87.641992
// berthoud: 40.3083, -105.0811

var clat = 41.964344;
var clon = -87.641992;

var zoom = 9.5;

// mapbox.js API token: pk.eyJ1IjoiYWxhbmpwZXJyeSIsImEiOiJja2NiYXE3Y3kwZHgwMnpuMDk3eWh5djY3In0.KOa0Mh5ZpqjTMTc37id1EQ

var mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/'+clon+','+clat+','+zoom+'/1024x720?access_token=pk.eyJ1IjoiYWxhbmpwZXJyeSIsImEiOiJja2NiYXE3Y3kwZHgwMnpuMDk3eWh5djY3In0.KOa0Mh5ZpqjTMTc37id1EQ&logo=false';
var ebirdUrl = 'https://api.ebird.org/v2/data/obs/geo/recent?lat='+clat+'41&lng='+clon+'&sort=species&key=6t6ts0l0p8r3'; 

function preload() {
  mapimg = loadImage(mapUrl);
  loadJSON(ebirdUrl, gotData, "JSON");
}

function gotData(data) {
  obs = data;
  console.log(obs);
}

function setup() {
  noStroke();

  createCanvas(1024, 720);
  translate(width/2, height/2);
  imageMode(CENTER);
  image(mapimg, 0, 0);

  var cx = mercX(clon);
  var cy = mercY(clat);

  for (var i = 0; i < obs.length; i++) {
    var lat = obs[i].lat;
    var lon = obs[i].lng;
    var birdMag = obs[i].howMany;

    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;

    fill(255, 200);
    textAlign(CENTER);
    text(obs[i].comName, x, y - 10);

    fill(birdMag * 10, 0, 255, 160);
    ellipse(x, y, 5 + birdMag, 5 + birdMag);
    
    flock.push(new Boid(x, y));
  }
  
  console.log("# of boids: " + flock.length);
  /*
  for (let i = 0; i < 100; i++) {
    flock.push(new Boid(0, 0));
  }
  */
}

function drawMapData() {
  noStroke();
  translate(width/2, height/2);

  imageMode(CENTER);
  image(mapimg, 0, 0);

  var cx = mercX(clon);
  var cy = mercY(clat);

  for (var i = 0; i < obs.length; i++) {
    var lat = obs[i].lat;
    var lon = obs[i].lng;
    var birdMag = obs[i].howMany;

    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;

    fill(255, 200);
    textAlign(CENTER);
    text(obs[i].comName, x, y - 10);

    fill(birdMag * 10, 0, 255, 160);
    ellipse(x, y, 5 + birdMag, 5 + birdMag);
  }
}

function draw() {
  drawMapData();

  // boid functions go here buddy
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI/4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}
