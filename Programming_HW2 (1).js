let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

// imageMap(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMap(img, func) {
  let image = img.copy();
  for (let i = 0; i < image.width; i = i + 1) {
    for (let j = 0; j < image.height; j = j + 1) {
      image.setPixel(i, j, func(image, i, j));
    }
  }
  return image;
}

// imageMask(img: Image, func: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask(img, func, maskValue) {
  let image = img.copy();

  function mask(img, x, y) {
    if (func(img, x, y) === true) {
      return maskValue;
    } else {
      return img.getPixel(x, y);
    }
  }

  return imageMap(image, mask);
}

// blurPixel Helper Method: Get average of the pixel's color value (RGB).
// getBlurredAvgColor(pic: Image, x: number, y: number, startingPixel: number, stoppingPixel: number): Pixel
function getBlurredAvgColor(pic, x, y, startingPixel, stoppingPixel) {
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  let rgbList = [];

  for (let i = startingPixel; i < stoppingPixel; i = i + 1) {
    redSum = redSum + (pic.getPixel(i, y)[0]);
    greenSum = greenSum + (pic.getPixel(i, y)[1]);
    blueSum = blueSum + (pic.getPixel(i, y)[2]);
  }

  let diff = stoppingPixel - startingPixel;
  rgbList.push(redSum / diff);
  rgbList.push(greenSum / diff);
  rgbList.push(blueSum / diff);

  return rgbList;
}

// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(img, x, y) {
  let finalBlurredColor = [];

  if (img.width < 11) { // If the image is very small (< 10 pixels wide)
    finalBlurredColor = getBlurredAvgColor(img, x, y, 0, img.width);
  } else if (x < 5) { // First 5 pixels in a row
    finalBlurredColor = getBlurredAvgColor(img, x, y, 0, 5);
  } else if (x > img.width - 6) { // Last 5 pixels in a row
    finalBlurredColor = getBlurredAvgColor(img, x, y, img.width - 5, img.width);
  } else { // Any pixels other than the outer 5 rows
    finalBlurredColor = getBlurredAvgColor(img, x, y, x - 5, x + 6);
  }

  // Return new blurred Pixel color.
  return finalBlurredColor;
}

// blurImage(img: Image): Image
function blurImage(img) {
  let image = img.copy();
  return imageMap(image, blurPixel);
}

// isDark(img: Image, x: number, y: number): boolean
function isDark(img, x, y) {
  let pixel = img.getPixel(x, y);
  if (pixel[0] < 0.5 && pixel[1] < 0.5 && pixel[2] < 0.5) {
    return true;
  } else {
    return false;
  }
}

// darken(img: Image): Image
function darken(img) {
  let image = img.copy();

  function black(img, x, y) {
    if (isDark(img, x, y) === true) {
      return [0, 0, 0];
    } else {
      return img.getPixel(x, y);
    }
  }

  return imageMap(image, black); 
}

// isLight(img: Image, x: number, y: number): boolean
function isLight(img, x, y) {
  let pixel = img.getPixel(x, y);
  if (pixel[0] >= 0.5 && pixel[1] >= 0.5 && pixel[2] >= 0.5) {
    return true;
  } else {
    return false;
  }
}

// lighten(img: Image): Image
function lighten(img) {
  let image = img.copy();

  function white(img, x, y) {
    if (isLight(img, x, y) === true) {
      return [1, 1, 1];
    } else {
      return img.getPixel(x, y);
    }
  }

  return imageMap(image, white); 
}

// lightenAndDarken(img: Image): Image
function lightenAndDarken(img) {
  let image = img.copy();

  function blackAndWhite(img, x, y) {
    if (isLight(img, x, y) === true) {
      return [1, 1, 1];
    } else if (isDark(img, x, y) === true) {
      return [0, 0, 0];
    } else {
      return img.getPixel(x, y);
    }
  }

  return imageMap(image, blackAndWhite); 
}

// Testing: Return red image
// imageMap(robot, function(img, x, y) {
//   const c = img.getPixel(x, y);
//   return [c[0], 0, 0];
// }).show();

// Testing: Return horizontally red lined/masked image
// imageMask(robot, 
//           function(img, x, y) {
//             return (y % 10 === 0);
//           }, 
//           [1, 0, 0]).show();

// Testing: Return blurred image
// blurImage(robot).show();

// Testing: Return darkened image
// darken(robot).show();

// Testing: Return lightened image
// lighten(robot).show();

// Testing: Return darkened and lightened image
// lightenAndDarken(robot).show();