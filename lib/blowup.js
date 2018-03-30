/**
 * blowup.js
 * Paul Krishnamurthy 2016
 *
 * https://paulkr.com
 * paul@paulkr.com
 */

$(function ($) {

  $.fn.blowup = function (attributes) {

	  // Default attributes
    var defaults = {
      round      : true,
      width      : 200,
      height     : 200,
	    id 		     : "blowup_lens",
	    container  : "body",
      background : "#FFF",
      shadow     : "0 8px 17px 0 rgba(0, 0, 0, 0.2)",
      border     : "6px solid #FFF",
      cursor     : true,
      zIndex     : 999999,
      scale      : 1
    }

	  var $element = this;
	
    // If the target element is not an image
    if (!$element.is("img")) 
	  {
		  console.log("%cBlowup.js Error: Target element is not an image.", "color: red;");
		  return;
    }

    // Update defaults with custom attributes then verify it.
    var $options = $.extend(defaults, attributes);
	  if (!$options.container)
	  {
		  console.log("%cBlowup.js Error: Container option is invalid.", "color: red;");
		  return;
	  }
	  if (!$options.id)
	  {
		  console.log("%cBlowup.js Error: Blowup container ID is invalid.", "color: red;");
		  return;
	  }
	
	  // Constants
    var $IMAGE_URL    = $element.attr("src");
    var $IMAGE_WIDTH  = $element.width();
    var $IMAGE_HEIGHT = $element.height();
    var NATIVE_IMG    = new Image();
	  if ($IMAGE_URL.indexOf("data:") != -1)
	  {
		  $IMAGE_URL = $IMAGE_URL.replace(/(\r\n|\n|\r)/gm, "");
	  }
	
	  // Source de l'image.
    NATIVE_IMG.src    = $element.attr("src");

    // Modify target image
    $element.on('dragstart', function (e) { e.preventDefault(); });
    $element.css("cursor", $options.cursor ? "crosshair" : "none");

    // Create magnification lens element
	  var lens = $('<div></div>');
	  var ls_selector = "div#" + $options.id;
	
	  // Set ID.
	  lens.attr("id", $options.id);

    // Attach the element to the specified container.
	  if ($($options.container).find(ls_selector).length == 0)
	  {
		  $($options.container).append(lens);
	  }

    // Updates styles.
    lens.css({
      "position"          : "absolute",
      "visibility"        : "hidden",
      "pointer-events"    : "none",
      "z-index"           : $options.zIndex,
      "width"             : $options.width,
      "height"            : $options.height,
      "border"            : $options.border,
      "background-color"  : $options.background,
      "border-radius"     : $options.round ? "50%" : "none",
      "box-shadow"        : $options.shadow,
      "background-repeat" : "no-repeat",
    });
	
    // Show magnification lens.
    $element.off("mouseenter.BW");
    $element.on("mouseenter.BW", function () {
      $(ls_selector).css("visibility", "visible");
    });

    // Mouse motion on image.
    $element.off("mousemove.BW");
    $element.on("mousemove.BW", function (e) {

      // Lens position coordinates
      var lensX = e.pageX - $options.width / 2;
      var lensY = e.pageY - $options.height / 2;

      // Relative coordinates of image
      var relX = e.pageX - $(this).offset().left;
      var relY = e.pageY - $(this).offset().top;
     
      // Zoomed image coordinates 
      var zoomX = -Math.floor(relX / $element.width() * (NATIVE_IMG.width * $options.scale) - $options.width / 2);
      var zoomY = -Math.floor(relY / $element.height() * (NATIVE_IMG.height * $options.scale) - $options.height / 2);

      var backPos = zoomX + "px " + zoomY + "px";
      var backgroundSize = NATIVE_IMG.width * $options.scale + "px " + NATIVE_IMG.height * $options.scale + "px";

      // Apply styles to lens	  
      $(ls_selector).css({
        "left"                : lensX,
        "top"                 : lensY,
        "background-image"    : "url(" + $IMAGE_URL + ")",
        "background-size"     : backgroundSize,
        "background-position" : backPos
      });
    });

    // Hide magnification lens.
	$element.off("mouseleave.BW");
    $element.on("mouseleave.BW", function () {
      $(ls_selector).css("visibility", "hidden");
    })
  }
})
