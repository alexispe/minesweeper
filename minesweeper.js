let createMap = (height,width) => {
  const map = [];
  let html = '';
  console.log(height,width);
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      $('.map').append('<div></div>');
    }
  }
  console.log(html);
}

createMap(10,20)
// console.log('kqgsvhjbn');
//
// console.log($('.map'));
// $('.map').addClass('yo')
